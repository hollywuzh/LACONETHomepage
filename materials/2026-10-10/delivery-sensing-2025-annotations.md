# LACONET 精读标注索引

原论文14页，附加教学导读5页（第15页起）。中文宋体，英文Times New Roman，导读正文13pt/22pt行距。

纸面核验不等于完整算法复现；未运行作者代码或核验在线附录。

## A01 | 原PDF第1页 | 问题 | 高亮

> This paper introduces a novel online control framework tailored for a multi-task drone, explicitly addressing the simultaneous execution of in-situ sensing and goods delivery.

【第一轮：一句话问题】同一架无人机以配送为主任务，沿预定路线择机感知。不是多无人机任务分配，也不是自由航线搜索。先看图1，再跳第5页问题(11)。

## A02 | 原PDF第1页 | 方法 | 高亮

> The crux of the optimal policy revolves around flight distance- and time-related thresholds, determining the precise points at which the drone should switch its optimal action.

【主贡献】读的是结构化随机/序贯控制：能否从Bellman方程证明动作随状态单调，进而存储切换边界。与DRL不同，本篇没有训练网络。

## A03 | 原PDF第1页 | 实验 | 下划线

> Under the considered simulation settings, our approach reduces drone energy consumption by a substantial 19.8% compared to existing benchmarks.

【主张对应证据】去第10页图3找对照对象、距离区间、时限和完成率。19.8%是特定仿真比较，不能概括为任意任务场景的节能保证。

## A04 | 原PDF第3页 | 问题 | 高亮

> While these studies [26], [27], [28], [29], [30], [31], [32] have considered multiple objectives, they have not addressed the challenges of balancing strict delivery deadlines with secondary in-situ sensing tasks.

【必要性】重点是主任务准时与副任务收益的竞争。相关工作用“是否联合处理时限、速度、动态感知”整理，避免只列算法名称；本次未逐篇核验这些文献。

## A05 | 原PDF第3页 | 方法 | 下划线

> We also reveal the optimal action only changes when either of two thresholds regarding the remaining distance or elapsed time is reached.

【状态边界】距离阈值依赖(l,t)，时间阈值依赖(l,m)，是同一策略区域的两种切片。不是两个独立固定常数；比较时需明确另一维与POI状态。

## A06 | 原PDF第4页 | 问题 | 高亮

> The drone is expected to reach the destination by no later than a specified time T (min), and the preplanned route length is M (km).

【先限定决策】路线已规划、总距离给定；后文优化速度与感知时机。不要在汇报中写成同时优化空间轨迹或重新排序配送点。

## A07 | 原PDF第4页 | 建模 | 下划线

> We define s = (m, l) as the drone’s state.

【状态映射】m是剩余距离，l是当前街区，t通过有限时域策略索引进入。检查l与m是否存在冗余、街区内位置如何恢复；电池余量不在该状态里。

## A08 | 原PDF第4页 | 建模 | 下划线

> In other words, selecting different speeds a ∈ A is always possible, while the action of in-situ sensing (a = A + 1) heavily depends on the current location of the drone.

【动作与可行性】速度动作与“感知+槽内剩余时间巡航”是不同模式，感知仅在POI街区允许。问题(11)写全集不够，实际执行应使用A(l)。

## A09 | 原PDF第4页 | 建模 | 下划线

> After sensing, the drone proceeds at the cruise speed vA for the rest of the slot.

【时序】一槽由感知时长τs和巡航时长τ-τs组成，要求τs≤τ。后文指数分布可能越界，需说明截断或跨槽处理；速度vA+1=1m/s也不是严格静止悬停。

## A10 | 原PDF第4页 | 核查 | 波浪线

> The reward for performing a sensing task depends on the required sensing time, and is measured by the amount of electricity (in Wh) that can be purchased.

【量纲】奖励用等价电能折算，不能直接等同感知准确率。式(7)用W×s给J，奖励/罚项写Wh；相减前需要统一换算，1Wh=3600J。μ为W时乘秒得到J。

## A11 | 原PDF第5页 | 建模 | 下划线

> The energy used for in-situ sensing is usually much lower than the drone’s propulsion [40].

【资源边界】能耗核算主要是推进、悬停和感知功率；文中没有显式剩余电池状态与耗尽约束。最小化能耗不能自动保证给定电池容量足够。

## A12 | 原PDF第5页 | 建模 | 下划线

> Specifically, the energy consumption due to acceleration and deceleration is accounted for in the overall power consumption for the sensing task, i.e., p(vA+1) in (4).

【动态代价】作者将加减速能量并入感知功率，未单列状态转移依赖的切换代价。检查该等效参数如何标定；若代价依赖上一速度，状态与阈值证明都可能改变。

## A13 | 原PDF第5页 | 方法 | 高亮

> Problem (11) is an FH-MDP problem.

【困难内核】有限时域序贯决策；当前感知收益与未来按时到达机会相互影响。DP复杂度来自时间、距离、动作以及街区/随机事件，不应直接套用TSP困难性。

## A14 | 原PDF第5页 | 方法 | 下划线

> The expected cost function Kt(m, l, a) is composed of the immediate cost at slot t, and the estimated cost in the remaining slots.

【先解释Bellman再看证明】即时代价是能耗减奖励，后续项是状态转移下的最优未来成本。终端项是剩余距离罚；每项与真实飞行过程对应，再检查(13a)到(13b)是否等价。

## A15 | 原PDF第6页 | 建模 | 下划线

> Assume that the sensing time τs is location-independent, i.e., τs := τs(l), ∀l ∈ L.

【理论前提】第IV节先令感知时长统一，而实验随后设置随机指数时长。应说明每次条件化/重算是否仍满足证明条件；不能直接把所有随机扩展视为已证明。

## A16 | 原PDF第6页 | 方法 | 高亮

> In other words, the actions satisfying (20) would consume more energy over the same flight distance and can be precluded for the selection of the optimal action.

【先剪枝再阈值】比较每槽推进距离d与单位距离净成本ζ，去掉又慢又贵的动作。需保留相同后续状态信息与可行性；有负奖励、不同沿途POI暴露时应复核支配关系前提。

## A17 | 原PDF第7页 | 方法 | 下划线

> By pairwise comparing the actions in the action set, we find two thresholds regarding m and t, at which a switch of the drone’s optimal actions takes place.

【证明责任】值函数单调不自动推出最优动作单调，关键是动作差的单交叉/次模条件。按引理1→定理1→动作剪枝→定理2→定理3梳理，完整证明在未随附的在线附录。

## A18 | 原PDF第7页 | 方法 | 高亮

> This theorem can be readily generalized to the case of A > 2.

【推广需交代】A=2时三种动作形成两个边界；更多速度应先剪枝、排序，再证明相邻动作边界有序且无跳回。汇报不要仅重复“可推广”，可用3速度小实例验证。

## A19 | 原PDF第8页 | 方法 | 下划线

> The indexes to the actions are reordered in the descending order of da in the set {1, . . . , | ˜A(l)|}.

【编号与物理含义】编号越小推进越快。定理中π随m或t下降表示更急迫时选更快动作；不要把动作编号减少误说成速度下降。

## A20 | 原PDF第8页 | 核查 | 波浪线

> The optimal policy can be generated within about 1.03 ms.

【估算与实测】这是按32,640 FLOPs与处理器峰值10%折算的时间，不是端侧运行测量。应加入阈值生成、V表准备、街区转移、内存和在线重算，报告实测P95/P99。

## A21 | 原PDF第8页 | 方法 | 下划线

> In this way, the algorithms can run online to update the drone’s schedule in response to new in-situ sensing requests arising.

【在线职责】新请求先过奖励门槛，再用算法2更新阈值，算法1查策略。任意未知未来请求下是否仍全局最优，取决于信息模型、到达过程和重算范围，不能由查阈值本身推出。

## A22 | 原PDF第8页 | 建模 | 下划线

> Given the route and sensing tasks selected, the drone needs to carry out finer-grained flight control and manoeuvre to address weather impact [46], collision avoidance [47], and noise pollution [48].

【部署分层】该方法是任务/速度调度层，仍需底层飞控、避障和抗风。仿真调度成功不能替代安全飞行或城市部署验证。

## A23 | 原PDF第8页 | 实验 | 高亮

> The new threshold-based policy coincides with the results obtained from the conventional optimal DP-based approach, yet with a significantly lower computational complexity.

【图2验证什么】相同离散模型与参数下对齐DP是必要检验。应补逐状态动作/价值一致性、平局处理和运行时间；模型或参数错误会被两种实现共同继承。

## A24 | 原PDF第9页 | 核查 | 波浪线

> The power consumptions are p1 = 5971.3 W and p2 = 3879.16 W for flying the full speed and cruise speed, respectively.

【已做纸面算术】v1=10、v2=6给p1/v1=597.13J/m，p2/v2≈646.53J/m。按这些印刷数值全速更快且单位距离更省，与巡航节能解释及引理2剪枝应核对。未据此判定作者代码错误。

## A25 | 原PDF第9页 | 核查 | 波浪线

> Also assume that the average task density (i.e., arrival rate) of the Poisson distribution is ρ(L(1)), and the sensing durations yield the exponential distribution with the average duration of ¯τs.

【随机模型与定理连接】POI空间密度与时间到达率需分别定义单位。平均48s指数时长在60s槽内越界概率exp(-60/48)≈28.65%；若不截断，(5)中的剩余巡航时间会为负。

## A26 | 原PDF第9页 | 核查 | 波浪线

> In this paper, the average unit sensing reward per second is ¯μ = 3,000 W, with an average sensing time of ¯τs = 48 s.

【参数一致性】正文默认μ=3000W，而表II列3500W。奖励会改变净成本、支配关系与感知阈值；复现前应确认两者对应哪组实验，不能混用。

## A27 | 原PDF第10页 | 实验 | 下划线

> By comparing Figs. 3, 5, and 6, we observe that the proposed Algorithm 1 achieves a better trade-off between energy consumption and task rewards while ensuring timely goods delivery.

【三图联读】图3能耗，图5准时完成，图6感知奖励。目标是净成本折中，并非同时分别达到最小能耗与最大奖励。基线目标不同，应补同一时限/奖励口径下的强基线。

## A28 | 原PDF第11页 | 实验 | 下划线

> Herein, the rewards are normalized over the unit sensing reward μ.

【读纵轴与单位】R除以单位奖励率μ得到累计感知时间，而非无量纲效用。确认μ是否随任务变化、时间单位和归一化方式；奖励较低可能是在保护配送。

## A29 | 原PDF第11页 | 实验 | 下划线

> This is because performing in-situ sensing consumes time and may prevent timely delivery.

【机制图7】POI密度增加并不必然使提出策略失约，因为可拒绝副任务。补无感知、固定速度+可行性门控和相同目标DP基线，分清阈值策略与优先级规则的贡献。

## A30 | 原PDF第12页 | 实验 | 高亮

> This is because the more relaxed time constraint allows the drone to perform additional sensing tasks, leading to greater energy consumption.

【不要误判非单调】更宽时限扩大可行选择，但优化的是能耗减奖励；新增感知可提升净收益却增加物理能耗。图9与图10必须配对讲，不能只看能耗曲线。

## A31 | 原PDF第12页 | 实验 | 下划线

> The drone is expected to deliver goods 4.55 km away within 14 min.

【案例范围】UTS校园地图、25街区、随机感知任务。与第11页CoppeliaSim演示一起证明场景可解释性；未提供实机配送、链路测量或硬件计时证据。

## A32 | 原PDF第12页 | 核查 | 波浪线

> In this case study, Algorithm 1 allows the drone to complete delivery within 14 minutes, achieving optimal energy efficiency with a consumption of only 862.15 Wh and the highest possible task rewards.

【结论要回到原目标】本案例的能耗与奖励结果不能证明两个分量各自全局最优。按共同目标、同样信息与可行域对照DP；报告按时率、奖励、能耗与净成本四项。

## A33 | 原PDF第2页 | 问题 | 框选

> 图1多任务无人机

【汇报第一主图】配送路线预定，感知任务沿途出现。标出主任务/副任务、m、t、l与可选动作，讲清“为何不能见到POI就感知”。

## A34 | 原PDF第5页 | 问题 | 框选

> 问题(11)目标与约束

【先读再回模型】目标Σ(E-R)+Φ(m末)，不是显式m末=0硬约束，也没有剩余电池约束。准时保证需可达性、罚函数下界与奖励界。策略还应满足位置动作集A(l)。

## A35 | 原PDF第5页 | 核查 | 框选

> 式(10)街区转移概率

【核查而非直接照抄】所示式只按D≥L0给0/1，未明确唯一l′，D<L0也未给留在当前街区的概率。检查概率行和为1、槽跨多街区、槽内偏移与途中POI；实现需完整转移规则。

## A36 | 原PDF第5页 | 核查 | 框选

> 式(13a)与(13b)

【终段等价性】m< D时(13b)按m/D缩放即时代价，而(13a)原为整槽E-R。航行终段可按时间截断，但完整感知奖励未必能同比例缩放；需明确任务可分割与终止规则。

## A37 | 原PDF第6页 | 方法 | 框选

> 式(16)-(18)推进距离与净成本

【建模桥梁】d是每槽推进距离；ζ是每米能耗减奖励。感知使d下降，μ提高使ζ下降；结构化比较依赖这些量的顺序和当前可用动作。

## A38 | 原PDF第6页 | 核查 | 框选

> 引理1与式(19)

【条件不能省略】非减凸罚函数本身不保证罚差≥飞行成本，例如Φ≡0也非减凸。必须明确系数、距离单位、奖励上界和可达状态；证明中“超过二次增长”与仿真10m²也需核对。

## A39 | 原PDF第6页 | 核查 | 框选

> 引理3感知选择条件

【充分条件需限定】ζ感知≤ζ巡航可表明净成本优势，却不能单独保证紧迫时感知。还要比较剩余时限与未来价值；文末给出单槽示例，建议结合未附在线附录澄清引理表述。

## A40 | 原PDF第7页 | 方法 | 框选

> 算法1阈值查找

【只讲职责】输入当前m、l、t及阈值；输出动作并更新状态。将阈值准备与在线比较计时分开，说明新请求何时触发重算。不要逐行朗读。

## A41 | 原PDF第8页 | 核查 | 框选

> 算法2阈值生成

【边界方向核查】按(25)/(31)，较小m选n+1且m*(t)≥m*(t+1)。若从旧阈值出发，伪代码一见n+1便停止，是否会直接返回旧边界？手画3格实例，核对扫描方向、停止条件和边界初始化。

## A42 | 原PDF第9页 | 实验 | 框选

> 图2最优性与结构验证

【首张结果图】(a)净成本/罚代价与DP对齐；(b)(c)动作区域。先说明速度编号和坐标，再查区域单调性、阈值交叉与不同POI类型。数值对齐是验证，不替代理论条件。

## A43 | 原PDF第9页 | 核查 | 框选

> 表II默认参数

【复现前统一】表中μ=3500W，正文=3000W；τ=1min、λ=10m。感知推进距离vA(τ-τs)+v感知τs未必落在10m网格，需说明舍入或插值并做网格敏感性。

## A44 | 原PDF第10页 | 实验 | 框选

> 图5与图6

【优先级与折中】在共同T下同时读准时完成与感知奖励。副任务奖励更高但主任务失败不能称更好；核对所谓完成率是完整到达概率、试验比例还是已飞距离比例。

## A45 | 原PDF第11页 | 实验 | 框选

> 图9负载与能耗

【与图10联读】负载改变功率，时限放宽可能增加感知，因此能耗可回升。展示收益与能耗的同时变化，并说明统计重复、误差条与任务样本是否相同。

## A46 | 原PDF第12页 | 实验 | 框选

> 图11校园案例

【证据层次】真实地图+任务随机生成+算法轨迹演示，不等同实机飞行。请说明路线如何给定、转角与避障是否进入调度、计算时间如何测量。