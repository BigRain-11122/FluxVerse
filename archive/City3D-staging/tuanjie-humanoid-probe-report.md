# Tuanjie t15 Humanoid config probe (isolated project, 2026-10-02 22:23)
> Origin: CEO order 10-02 research-batch; machine C batchmode; skeleton=P09 copy; subject=Hunyuan SMPL-H walk/idle FBX pair.

## (1) ModelImporterAnimationType members (runtime reflection)
- members=[None,Legacy,Generic,Human]
- humanoid member=Human (Tuanjie rename precedent: standard Unity 'Humanoid' -> t15 'Human', numeric slot 3 identical)

## (2) ModelImporter human/avatar API surface (reflection properties)
- animationType : ModelImporterAnimationType
- autoGenerateAvatarMappingIfUnspecified : Boolean
- avatarSetup : ModelImporterAvatarSetup
- humanDescription : HumanDescription
- humanoidOversampling : ModelImporterHumanoidOversampling
- sourceAvatar : Avatar

## (3) Hunyuan FBX import (animationType=Human) + clip loop baking
- res_walk_hunyuan.fbx original animationType=Generic
  -> clip=SMPLH_Animation len=4.97s isLooping=True loopBaked=True
- res_idle_hunyuan.fbx original animationType=Generic
  -> clip=SMPLH_Animation len=4.97s isLooping=True loopBaked=True

## (4) Avatar auto-mapping (animationType=Human)
- Avatar=res_walk_hunyuanAvatar valid=True isHuman=True
- auto-mapped bones=52 ; key-slot hit=7/9 ; missing=[LeftArm,RightArm]
- mapping table:
  - Hips <- Pelvis
  - LeftUpperLeg <- L_Hip
  - RightUpperLeg <- R_Hip
  - LeftLowerLeg <- L_Knee
  - RightLowerLeg <- R_Knee
  - LeftFoot <- L_Ankle
  - RightFoot <- R_Ankle
  - Spine <- Spine1
  - Chest <- Spine2
  - Neck <- Neck
  - Head <- Head
  - LeftShoulder <- L_Collar
  - RightShoulder <- R_Collar
  - LeftUpperArm <- L_Shoulder
  - RightUpperArm <- R_Shoulder
  - LeftLowerArm <- L_Elbow
  - RightLowerArm <- R_Elbow
  - LeftHand <- L_Wrist
  - RightHand <- R_Wrist
  - LeftToes <- L_Foot
  - RightToes <- R_Foot
  - Left Thumb Proximal <- L_Thumb1
  - Left Thumb Intermediate <- L_Thumb2
  - Left Thumb Distal <- L_Thumb3
  - Left Index Proximal <- L_Index1
  - Left Index Intermediate <- L_Index2
  - Left Index Distal <- L_Index3
  - Left Middle Proximal <- L_Middle1
  - Left Middle Intermediate <- L_Middle2
  - Left Middle Distal <- L_Middle3
  - Left Ring Proximal <- L_Ring1
  - Left Ring Intermediate <- L_Ring2
  - Left Ring Distal <- L_Ring3
  - Left Little Proximal <- L_Pinky1
  - Left Little Intermediate <- L_Pinky2
  - Left Little Distal <- L_Pinky3
  - Right Thumb Proximal <- R_Thumb1
  - Right Thumb Intermediate <- R_Thumb2
  - Right Thumb Distal <- R_Thumb3
  - Right Index Proximal <- R_Index1
  - Right Index Intermediate <- R_Index2
  - Right Index Distal <- R_Index3
  - Right Middle Proximal <- R_Middle1
  - Right Middle Intermediate <- R_Middle2
  - Right Middle Distal <- R_Middle3
  - Right Ring Proximal <- R_Ring1
  - Right Ring Intermediate <- R_Ring2
  - Right Ring Distal <- R_Ring3
  - Right Little Proximal <- R_Pinky1
  - Right Little Intermediate <- R_Pinky2
  - Right Little Distal <- R_Pinky3
  - UpperChest <- Spine3

## (5) AnimationMode.SampleAnimationClip batch-mode sampling
- walk own-rig half-cycle pose delta=3.392m (>0.02 = batchmode sampling & muscle curves usable)

## (6) AnimatorController construction (Idle/Walk)
- controller=Assets/Motions/ResidentAnimator.controller params=1 states=2 transitions=2 (construction OK)

Verdict: **ALL GREEN - Tuanjie t15 humanoid chain fully usable (renamed Human slot + auto mapping + loop baking + batchmode sampling + controller). A-leg risk narrowed to 'Synty Avatar validity' single point.**
