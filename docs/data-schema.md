# LACONET 数据维护约定

## `data/meetings.csv`

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| `id` | 组会唯一编号 | `meeting-2026-06-26` |
| `date` | 组会日期，格式为 `YYYY-MM-DD` | `2026-06-26` |
| `time` | 组会时间 | `14:30-16:30` |
| `location` | 线下地点或线上会议说明 | `实验室 A301` |
| `mode` | 组会形式 | `线下` / `线上` / `混合` |
| `host` | 主持人 | `张三` |
| `presenter` | 汇报人，多个姓名用分号分隔 | `李四;王五` |
| `topic` | 本次组会主题 | `低空网络中的边缘智能` |
| `paper_ids` | 关联文献 ID，多个 ID 用分号分隔 | `uav-edge-drl-2026-001` |
| `status` | 状态 | `待举行` / `已归档` / `待补充` |
| `todo` | 待办事项，多个事项用分号分隔 | `上传 PPT;补充讨论记录` |
| `next_topic` | 下周预告或后续主题 | `低空通信感知一体化` |
| `materials` | 资料入口，可填 URL、相对路径或 `内部链接` | `内部链接` |
| `record` | 组会记录入口，可填 URL、相对路径或留空 | `notes/meeting-2026-06-26.md` |

## `data/papers.csv`

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| `id` | 文献唯一编号，也建议作为 Markdown 文件名 | `uav-edge-drl-2026-001` |
| `title` | 论文标题 | `Low-Altitude Edge Intelligence for UAV-Assisted Networks` |
| `authors` | 作者，多个作者用分号分隔 | `Author A;Author B` |
| `venue` | 会议或期刊 | `IEEE TWC` |
| `year` | 发表年份 | `2026` |
| `presenter` | 汇报人 | `李四` |
| `meeting_date` | 对应组会日期 | `2026-06-26` |
| `direction` | 主研究方向 | `低空网络` |
| `tags` | 标签，多个标签用分号分隔 | `无人机;边缘计算;强化学习` |
| `status` | 解读状态 | `待汇报` / `已归档` / `需补充` |
| `pdf` | PDF 入口，可填 URL、相对路径、`内部链接` 或留空 | `内部链接` |
| `ppt` | PPT 入口，可填 URL、相对路径、`内部链接` 或留空 | `内部链接` |
| `notes` | Markdown 解读路径 | `notes/uav-edge-drl-2026-001.md` |
| `code` | 代码入口，可填 URL、相对路径或留空 | `https://github.com/...` |
| `summary` | 一句话贡献总结 | `面向低空网络资源分配问题提出边缘智能调度框架。` |
| `discussion` | 组会讨论问题，多个问题用分号分隔 | `系统模型是否适用于密集城区?` |

## Markdown 解读模板

每篇文献建议放在 `notes/{id}.md`，并在开头保留 front matter：

```markdown
---
id: uav-edge-drl-2026-001
title: Low-Altitude Edge Intelligence for UAV-Assisted Networks
presenter: 李四
meeting_date: 2026-06-26
direction: 低空网络
tags:
  - 无人机
  - 边缘计算
  - 强化学习
---

# Low-Altitude Edge Intelligence for UAV-Assisted Networks

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

## `data/equipment.csv`

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| `id` | 设备唯一编号 | `a100-node-01` |
| `name` | 设备名称 | `A100 80G 计算节点` |
| `category` | 设备类型 | `计算服务器` |
| `location` | 设备位置 | `实验室 A301` |
| `manager` | 负责人 | `张三` |
| `status` | 当前状态 | `可预约` / `使用中` / `维护中` |
| `booking_required` | 是否需要提前预约 | `是` / `否` |
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
