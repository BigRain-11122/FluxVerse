using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace CitySim
{
    /// <summary>
    /// Panorama capture for the silicon-city watch window (O-20260930-1656 item 1).
    /// Renders 6 cube faces (1024x1024, 90 deg FOV) from above the city center,
    /// writes them + a meta json to City3D-staging/pano/ for equirect stitching.
    /// Batch mode: -executeMethod CitySim.CitySimPano.Run  (fail-loud pano-done sentinel)
    /// </summary>
    public static class CitySimPano
    {
        static string CityRoot { get { return Path.GetFullPath(Path.Combine(Application.dataPath, "..")); } }
        static string Staging { get { return Path.GetFullPath(Path.Combine(CityRoot, "..", "City3D-staging")); } }
        static string PanoDir { get { return Path.Combine(Staging, "pano"); } }
        static string ScenePath { get { return Path.Combine("Assets", "Scenes", "CitySimLab.unity"); } }
        static string DonePath { get { return Path.Combine(PanoDir, "pano-done"); } }

        public const int FACE = 1024;
        public const float EYE_HEIGHT = 80f; // above road-node centroid: city edge ~27 deg below horizon

        [MenuItem("CitySim/4 Capture Pano")]
        public static void Run()
        {
            try
            {
                Directory.CreateDirectory(PanoDir);
                if (!File.Exists(ScenePath)) CitySimLab.BuildScene();
                EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
                var driver = UnityEngine.Object.FindObjectOfType<CitySimDriver>();
                if (driver == null) throw new Exception("[CitySimPano] driver missing in lab scene");
                driver.Init();
                driver.BuildVisuals();
                driver.ResetAndRunTo(CitySimLab.NOON_MIN); // settled noon state, deterministic seed

                // Eye = centroid of all road nodes (deterministic, honest city center)
                float cx = 0f, cz = 0f; int n = driver.core.roadCount;
                for (int i = 0; i < n; i++) { var c = driver.core.bp.CellCenter(driver.core.nodeCellX[i], driver.core.nodeCellY[i]); cx += c.x; cz += c.z; }
                cx /= Mathf.Max(1, n); cz /= Mathf.Max(1, n);

                var camGo = new GameObject("PanoCam");
                var cam = camGo.AddComponent<Camera>();
                cam.fieldOfView = 90f; cam.nearClipPlane = 1f; cam.farClipPlane = 4000f;
                cam.enabled = false;
                // Procedural gradient sky (deterministic; phase tint handled by window css)
                var skyShader = Shader.Find("Skybox/Procedural");
                if (skyShader != null)
                {
                    var sky = new Material(skyShader);
                    sky.SetFloat("_SunSize", 0.04f);
                    sky.SetFloat("_AtmosphereThickness", 0.95f);
                    sky.SetFloat("_Exposure", 1.05f);
                    sky.SetColor("_SkyTint", new Color(0.62f, 0.72f, 0.82f));
                    sky.SetColor("_SunColor", new Color(0.99f, 0.96f, 0.88f));
                    RenderSettings.skybox = sky;
                    cam.clearFlags = CameraClearFlags.Skybox;
                }
                else
                {
                    cam.clearFlags = CameraClearFlags.SolidColor;
                    cam.backgroundColor = new Color(0.55f, 0.67f, 0.82f);
                }
                var cd = camGo.AddComponent<UnityEngine.Rendering.Universal.UniversalAdditionalCameraData>();
                cd.renderPostProcessing = false;
                camGo.transform.position = new Vector3(cx, EYE_HEIGHT, cz);

                // Hide the sim HUD TextMesh from panorama captures (world-space text renders in any camera)
                var hudGo = GameObject.Find("HudText");
                bool hudWasActive = false;
                if (hudGo != null) { hudWasActive = hudGo.activeSelf; hudGo.SetActive(false); }

                // 6 cube faces: (file, euler) -- Unity axes: pitch +90 looks DOWN, pitch -90 looks UP
                var faces = new Tuple<string, Vector3>[] {
                    Tuple.Create("face_f.png",  new Vector3(0f, 0f,   0f)),
                    Tuple.Create("face_r.png",  new Vector3(0f, 90f,  0f)),
                    Tuple.Create("face_b.png",  new Vector3(0f, 180f, 0f)),
                    Tuple.Create("face_l.png",  new Vector3(0f, 270f, 0f)),
                    Tuple.Create("face_u.png",  new Vector3(-90f, 0f, 0f)),
                    Tuple.Create("face_d.png",  new Vector3(90f, 0f,  0f)),
                };
                try
                {
                    foreach (var f in faces)
                    {
                        camGo.transform.rotation = Quaternion.Euler(f.Item2);
                        RenderFace(cam, Path.Combine(PanoDir, f.Item1));
                    }
                }
                finally
                {
                    if (hudGo != null && hudWasActive) hudGo.SetActive(true);
                }

                var sb = new StringBuilder();
                sb.AppendLine("{");
                sb.AppendLine("  \"engine\": \"CitySim CitySimLab.unity\",");
                sb.AppendLine("  \"eye\": [" + cx.ToString("F2") + ", " + EYE_HEIGHT + ", " + cz.ToString("F2") + "],");
                sb.AppendLine("  \"sim_min\": " + CitySimLab.NOON_MIN + ",");
                sb.AppendLine("  \"seed\": " + CitySimLab.SEED + ",");
                sb.AppendLine("  \"face\": " + FACE + ",");
                sb.AppendLine("  \"agents\": " + driver.core.agents.Count + ",");
                sb.AppendLine("  \"ts\": \"" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "\"");
                sb.AppendLine("}");
                File.WriteAllText(Path.Combine(PanoDir, "pano-meta.json"), sb.ToString(), Encoding.UTF8);
                WriteDone("PASS|faces=6|eye=" + cx.ToString("F1") + "," + EYE_HEIGHT + "," + cz.ToString("F1"));
                Debug.Log("[CitySimPano] PASS faces -> " + PanoDir);
            }
            catch (Exception e)
            {
                WriteDone("FAIL|" + e.Message.Replace('\n', ' '));
                Debug.LogError("[CitySimPano] FAIL: " + e.Message);
                throw;
            }
        }

        static void RenderFace(Camera cam, string path)
        {
            var rt = new RenderTexture(FACE, FACE, 24);
            cam.targetTexture = rt;
            cam.Render();
            var prev = RenderTexture.active;
            RenderTexture.active = rt;
            var tex = new Texture2D(FACE, FACE, TextureFormat.RGB24, false);
            tex.ReadPixels(new Rect(0, 0, FACE, FACE), 0, 0);
            tex.Apply();
            File.WriteAllBytes(path, tex.EncodeToPNG()); // lossless: seams stay clean for stitching
            RenderTexture.active = prev;
            cam.targetTexture = null;
            UnityEngine.Object.DestroyImmediate(tex);
            rt.Release();
            UnityEngine.Object.DestroyImmediate(rt);
        }

        static void WriteDone(string status)
        {
            Directory.CreateDirectory(PanoDir);
            File.WriteAllText(DonePath, "CitySimPano|" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "|" + status, Encoding.UTF8);
        }
    }
}
