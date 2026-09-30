using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace CitySim
{
    /// <summary>
    /// 层1(AI规划) -> 层2(市政仿真) 数据契约：功能城市蓝图。
    /// 由 FluxVerse/Tools/city/citysim-from-r0.py 从 R0 版式数据（td-organic-r0.json + cells）生成。
    /// CEO 令 2026-09-30「你自己决定，我只要结果…本地化能力体系建设」·T1 代决 A 档物理投影层。
    /// </summary>
    [Serializable]
    public class SimBlueprint
    {
        public int grid;
        public float cellM;
        public float originX;
        public float originZ;
        public int anchorCenterX;
        public int anchorCenterY;
        public List<int> roadX;
        public List<int> roadY;
        public List<int> roadTier;     // 0=TRUNK 1=SEC 2=ALLEY
        public List<int> roadBridge;  // 1=桥格(跨水)
        public List<int> blockId;
        public List<string> blockDistrict;
        public List<string> blockFunc; // RES/OFF/SHOP/CLUB/PUB
        public List<float> blockCx;
        public List<float> blockCy;
        public List<float> blockWm;
        public List<float> blockHm;
        public List<int> blockWater;
        public List<int> blockCellFlat;  // [x,y, x,y, ...] 展平
        public List<int> blockCellStart; // CSR 偏移

        public int RoadCount { get { return roadX != null ? roadX.Count : 0; } }
        public int BlockCount { get { return blockId != null ? blockId.Count : 0; } }
        public int BlockCellCount(int i) { return (blockCellStart[i + 1] - blockCellStart[i]) / 2; }

        public Vector3 CellCenter(int cx, int cy)
        {
            return new Vector3(originX + (cx + 0.5f) * cellM, 0f, originZ + (cy + 0.5f) * cellM);
        }

        public Vector3 BlockCentroidWorld(int i)
        {
            return CellCenter((int)blockCx[i], (int)blockCy[i]);
        }

        public static SimBlueprint Load(string absolutePath)
        {
            if (string.IsNullOrEmpty(absolutePath) || !File.Exists(absolutePath)) return null;
            return JsonUtility.FromJson<SimBlueprint>(File.ReadAllText(absolutePath));
        }
    }
}
