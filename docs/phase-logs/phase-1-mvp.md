# Phase 1 MVP 开发日志

## 1. 本阶段完成内容

- 搭建 MeetPilot AI｜智能会议助手 单页应用。
- 实现左侧导航与四个核心模块：工作台、我的会议、待办事项、会议模板。
- 实现会议创建、会议工作区、会前准备生成、会议纪要生成、待办事项提取与状态追踪。
- 使用 localStorage 保存会议、AI 生成内容和待办状态。
- 提供一键重置演示数据能力，方便考试现场重复演示。

## 2. 关键产品决策

- 不做视频会议系统，只聚焦会议前后的辅助工作流。
- 将“会议工作区”作为核心体验，把会前准备、会议纪要和待办追踪集中到一个页面中。
- 使用 mock AI 函数模拟生成效果，避免 API key、后端服务和网络依赖。
- 待办事项同时出现在单个会议工作区和全局待办页，以证明产品不是单纯生成文本，而是支持持续跟进。
- 默认数据围绕产品增长、AI 功能规划和项目周同步，覆盖常见办公会议场景。

## 3. 主要页面和组件

- `App.tsx`：全局状态、页面切换、会议选择、AI 生成和 localStorage 更新。
- `Layout/Sidebar.tsx`：左侧导航、产品名称和重置演示数据入口。
- `Dashboard/StatCard.tsx`、`Dashboard/RecentMeetings.tsx`：工作台统计和最近会议。
- `Meetings/MeetingCard.tsx`：会议列表卡片。
- `Meetings/CreateMeetingModal.tsx`：新建会议表单。
- `Meetings/MeetingWorkspace.tsx`：会议概览、会前准备、会议纪要和待办事项标签页。
- `Actions/ActionItemCard.tsx`、`Actions/ActionFilters.tsx`：全局待办追踪与状态筛选。
- `Templates/TemplateCard.tsx`：会议模板展示。

## 4. Mock AI 设计

Mock AI 文件位于 `src/lib/mockAi.ts`，包含：

- `generatePreMeetingBrief(meeting)`：根据会议标题、目标和背景生成结构化会前准备。
- `generatePostMeetingSummary(transcript, meeting)`：根据会议文本和会议信息生成结构化纪要。
- `extractActionItems(summary, meeting)`：模拟从纪要中提取行动项。

生成内容会根据“增长”“AI”“周同步”等关键词产生轻微差异，避免所有会议输出完全相同。

## 5. 当前限制

- 生成内容是本地规则模拟，不具备真实大模型理解能力。
- 数据没有后端同步，刷新可保留，但换浏览器或设备不可共享。
- 没有用户体系、权限和团队协作。
- 没有接入日历、飞书、企微、Slack 或邮件。
- 没有真实录音、转写、摄像头、麦克风或 WebRTC 能力。

## 6. 建议下一阶段

- 接入真实 LLM API，提升纪要生成和待办提取质量。
- 增加日历导入能力，从日程自动创建会议。
- 支持语音转文字，连接真实会议记录来源。
- 增加导出 Markdown / PDF，便于分享纪要。
- 加入会议质量评分，例如目标清晰度、结论完整度和待办可执行性。
- 支持团队协作，允许不同成员查看和更新自己的行动项。
