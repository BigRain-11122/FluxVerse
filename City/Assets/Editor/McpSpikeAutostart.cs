using UnityEditor;
using UnityEngine;
using MCPForUnity.Editor.Services.Transport.Transports;

// CPH4 spike (P-2026-09-28-10): auto-start the MCP stdio bridge without GUI clicks.
// Runs once per editor session; safe to keep (no-op if bridge already running).
static class McpSpikeAutostart
{
    [InitializeOnLoadMethod]
    static void Init()
    {
        // Idempotent across domain reloads: re-check on every reload, start only if down.
        EditorPrefs.SetBool("MCPForUnity.AutoStartOnLoad", true);

        EditorApplication.delayCall += () =>
        {
            try
            {
                if (!StdioBridgeHost.IsRunning)
                {
                    StdioBridgeHost.StartAutoConnect();
                }
                Debug.Log("SPIKE_AUTOSTART bridge running=" + StdioBridgeHost.IsRunning
                    + " port=" + StdioBridgeHost.GetCurrentPort()
                    + " autoConnect=" + StdioBridgeHost.IsAutoConnectMode());
            }
            catch (System.Exception e)
            {
                Debug.LogError("SPIKE_AUTOSTART failed: " + e.Message);
            }
        };
    }
}
