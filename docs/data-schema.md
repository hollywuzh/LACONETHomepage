# LACONET 数据维护约定

## 核心编号规则

| 编号 | 含义 | 规则 | 示例 |
| --- | --- | --- | --- |
| PID | 论文本身的唯一编号 | 优先使用规范化 DOI；无 DOI 时查重后分配 `LIT-年份-流水号` | `DOI-10.1109_ACCESS.2024.3361284` |
| RID | 某次组会汇报的唯一编号 | `RPT-YYYYMMDD-学生唯一编号` | `RPT-20260618-REN-YU` |

维护原则：

- 同一篇论文只有一个 PID，但可以关联多个 RID。
- PDF 按 PID 只保存一份，放在论文条目上维护。
- PPT、Markdown、讨论问题和个人验证按 RID 归档。
- 已入库文献无需重复提交 PDF，只需复用 PID 并新建 RID。
- 学生唯一编号建议固定维护，避免同名学生或姓名变化造成 RID 冲突。

## `data/meetings.csv`

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| `id` | 组会唯一编号 | `meeting-2026-06-26` |
| `date` | 组会日期，格式为 `YYYY-MM-DD` | `2026-06-26` |
| `time` | 组会时间 | `14:30-16:30` |
| `location` | 线下地点或线上会议说明 | `实验室 A301` |
| `mode` | 组会形式 | `线下` / `线上` / `混合` |
| `host` | 主持人 | `张三` |
| `presenter` | 汇报人摘要，多个姓名用分号分隔 | `李四;王五` |
| `topic` | 本次组会主题 | `低空网络中的边缘智能` |
| `report_ids` | 关联 RID，多个 RID 用分号分隔 | `RPT-20260626-S001;RPT-20260626-U003` |
| `status` | 状态 | `待举行` / `已归档` / `待补充` |
| `todo` | 待办事项，多个事项用分号分隔 | `上传 PPT;补充讨论记录` |
| `next_topic` | 下周预告或后续主题 | `低空通信感知一体化` |
| `materials` | 资料入口，可填 URL、相对路径或 `内部链接` | `内部链接` |
| `record` | 会议纪要 Markdown 路径、URL 或留空 | `records/meeting-2026-06-26.md` |

## `data/papers.csv`

`papers.csv` 只维护 PID 级论文信息，不记录某次具体汇报。

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| `pid` | 文献唯一编号 | `DOI-10.1109_ACCESS.2024.3361284` |
| `title` | 论文标题 | `Low-Altitude Edge Intelligence for UAV-Assisted Networks` |
| `authors` | 作者，多个作者用分号分隔 | `Author A;Author B` |
| `venue` | 会议或期刊 | `IEEE TWC` |
| `year` | 发表年份 | `2026` |
| `doi` | DOI 原文，无 DOI 时留空 | `10.1109/ACCESS.2024.3361284` |
| `direction` | 主研究方向 | `低空网络` |
| `tags` | 标签，多个标签用分号分隔 | `无人机;边缘计算;强化学习` |
| `status` | 入库状态 | `已入库` / `待查重` / `需补充` |
| `pdf` | PDF 入口，可填 URL、相对路径、`内部链接` 或留空 | `内部链接` |
| `code` | 论文官方代码或公共代码入口，可填 URL、相对路径或留空 | `https://github.com/...` |
| `summary` | 一句话贡献总结 | `面向低空网络资源分配问题提出边缘智能调度框架。` |

## `data/reports.csv`

`reports.csv` 维护 RID 级汇报记录。每新增一次汇报，都在这里新增一行。

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| `rid` | 汇报唯一编号 | `RPT-20260626-S001` |
| `pid` | 对应论文 PID | `DOI-10.1109_ACCESS.2024.3361284` |
| `meeting_id` | 对应组会 ID | `meeting-2026-06-26` |
| `report_date` | 汇报日期，格式为 `YYYY-MM-DD` | `2026-06-26` |
| `report_type` | 汇报类型 | `研究生文献解读` / `本科生文献解读` |
| `presenter` | 汇报人 | `李四` |
| `student_uid` | 学生唯一编号 | `S001` |
| `duration` | 汇报时长 | `15-20 分钟` |
| `status` | 汇报状态 | `待汇报` / `已归档` / `需补充` |
| `ppt` | PPT 入口，可填 URL、相对路径、`内部链接` 或留空 | `内部链接` |
| `docx` | Word 汇报文档入口，可留空 | `materials/2026-09-12/pan-jianghao-report.docx` |
| `notes` | Markdown 解读路径 | `notes/RPT-20260626-S001.md` |
| `code` | 本次汇报验证代码或补充材料入口 | `https://github.com/...` |
| `summary` | 本次汇报的一句话说明 | `围绕无人机辅助 MEC 任务卸载进行文献解读。` |
| `discussion` | 组会讨论问题，多个问题用分号分隔 | `系统模型是否适用于密集城区?` |

## Markdown 解读模板

每次汇报建议放在 `notes/{RID}.md`，并在开头保留 front matter：

```markdown
---
rid: RPT-20260626-S001
pid: DOI-10.1109_ACCESS.2024.3361284
title: Low-Altitude Edge Intelligence for UAV-Assisted Networks
presenter: 李四
student_uid: S001
meeting_date: 2026-06-26
report_type: 研究生文献解读
direction: 低空网络
tags:
  - 无人机
  - 边缘计算
  - 强化学习
---

# Low-Altitude Edge Intelligence for UAV-Assisted Networks

## 文献信息

- PID：
- RID：
- DOI：
- 作者：
- 来源：
- 出版年份：
- 汇报人：
- 学生编号：
- 汇报类型：
- 组会日期：

## 一句话总结

本文面向……问题，提出……方法，在……场景下提升……性能。

## 研究背景

## 核心问题

## 方法框架

## 关键技术

## 实验设置

## 主要结论

## 优点与不足

## 组会讨论问题

## 延伸阅读
```

## 会议纪要存放约定

每次组会结束后，建议在 `records/` 下新增一篇会议纪要 Markdown，并在 `data/meetings.csv` 的 `record` 字段中填写对应路径。

推荐命名：

```text
records/meeting-YYYY-MM-DD.md
```

会议纪要建议包含：

- 基本信息：时间、地点、主持人、记录人
- 本次议程：研究生文献解读、本科生文献解读、个人或小组进展汇报
- 文献解读要点，并标明 PID 与 RID
- 讨论问题
- 会议结论
- 待办事项
- 下次组会预告

## `data/equipment.csv`

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| `id` | 设备唯一编号 | `a100-node-01` |
| `name` | 设备名称 | `A100 80G 计算节点` |
| `quantity` | 设备数量，可填写数字或“若干” | `2` |
| `category` | 设备类型 | `计算服务器` |
| `location` | 设备位置 | `实验室 A301` |
| `manager` | 负责人 | `张三` |
| `status` | 当前状态 | `可预约` / `使用中` / `维护中` |
| `booking_required` | 是否需要提前预约 | `是` / `否` / `待确认` |
| `form_link` | 登记表单入口 | `内部链接` 或表单 URL |
| `notes` | 使用说明 | `单次预约建议不超过 24 小时` |

## `data/equipment-usage.csv`

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| `id` | 使用记录唯一编号 | `use-20260622-001` |
| `equipment_id` | 对应设备 ID | `a100-node-01` |
| `user` | 使用人 | `李四` |
| `start_time` | 开始时间，格式为 `YYYY-MM-DD HH:mm` | `2026-06-22 14:00` |
| `end_time` | 结束时间，格式为 `YYYY-MM-DD HH:mm` | `2026-06-22 22:00` |
| `purpose` | 使用目的 | `模型训练` |
| `status` | 使用状态 | `待确认` / `已预约` / `使用中` / `已完成` |
| `remark` | 备注 | `请勿断电` |
