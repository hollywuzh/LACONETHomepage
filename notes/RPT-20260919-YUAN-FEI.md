---
rid: RPT-20260919-YUAN-FEI
pid: DOI-10.1109_TSC.2025.3544124
title: Joint Trajectory Optimization and Resource Allocation in UAV-MEC Systems: A Lyapunov-Assisted DRL Approach
presenter: 袁非
student_uid: YUAN-FEI
meeting_date: 2026-09-19
report_type: 文献解读
direction: 边缘计算
---

# 袁非文献汇报记录

## 文献信息

- 论文：Joint Trajectory Optimization and Resource Allocation in UAV-MEC Systems: A Lyapunov-Assisted DRL Approach
- 作者：Ying Chen、Yaozong Yang、Yuan Wu、Jiwei Huang、Lian Zhao
- 来源：IEEE Transactions on Services Computing，2025
- DOI：[ 10.1109/TSC.2025.3544124 ](https://doi.org/10.1109/TSC.2025.3544124)
- 汇报人：袁非
- 日期：2026-09-19
- 状态：已归档

## 本次汇报内容

本次完成 JTORA 文献解读。论文考虑随机任务到达与用户移动条件下的 UAV-MEC 系统，以降低移动用户长期平均能耗为目标，同时考虑任务队列稳定和无人机长期平均推进能耗约束。CPU 频率、卸载功率与无人机轨迹之间存在耦合。

汇报重点为求解分工：Lyapunov 漂移加罚处理长期约束；CPU 频率采用解析优化；SAC 生成轨迹动作后，再根据位置与信道计算卸载功率。实验需结合能耗和队列积压理解参数 V 的权衡，并核对实际训练、推理耗时与复现条件。

## 讨论与导师建议

袁非提出，“混合整数”表述与显式连续决策变量之间的关系、随机种子与方差、参数完整性及推理时延仍需核查。论文的训练曲线不能替代实际在线响应时间的测量；会上未进行完整复现。

导师建议学习逐步分解问题、按子问题结构选择工具的方式；先凝练自己的场景、关键耦合与研究问题，再决定是否采用 Lyapunov 或强化学习。系统图和实验设计应围绕核心问题组织。

## 后续事项

结合技术趋势明确个人研究切入点，先形成问题描述和最小可运行流程，再评估方法组合与验证方案。

## 汇报附件与会议纪要

- [查看汇报幻灯片 PDF（12 页）](materials/2026-09-19/yuan-fei-jtora-slides.pdf)
- [查看论文完整句精读标注 PDF](materials/papers/chen-2025-annotated.pdf)
- [查看 9 月 19 日会议纪要](meeting.html?id=meeting-2026-09-19)
