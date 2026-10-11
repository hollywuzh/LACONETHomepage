# 袁非｜2026-10-10 文献解读

- [汇报幻灯片 PDF](materials/2026-10-10/yuan-fei-speed-swapping-slides.pdf)
- [论文 PDF（含精读批注与导读）](materials/papers/speed-swapping-2026-annotated.pdf)
- [标注索引（Markdown）](materials/2026-10-10/speed-swapping-2026-annotations.md)

## 汇报文献

Optimal Flight Speed Scheduling and Battery Swapping in UAV-Enabled Mobile Edge Computing。Dongmei Ye 等，IEEE Transactions on Mobile Computing，25(1)，2026。DOI：10.1109/TMC.2025.3601743。汇报主体约为字幕26:59—50:23，其后开展讨论。

## 研究问题

单架无人机按预先给定的巡检顺序访问任务点，在任务期限和电池约束下，联合选择航段速度、回站换电、计算卸载以及通信和计算资源购买，以降低运营成本。任务访问顺序固定，不能将该问题概括为自由排序的旅行商问题。

## 方法主线

通过虚拟节点构建扩展图，将速度、计算模式及换电选择统一表示为路径选择；利用变量替换与有界二元乘积的线性化，将原问题重构为混合整数凸优化问题。小规模使用求解器，大规模采用基于分析目标级联（ATC）的分解协调启发式。

## 实验与适用范围

汇报比较了固定速度、固定换电方案及直接求解模型，关注运营成本、完成时间、可行性和计算耗时。ATC以一定成本损失换取求解速度；相关实验支持给定设置下的效率收益，不意味着所有规模的全局最优或实时调度保证。混合整数凸模型仍包含组合决策。

## 讨论意见

导师认为速度、补能和卸载的耦合关系及扩展图表达值得借鉴，可进一步研究放开固定访问顺序后的联合规划。汇报人指出强基线与实验覆盖仍可加强；导师建议改进系统模型和重构模型的叙述衔接，明确图中虚拟节点的含义。上述评价为会议讨论意见。

## 后续核查

厘清各成本项的单位与计费口径、原模型和重构模型的对应关系、ATC的可行性与停止条件。若迁移至自身研究，先确认新增路径决策与原模型的兼容性，并使用可复现且约束一致的基线；不将缺少某类强化学习对比本身视为结论无效。

## 完整标注索引

# LACONET 精读标注索引

原论文13页，附加导读5页。正文完整句子标记；图表公式使用框选。

中文宋体（Songti SC），英文 Times New Roman；附录正文13pt，行距22pt。

局部代数核验不等于完整算法复现。

## A01 | 原PDF第1页 | 问题 | 高亮

> A decision-making model customized for the UAV is proposed, jointly optimizing flight speed selection, battery swapping, and task offloading to minimize the UAV’s total operational cost in its flight.

【第一轮】先说明三个决策如何共同影响成本，再跳第5页P1。目标是资源采购与电池费用，不是单纯最小能耗或最短时间。

## A02 | 原PDF第1页 | 方法 | 高亮

> By introducing virtual nodes in the flight network, we construct a unidirectional extended graph, based on which the original non-convex cost minimization problem is reformulated to a tractable mixed-integer convex problem.

【方法主线】虚拟节点把不同离散选择编码为选边，再用有界二元乘积的精确线性化处理耦合。混合整数凸问题仍有组合复杂度，不是普通凸优化的多项式保证。

## A03 | 原PDF第1页 | 方法 | 下划线

> Further, a fast heuristic based on analytical target cascading (ATC) is developed to obtain suboptimal solutions to large-scale problems.

【最优性边界】小规模P3由求解器求解，大规模ATC明确为次优启发式。不能把标题Optimal扩展为所有算法、所有规模的全局最优保证。

## A04 | 原PDF第2页 | 问题 | 下划线

> The relationship between the flight speed and energy consumption of UAVs is considered in [19], [20], [21], but these works overlook the practical challenge of energy replenishment, which is crucial for long-distance and long-duration missions.

【研究必要性】速度不仅影响航时和推进能耗，也会改变是否需要绕行换电。让学生从这一因果链理解联合决策为何必要；相关工作的归纳是作者主张，未在本次外部检索核验。

## A05 | 原PDF第3页 | 建模 | 高亮

> The UAV visits the task nodes in a pre-defined order, which can be determined by the priorities of the nodes.

【决定问题范围的关键句】访问顺序已知，路径选择主要决定在哪些相邻任务间绕行BS及选哪种速度。不要将其讲成自由排序TSP或任意二维轨迹规划。

## A06 | 原PDF第3页 | 建模 | 下划线

> When the UAV hovers above a task node, the computation task can be processed locally on the UAV or offloaded to the MEC server.

【实体角色】UAV是采集与本地计算端，地面BS提供MEC和换电服务。与UAV给地面设备提供边缘计算的论文不同，任务流方向要讲清。

## A07 | 原PDF第3页 | 建模 | 下划线

> Considering that the final return to the BS signifies mission completion rather than battery swapping, we subtract 1 in (4) to exclude the final return.

【计费边界】xBS只记中途换电次数，目标xBS+1包含初始满电电池。分解成多段后须检查段与段交界的新电池是否正确计数。

## A08 | 原PDF第4页 | 建模 | 下划线

> Suppose that the UAV must wait for the data processing to be completed before continuing its flight.

【关键服务假设】采集、上传、计算串行，等待期间计入悬停。卸载可减少悬停能耗却要购买资源；若允许飞行中计算或异步返回，模型与最优策略都会改变。

## A09 | 原PDF第4页 | 核查 | 波浪线

> For simplicity, we omit the environmental factors as they only affect the quantification of time and energy the UAV spends from node i to node j.

【适用范围】风和障碍改变的正是时间、电池可达性和换电触发条件。可作为确定性基准，但实际部署需压力测试、裕度或鲁棒约束，不能据此宣称所有飞行条件安全。

## A10 | 原PDF第5页 | 建模 | 下划线

> When the UAV reaches the battery swapping station (i.e., the BS), it removes the depleted battery and replaces it with a full one.

【换电是重置】无论残余多少，离站电量是Cbatt，不是旧电量加Cbatt。新图式(33b)也应保持这个语义，同时保留返站前的能量可行性。

## A11 | 原PDF第5页 | 问题 | 高亮

> The total operational costs of the UAV consist of the bandwidth cost, the computing resource cost, and the battery consumption cost.

【P1目标】b与fM是全程统一采购变量，不是每节点分别计费。π的单位及资源是否按任务/时长租赁需交代；未卸载也受正下界约束，隐含最低资源套餐。

## A12 | 原PDF第5页 | 方法 | 高亮

> By using virtual nodes, the above three aspects are uniformly transformed and incorporated into a path-planning problem in the extended graph, which reduces the complex interactions between variables in P1.

【最值得借鉴的拆分】不是简单轮流优化速度、换电、卸载，而是把它们编码成图中不同分支。重点讲一条路径如何恢复原变量，并检查映射双向可行。

## A13 | 原PDF第6页 | 方法 | 下划线

> Additionally, virtual speed nodes are introduced to represent different speed levels that the UAV can choose.

【图2】速度取自有限集合，实际航段成本可预计算。虚拟节点同一位置，不是真实多飞一段；虚拟边按类型承载计算、换电或零成本。

## A14 | 原PDF第6页 | 核查 | 波浪线

> (28d) ensures that the path from the start to the destination is loop-free and continuous.

【必要条件】流守恒本身不消除有向环；无环性依赖预定任务顺序及扩展图拓扑。若扩展到任意访问顺序，需额外子回路消除，不能直接复用这句话。

## A15 | 原PDF第7页 | 方法 | 高亮

> They are the product of a continuous variable and a binary variable, which can be linearized exactly [33].

【精确性的条件】连续量有有效上下界且X保持二元，四条McCormick约束才强制Z=XY。若X被放松到[0,1]，一般只是包络松弛。

## A16 | 原PDF第7页 | 方法 | 下划线

> These are convex cone constraints.

【式(37)】在b、rb均为正的域内，b·rb≥1等价于b≥1/rb的凸上图；正价格促使最优处取紧。不能因表面有乘积就直接判非凸。

## A17 | 原PDF第7页 | 方法 | 下划线

> P3 can be solved by off-the-shelf solvers, e.g., GUROBI, if the size of P3 is small.

【证书与边界】区分求得可行解、求得最优界和gap容限内最优。实验中应报告求解状态、上下界、时间上限，模型精确重构不意味着任何规模都容易解。

## A18 | 原PDF第8页 | 方法 | 高亮

> In each subproblem, the UAV starts from the BS, visits a subset of task nodes, and returns to the BS.

【ATC牺牲什么】分区边界强制返BS，会限制全局路径可行域。它解释速度提升也解释次优代价；不是无损分块。检查子集连续性及交界电池计费。

## A19 | 原PDF第8页 | 方法 | 下划线

> Since the subproblems are solved independently, the optimal values of bh and f M h among subproblems may differ.

【协调什么】每段有局部资源副本，master取平均目标，通过惩罚逼近共识；全局时间为各段时间之和。读图3时讲清变量、目标和反馈，不逐行复述伪代码。

## A20 | 原PDF第8页 | 核查 | 波浪线

> If δh = 0, all subproblems have the same values of bh and f M h.

【数值尺度】δh把带宽与计算频率偏差直接相加，需说明单位和归一化。严格零有明确含义，但ε=1e-5的意义随MHz/Hz、GHz/Hz变化。

## A21 | 原PDF第9页 | 实验 | 下划线

> The model and algorithm are implemented in MATLAB R2022a with YALMIP on a computer with Intel Core i7-12700 2.10 GHz and 16 GB RAM.

【先平台后结果】数学规划仿真，非实机飞行。耗时比较需固定线程、并行worker、求解器容限与随机任务样本；也要区分CPU总耗时与墙钟时间。

## A22 | 原PDF第9页 | 实验 | 下划线

> In a practical UAV patrol inspection system, task node locations and their visiting order can be known in advance, so we manually determine the locations and order of task nodes in the simulation to clearly present the results of UAV flight paths.

【实验范围】手工场景使路径可解释，但规模鲁棒性还需多地图、随机任务与不同顺序重复。不能将这些结果当作动态在线任务适应性证明。

## A23 | 原PDF第10页 | 实验 | 下划线

> Note that the proposed model, P3, does not guarantee the minimum total time spent, but it minimizes the battery swapping cost, which can reduce energy consumption and thus shorten the flight time of the UAV.

【目标与伴随收益】P3最小化三项总成本，不是独立最小化换电费用，也不保证最短时间。时间更低是所展示实例的现象，要保留作者前半句的限定。

## A24 | 原PDF第10页 | 实验 | 高亮

> The increase in resource cost is slightly bigger than the decrease in battery swapping cost.

【图4-5机制】更紧时限可能靠减少换电绕行和增加计算资源实现，而不必所有航段加速。把资源费用、电池费用、路径和速度同时读，才体现联合优化价值。

## A25 | 原PDF第11页 | 实验 | 下划线

> Note that the battery price πc is set to be proportional to battery capacity/mass.

【质量双重作用】电池更重提高容量，也增加推进/悬停功率与单块价格。图中0.2→0.4kg成本下降是测试范围内结果，不代表电池越重越好。

## A26 | 原PDF第11页 | 实验 | 高亮

> When the network size is set to 60 or 70 nodes, GUROBI fails to obtain a feasible solution to P3 within 2 hours.

【不能误读】是指定设置下两小时内未找到可行解，不证明问题本身不可行，也不证明没有其他可用精确/启发式方法。补求解日志、节点数、界与warm start对照。

## A27 | 原PDF第11页 | 方法 | 下划线

> Too many subproblems degrade the approximation to the original P3, causing higher total costs.

【分解权衡】更多分区带来更多边界返站，缩短子问题求解却损失路径自由度。H不是越大越好；用表IV同时比较成本gap与时间。

## A28 | 原PDF第11页 | 实验 | 下划线

> The results demonstrate good convergence performance of the proposed heuristic.

【经验收敛】图6资源一致误差与图7总时长展示特定实例迭代收敛，不是所有实例全局收敛/最优性定理。合并后还要按原P3逐条验算。

## A29 | 原PDF第6页 | 方法 | 框选

> 图2扩展图

【汇报核心图】用2任务2速度手工走路径：速度分支、L/M处理分支、直飞/返BS分支。每条边标明时间、能量和计费；证明原方案与新路径的一一对应需要固定访问顺序。

## A30 | 原PDF第6页 | 核查 | 框选

> 式(28e)换电计数

【显示公式核验】写成对每个j∈Cout都有xBS=入流，无法表示总次数。两个换电出口入流均1时，总次数应为2，而逐点等式给xBS=1；有未访问出口时还会冲突。需对所有换电出口求和。仅确认排印式问题，须查代码实现。

## A31 | 原PDF第7页 | 方法 | 框选

> 式(36)精确二元乘积

【手算验证】0≤Y≤10。X=0四约束推出Z=0；X=1推出Z=Y；若X=.5、Y=5，可允许0≤Z≤5，实际乘积为2.5。精确性依赖整数约束而非包络名字。

## A32 | 原PDF第7页 | 建模 | 框选

> 式(33)能量递推

【电池安全】实际节点、BS入口和终点的能量均需非负，换电出口重置Cbatt。核对所有界、未选边约束和返航段；这比仅用电池状态截断更直接表达能量可行性。

## A33 | 原PDF第8页 | 方法 | 框选

> 式(42)-(44)惩罚更新

【按原版面读取】式(43)为β的γ次方乘wt，不是β·γ·wt。β>1且时间超限时γ>0，权重必增加；越接近可行边界增长越小。不要因文本提取丢失上标误判惩罚下降。

## A34 | 原PDF第8页 | 核查 | 框选

> P5与式(39)

【分解后成本】各P5重复含全局资源价格，且有时间罚。需说明协调后的最终成本如何回到P3、惩罚是否改变选路，以及分区初始电池和交界换电如何计费。共识不自动证明最优。

## A35 | 原PDF第9页 | 实验 | 框选

> 表III

【机制消融】固定速度和固定换电基线分别限制可行域，最优联合模型不劣是结构上可预期的；实验价值在收益幅度和可行性边界。补强启发式基线及多实例统计。

## A36 | 原PDF第10页 | 实验 | 框选

> 图4-5

【关键证据联读】费用拆分→总时间→速度→卸载→换电。解释为何时限更紧仍可能部分减速，及电池变重后绕行减少是否抵消推进代价。

## A37 | 原PDF第11页 | 实验 | 框选

> 表IV

【算法质量与速度】读取每个规模下成本、耗时、H，若有精确最优报告相对gap，若无则用下界或最好已知解，不能继续称严格最优gap。并行资源配置需一致。

## A38 | 原PDF第5页 | 问题 | 框选

> P1总成本问题

【第二轮优先读】目标πa b+πb fM+πc(xBS+1)，结合时限、电池可达和任务访问约束解释成本。固定顺序下变量为何仍组合耦合？从速度改变能耗→改变返站→改变可用服务时间讲起。

## A39 | 原PDF第3页 | 建模 | 框选

> 图1巡检系统

【任务与服务流】UAV按指定顺序采集数据，BS同时提供通信、计算、换电三类服务。重画时标出直接飞往下一任务与绕行BS两种选择，避免把BS等同单一充电点。

## A40 | 原PDF第8页 | 方法 | 框选

> 图3 ATC框架

【协调职责】子问题给出资源需求与耗时，master形成共识目标，调整惩罚。讲清全程资源统一与总时限两项耦合；并行求解不是物理上多架UAV同时巡检。