// Typed event bus — Space Station 14's local-event discipline, adopted at design level.
// SS14 raises a local event on an entity and every subscribed system reacts inside the
// same tick; systems never import each other, so the event IS the interface. Here the
// same contract is expressed with a TypeScript map instead of reflection:
//   - one CityEventMap per feature area = the documented vocabulary of the city stream
//   - emit is synchronous, so a reaction lands in the same frame as its cause
//   - a throwing subscriber never starves the rest (per-handler try/catch)
//   - a subscriber added during emit does not run in that pass (snapshot iteration)
// No globals, no third-party deps: the owner creates the bus and passes it down.

export type CityEventMap = Record<string, unknown>;

// Stored handlers are erased to unknown: the call site is the only place that knows
// the concrete payload type, and `on` has already enforced it at compile time.
type AnyHandler = (payload: unknown) => void;

export class EventBus<M extends CityEventMap> {
  // Map, not a plain object: event names may collide with Object.prototype keys
  // ("constructor", "toString"), which a bare `{}` registry would silently mis-handle.
  private handlers = new Map<keyof M, AnyHandler[]>();

  /**
   * Subscribe to one event type.
   * @returns an idempotent unsubscribe function — calling it twice is a no-op, so
   *          consumers can safely call it in both a cleanup path and on teardown.
   */
  on<K extends keyof M>(type: K, fn: (payload: M[K]) => void): () => void {
    const handler = fn as AnyHandler;
    let list = this.handlers.get(type);
    if (!list) {
      list = [];
      this.handlers.set(type, list);
    }
    list.push(handler);

    let active = true;
    return () => {
      if (!active) return;
      active = false;
      const current = this.handlers.get(type);
      if (!current) return; // offAll() already dropped the bucket
      const at = current.indexOf(handler);
      if (at >= 0) current.splice(at, 1);
      if (current.length === 0) this.handlers.delete(type);
    };
  }

  /**
   * Synchronously dispatch to every subscriber of `type`.
   * A handler that throws is isolated: the error is reported via console.warn and
   * dispatch continues, because one broken lane must not blank the city stream.
   */
  emit<K extends keyof M>(type: K, payload: M[K]): void {
    const list = this.handlers.get(type);
    if (!list || list.length === 0) return;

    // Snapshot: on()/off() during dispatch mutate the live array, and iterating that
    // live array would skip or double-run handlers. The pass sees what existed at emit.
    const snapshot = list.slice();
    for (let i = 0; i < snapshot.length; i++) {
      try {
        snapshot[i](payload);
      } catch (err) {
        warn(`handler for "${String(type)}" threw`, err);
      }
    }
  }

  /** Drop every subscription (scene teardown / hot reload). */
  offAll(): void {
    this.handlers.clear();
  }
}

function warn(message: string, err: unknown): void {
  if (typeof console !== "undefined" && typeof console.warn === "function") {
    console.warn(`[EventBus] ${message}:`, err);
  }
}
