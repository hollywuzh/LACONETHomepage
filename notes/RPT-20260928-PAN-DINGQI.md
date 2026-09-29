---
rid: RPT-20260928-PAN-DINGQI
pid: DOI-10.1109_TMC.2024.3384405
title: Energy-Efficient Trajectory Optimization With Wireless Charging in UAV-Assisted MEC Based on Multi-Objective Reinforcement Learning
presenter: 潘鼎琪
student_uid: PAN-DINGQI
meeting_date: 2026-09-28
report_type: 研究生文献解读
---

# 潘鼎琪文献汇报材料

## 文献信息

- 论文：Energy-Efficient Trajectory Optimization With Wireless Charging in UAV-Assisted MEC Based on Multi-Objective Reinforcement Learning
- 来源：IEEE Transactions on Mobile Computing，2024
- DOI：[10.1109/TMC.2024.3384405](https://doi.org/10.1109/TMC.2024.3384405)
- 汇报人：潘鼎琪
- 汇报类型：研究生文献解读
- 日期：2026 年 9 月 28 日
- 状态：已归档

## 汇报主题

面向无线充电辅助的 UAV-MEC 轨迹优化，结合偏好条件化多目标强化学习与轨迹级经验保留机制，权衡电量与任务收集。

## 汇报与阅读附件

- [下载汇报 Word](materials/2026-09-28/pan-dingqi-morl-ter-report.docx)
- [查看完整句精读批注 PDF](materials/papers/morl-ter-2024-annotated.pdf)
- [下载标注索引 Markdown](materials/2026-09-28/morl-ter-annotation-index.md)

标注中的局部代数核验与完整算法复现不同；待核查项应结合原论文和实现进一步判断。

## 精读标注索引



原论文18页，附加导读5页。正文完整句子标记；图表公式使用框选。

中文宋体（Songti SC），英文 Times New Roman；附录正文13pt，行距22pt。

局部代数核验不等于完整算法复现。

### A01 | 原PDF第1页 | 问题 | 高亮

> The ETWC problem is characterized by multi-objective optimization, aiming to maximize both the energy efficiency of the UAV and the number of tasks collected via optimizing the UAV’s flight trajectories.

【阅读入口】先抓两个目标，再跳第7页式(16)-(18)核对其数学含义。本文“能效”定义为剩余电量之和；任务指标是收集数，不能直接说成计算完成量。

### A02 | 原PDF第1页 | 方法 | 高亮

> Then, we propose a new trace-based experience replay scheme to modify sample efficiency and reduce replay buffer bias, resulting in a modified multi-objective reinforcement learning algorithm.

【贡献定位】核心改动是TER缓冲区保留机制；基础是EMOQL。讲清继承部分与新增部分，不能把全部多目标Q学习都归为本文创新。

### A03 | 原PDF第2页 | 建模 | 高亮

> As an energy relay, a UAV can harvest the laser energy from the HAP and distribute the energy to GSDs by wireless power transfer (WPT).

【关键图1】画出HAP→UAV激光能量流、UAV→GSD射频能量流、GSD→UAV任务流，分别核对输入功率、转换损耗和接收能量。

### A04 | 原PDF第2页 | 核查 | 波浪线

> While the weighted sum method is adequate for situations where weights remain unchanged, it cannot be applied to scenarios with diverse preferences because they may vary over time.

【限定比较对象】固定权重训练策略适应偏好变化困难；加权和本身并非不能处理不同偏好。本文式(25)也使用加权和，优势是权重条件化网络与跨偏好训练。

### A05 | 原PDF第4页 | 问题 | 下划线

> This allows for more efficient adaptation to changing preferences without the need for extensive re-training.

【必要性到实验】偏好随电量改变是动机。算法1却在每回合开始采样一次偏好；需补任务中途切换、切换响应时间及低电量场景，而不只测试不同静态权重。

### A06 | 原PDF第5页 | 建模 | 下划线

> Consequently, ensuring the timely upload of computation tasks from GSDs to the UAV becomes crucial.

【服务失败】明确是覆盖旧任务还是丢新任务，记录丢弃率与任务年龄。有限队列不会无限增长，但不能据此称服务稳定或任务均完成。

### A07 | 原PDF第5页 | 建模 | 下划线

> We assume that the locations of GSDs are static.

【动态来源】本篇GSD位置固定，动态主要来自任务到达、UAV状态和偏好。不要将结果解释为已验证移动用户追踪。

### A08 | 原PDF第6页 | 建模 | 下划线

> The HAP employs the fixed transmission power to wirelessly charge the UAV.

【控制范围】HAP激光功率固定，UAV动作也不含充电功率控制。论文优化轨迹，不是所有能量与计算资源联合优化。需检查跟踪误差、天气和遮挡敏感性。

### A09 | 原PDF第6页 | 方法 | 高亮

> The UAV selects a GSD as the specific device for task collection.

【启发式与学习的分工】覆盖内选择最高ξ·队列占用率的GSD；这一选择规则是预设的，不是RL动作。应补同轨迹不同选择规则的对照，明确收益来源。

### A10 | 原PDF第6页 | 核查 | 波浪线

> It should note that task collection delay and associated energy consumption can be neglected because the UAV can sufficiently close GSDs.

【服务容量假设】靠近只改善信道，不使5MB任务批量上传自动零耗时。式(9)用SNR门限后整队列收集，需检查带宽、速率、时隙容量和上传能耗。

### A11 | 原PDF第6页 | 建模 | 下划线

> We consider that the UAV keeps a computing queue in order to store the collected tasks, which are awaiting for further handling.

【收集≠完成】跟踪收集、入队、丢弃、处理四个计数。式(13)有容量截断，Ntotal仍按收集量计入；奖励可能偏好收集后被丢弃的任务。

### A12 | 原PDF第7页 | 核查 | 波浪线

> Hence, the UAV’s energy consumption encompasses both the energy consumed for transmitting to GSDs and energy consumed for processing collected tasks.

【账本闭合】式(15)没有推进/悬停能耗；恒速可使部分飞行耗能固定，但在有限电池和充电饱和下不一定能省略。需说明简化理由及适用条件。

### A13 | 原PDF第7页 | 方法 | 高亮

> This paper focuses on the linear scalarization function, which aggregates r(s, a) into a scalar reward using weighted sum, i.e., fw(r(s, a)) = w · r(s, a).

【读懂MORL】保留向量Q、输入偏好，再按当前权重选动作；不等于完全放弃标量化。线性偏好关注支持解，也不能自然保证找到所有非凸Pareto前沿点。

### A14 | 原PDF第8页 | 方法 | 下划线

> We assume that the UAV can select one of four directions to move at its current location in each time slot.

【算法职责】动作仅北南东西；速度10m/s、时隙3s，对应每步30m。没有悬停、连续航向和高度动作，所学最优仅针对该离散动作模型。

### A15 | 原PDF第8页 | 核查 | 波浪线

> The maximization of the expected vectorial return E[R1] is equal to the simultaneous maximization of Etotal and Ntotal.

【局部反例见导读】目标式(16)-(17)不折扣，奖励γ=0.995且可能带越界罚。折扣可改变策略排序，不能一般性认定等价。γ=1、无违规等额外条件需明确。

### A16 | 原PDF第8页 | 方法 | 下划线

> In the training stage, the multiple transitions are randomly sampled to train the policy MOQ network.

【TER容易误读】完整轨迹是存入和删除的原子单位；训练仍抽transition，不是必然用完整序列做RNN训练。区分保留粒度与训练采样粒度。

### A17 | 原PDF第9页 | 方法 | 高亮

> The policy MOQ network first concatenates the observed state st ∈S and sampled preference w ∈Ω.

【图3核心】同一状态配不同偏好可输出不同动作价值。8个输入来自状态6维和偏好2维，输出4动作×2目标；比逐层介绍网络更值得讲。

### A18 | 原PDF第10页 | 方法 | 下划线

> According to (27), we adopt double Q-learning to train the policy MOQ network, so as to avoid the overestimation of multi-objective Q-values.

【继承机制】区分在线网络选动作与目标网络评估。式(27)同时对动作、偏好取argmax，需明确返回的动作和偏好怎样用于目标Q，不能把双网络视为无偏保证。

### A19 | 原PDF第10页 | 方法 | 高亮

> To avoid partial traces, the TER scheme handles traces as atomic units when considering them for addition in or deletion from the experience buffer.

【真正改动】将episode作为缓冲区淘汰单位，保持时间链完整。它改善样本保留结构，但对跨偏好训练偏差的效果仍需实验，不是仅凭完整性就能证明。

### A20 | 原PDF第11页 | 方法 | 下划线

> After that, we remove the trace with the smallest crowding distance from buffer B, which guarantees the diversity of the experience replay buffer (step 17).

【算法2机制】用回报空间拥挤距离保留分散轨迹。需核对同一轨迹ID在各目标排序后对应一致、极差为零处理；多样性不自动等于高质量或无偏采样。

### A21 | 原PDF第11页 | 核查 | 波浪线

> Compared with the training complexity of the policy MOQ network, the TER scheme’s time complexity is trivial and can be neglected.

【成本边界】B条轨迹、n目标时，排序通常约O(nB log B)，存储约O(BT)。是否可忽略取决于缓冲容量和网络大小，应报告维护耗时与内存，且跨偏好样本数也影响训练量。

### A22 | 原PDF第11页 | 实验 | 高亮

> To facilitate this evaluation, we have developed a Python-based simulator using PyTorch 1.7, which helps us to thoroughly evaluate and analyze the performance of the MORL-TER across various experimental scenarios.

【平台先行】这是自建仿真器，无实机激光充电验证。先核对物理量、模型简化和随机实例，再解读Pareto图与指标表。

### A23 | 原PDF第11页 | 实验 | 下划线

> Based on different combinations between M and U, we can generate six test instances to simulate different UAV-assisted MEC networks, as shown in Table IV.

【覆盖范围】M=60/100/140，U=30/50形成六种配置。六实例不等于六次随机重复；需说明地图种子、任务种子、训练/测试分离和每实例是否重训练。

### A24 | 原PDF第13页 | 实验 | 下划线

> In such cases, a widely used approach in the literature [2], [41], [42] is to collect the best solutions so far obtained by all algorithms and choose the non-dominated ones from them.

【参考前沿】IGD用所有算法得到的非支配解并集作为经验参考，非真实已知最优前沿。AER/AE中的最优V*也需交代来源，不能把经验最优称严格最优。

### A25 | 原PDF第13页 | 核查 | 波浪线

> For each objective vector, we adopt linear scalarization to aggregate it into a COI.

【指标一致性】式(22)能量除以10，式(34)直接对Etotal和Ntotal加权；同一w代表的取舍可能不同。还需说明IGD两维是否归一化，以免尺度支配比较。

### A26 | 原PDF第14页 | 实验 | 高亮

> One can observe that the UAV operates in the sparsely populated GSD region, contributing to improving the UAV’s energy efficiency.

【图4主线】偏电量时少收集、少计算，可能得到较高剩余电量。这样的指标偏好是否符合服务价值？建议同时给完成率、丢弃率与服务公平性。

### A27 | 原PDF第15页 | 实验 | 下划线

> The TER scheme adopts the crowding distance to reflect the relative diversity of a trace in the experience buffer B.

【消融设计】对照EMOQL能测整体TER收益；进一步拆成完整轨迹FIFO、transition多样性保留、完整轨迹加多样性，区分两项机制，并固定总transition数与训练预算。

### A28 | 原PDF第15页 | 实验 | 下划线

> It is seen that the overall trend of task number is upward, as preferences of Ntotal increase.

【图8】偏好扫描是条件策略响应证据。还应同时画电量目标，报告未见权重以及任务中途切换；单独任务数曲线不能证明完整Pareto最优。

### A29 | 原PDF第16页 | 核查 | 波浪线

> A key distinction lies in the decision-making process: while MOEAs rely on a single chromosome to make decisions for all time slots, MORLs employ real-time decision-making for each time slot, taking into account the prevailing environmental conditions.

【基线公平】开环整条轨迹与闭环逐时隙策略的信息条件不同。补滚动时域MOEA、统一可见信息和计算预算，并分开离线训练成本与在线耗时。

### A30 | 原PDF第17页 | 实验 | 下划线

> One can observe that although MORL-TER cannot acquire the best results in all test instances regarding AEE, it performs better than the other seven algorithms with respect to ACOI.

【独立判断】保留能量单指标不总最优的边界；综合指标结果依赖权重和尺度。多目标方法要比较折中集合，不能只靠单指标或综合排名宣称全面最优。

### A31 | 原PDF第7页 | 问题 | 框选

> 式(16)-(18)

【先读目标】Etotal=ΣEU是电池电量的时域累加，不是bits/J或完成任务/J。任务指标是ΣNC收集量。先判断指标与服务价值是否一致，再讨论Pareto折中。

### A32 | 原PDF第7页 | 核查 | 框选

> 式(15)电池递推

【能量因果性】max(0,...)截断只避免状态负值，不保证动作支出可实现。若电量1J、收能0、拟支出2J，式子输出0却仍可能记入处理任务。需可行性约束、拒绝或部分执行。

### A33 | 原PDF第6页 | 核查 | 框选

> 式(4)后的距离定义

【纸面几何核验】dm明确是水平距离，后文仰角用asin(U/dm)。取U=30m、dm=15m得asin(2)，实数域无定义。斜距应为sqrt(dm²+U²)，或仰角用atan2(U,dm)。只确认显示公式，不推断代码实现。

### A34 | 原PDF第6页 | 核查 | 框选

> 式(10)-(11)收能与支出

【能量账本】式(10)是GSD接收能量，式(11)求和后在电池式(15)中当UAV发送支出扣除。固定PU广播时源端射频能量通常为τPU，需解释时分/波束分配及功放损耗，不能直接以接收端和替代。

### A35 | 原PDF第7页 | 核查 | 框选

> 式(13)队列容量

【守恒检查】收集后超过Nmax的部分被截断，但Ntotal仍按NC累计。GSD上传后队列减量也未在式(1)显示。复现要同时核对源队列清空、UAV接纳量与丢弃量，防重复计数。

### A36 | 原PDF第8页 | 核查 | 框选

> 引理1与式(23)-(24)

【已复算反例】γ=.995，无越界，100步两个任务回报序列：A首步100其余0；B末步101其余0。不折扣B=101>A=100；折扣B约61.49<A=100。即使另一目标相同，排序也可反转。

### A37 | 原PDF第10页 | 方法 | 框选

> 算法2 TER

【新增机制】完整轨迹入库、按回报拥挤距离删轨迹；网络更新仍随机抽transition。复现需固定缓冲容量单位，并处理fnmax=fnmin时除零、并列最小值、不同轨迹长度。

### A38 | 原PDF第11页 | 实验 | 框选

> 表III

【复现参数】γ=.995不等于1；HAP高10km、激光功率2000W、镜面面积.01m²。激光到UAV收能量应单独核算，再比较推进与计算消耗。不能只见充电项便认定能维持飞行。

### A39 | 原PDF第12页 | 实验 | 框选

> 表V-IX

【结果表读法】分算法指标IGD与系统指标AEE/ANT/ACOI，先检查量纲、归一化和参考最优来源。表中均值缺少重复次数/方差说明时，排名不能替代统计显著性检验。

### A40 | 原PDF第16页 | 实验 | 框选

> 图9 Pareto前沿

【主图】按两轴目标含义判断支配与折中，说明是经验非支配集合。比较范围、分布、极端点与重复运行稳定性；Pareto图不能修补物理模型或奖励定义问题。

### A41 | 原PDF第5页 | 建模 | 框选

> 图1系统总览

【汇报主图】用三种箭头区分激光充电、射频供能、任务上传，再补计算完成与队列溢出。每条能量箭头都核对源端支出与接收端收益，不把二者混为一个变量。

### A42 | 原PDF第9页 | 方法 | 框选

> 图2 MORL-TER框架

【框架图读法】执行网络根据状态与偏好选方向；训练阶段跨偏好复用样本；TER决定缓冲区保留哪些轨迹。分清在线推理与离线训练，不把训练成本当成每次飞行决策成本。

### A43 | 原PDF第8页 | 核查 | 框选

> 式(20)状态

【信息完备性】状态不含各GSD队列和生成参数，NC又被称本时隙收集结果，需统一决策前后时序。不同隐藏队列可在相同观测下产生不同后继回报；补观测、记忆或POMDP解释。

## 组会入口

- [查看本次组会材料归档](meeting.html?id=meeting-2026-09-28)
