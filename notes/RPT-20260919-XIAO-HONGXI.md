---
rid: RPT-20260919-XIAO-HONGXI
pid: DOI-10.1109_TC.2025.3587976
title: Trajectory Optimization and Power Allocation for Multi-UAV Wireless Networks: A Communication-Based Multi-Agent Deep Reinforcement Learning Approach
presenter: 肖鈜曦
student_uid: XIAO-HONGXI
meeting_date: 2026-09-19
report_type: 文献解读
direction: 强化学习
---

# 肖鈜曦文献汇报记录

## 文献信息

- 论文：Trajectory Optimization and Power Allocation for Multi-UAV Wireless Networks: A Communication-Based Multi-Agent Deep Reinforcement Learning Approach
- 作者：Zimeng Yuan、Yuanguo Bi、Yanbo Fan、Yuheng Liu、Lianbo Ma、Liang Zhao、Qiang He
- 来源：IEEE Transactions on Computers，2025
- DOI：[ 10.1109/TC.2025.3587976 ](https://doi.org/10.1109/TC.2025.3587976)
- 汇报人：肖鈜曦
- 日期：2026-09-19
- 状态：已归档

## 本次汇报内容

本次完成 CATEN 文献解读。研究围绕移动用户场景下多无人机轨迹与发射功率联合控制，权衡 QoS 达标用户数与能耗，重点分析位置、信道、干扰和带宽份额之间的耦合。

执行端通过观测编码、通信记忆读取和门控更新生成动作；集中式多头注意力 critic 在训练阶段评价协作。汇报结合规模实验、能耗与服务人数曲线、注意力热图和消融实验讨论模块贡献与适用边界。

## 讨论与导师建议

复现疑点包括重叠覆盖下的用户关联、观测范围与坐标表达、奖励求和与目标一致性、通信记忆更新时序，以及水平距离和三维距离的使用。根据被引文献推测“最近无人机关联”不等同于原文明确约定；纸面疑点仍需实现或补充材料核查。

导师建议从功率对本机服务与其他链路干扰的双重影响凝练研究动机，核对上下文与符号一致性，并明确相对已有 actor-critic 框架的改动。学习方法应与问题分解结合，关注仿真与部署的差距；实验图表应清晰且配色克制。

## 后续事项

评估是否继续多智能体方向，优先寻找可复现的开源平台；进一步考虑通信代价与不可靠性的建模，避免从零搭建全部框架而延误系统验证。

## 汇报附件与会议纪要

- [下载汇报 PPTX（9 页）](materials/2026-09-19/xiao-hongxi-caten-slides.pptx)
- [查看论文完整句精读标注 PDF](materials/papers/caten-2025-annotated.pdf)
- [查看 9 月 19 日会议纪要](meeting.html?id=meeting-2026-09-19)
