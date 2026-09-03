# TriageProof

面向开源维护者的“证据优先”Issue 预检工具。

TriageProof 检查错误报告是否包含复现步骤、环境信息、预期结果和实际结果，并在报告被公开或交给自动化工作流之前，检测少量高置信度的敏感凭据模式。

核心功能完全在本地运行、结果可解释、零运行时依赖，不会上传 Issue 内容。

> 当前状态：早期 MVP。TriageProof 只能降低风险，不能保证报告完整或完全不含敏感信息。

## 快速试用

需要 Node.js 20 或更高版本。

```powershell
node bin/triageproof.js check examples/complete-issue.md
node bin/triageproof.js check examples/incomplete-issue.md
node bin/triageproof.js check issue.md --format json
node bin/triageproof.js sanitize issue.md
```

## v0.1 检查内容

- 复现步骤
- 环境信息
- 预期结果
- 实际结果
- 少量高置信凭据模式
- 中英文 Markdown 标题

退出码：`0` 表示可进入分诊，`1` 表示需要补充信息，`2` 表示疑似包含秘密，`64` 表示输入或命令错误。

## 安全边界

TriageProof 将 Issue 文本视为不可信数据，不执行报告中的命令。当前 GitHub Action 不会自动评论、关闭、添加标签或修改 Issue。检测可能遗漏，也可能误报，详情见 [SECURITY.md](SECURITY.md)。

## 当前目标

先用最小功能验证真实需求，并寻找少量自愿参与的开源项目试用。Agent Packet、更广泛检测和可选 Codex 分诊属于后续路线图，不会被描述成已经实现的功能。

试用计划见 [PILOT.md](PILOT.md)，开发路线见 [ROADMAP.md](ROADMAP.md)。
