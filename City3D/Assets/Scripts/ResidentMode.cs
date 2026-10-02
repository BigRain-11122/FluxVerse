using UnityEngine;

// 居民运行模式（CitySim_Residents R1 批·CEO 令 2026-10-02「居民你先自己用资产库的，尽量用好，动作也是能用资产库的就配好」）
// Start 设 Walking 布尔（walker=true 行走态/false 待机态）；非循环 clip 的运行时补环（importer 循环设置不可用时兜底）
public class ResidentMode : MonoBehaviour
{
    public bool walker;
    public string censusId;
    public string displayName;
    public string profession;

    Animator _anim;
    int _stateHash;
    bool _retrigger;

    void Start()
    {
        _anim = GetComponent<Animator>();
        if (_anim == null) return;
        _anim.SetBool("Walking", walker);
        _stateHash = Animator.StringToHash(walker ? "Walk" : "Idle");
        var info = _anim.GetCurrentAnimatorStateInfo(0);
        _retrigger = !info.loop;
    }

    void Update()
    {
        if (!_retrigger || _anim == null) return;
        var info = _anim.GetCurrentAnimatorStateInfo(0);
        if (info.shortNameHash == _stateHash && info.normalizedTime >= 1f)
            _anim.Play(_stateHash, 0, 0f);
    }
}
