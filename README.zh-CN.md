<p align="center">
  <img src="docs/assets/hero.svg" width="900" alt="TriageProof——面向开源维护者的证据优先 Issue 预检工具">
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://github.com/0hell/triageproof/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/0hell/triageproof/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/0hell/triageproof/tags"><img alt="版本" src="https://img.shields.io/github/v/tag/0hell/triageproof?sort=semver&amp;label=version"></a>
  <a href="LICENSE"><img alt="MIT 许可证" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <a href="https://nodejs.org/"><img alt="Node.js 20+" src="https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&amp;logoColor=white"></a>
</p>

TriageProof 在进入分诊流程前检查公开错误报告：提示缺失的复现证据，并检测少量高置信度凭据模式，同时不把 Issue 内容发送给外部服务。

- **报告更可用：**检查复现步骤、环境信息、预期结果和实际结果。
- **默认本地：**规则确定、零运行时依赖、无 API 调用、无遥测。
- **自动化更安全：**GitHub Action 只读运行，不评论、不加标签、不关闭或编辑 Issue。

> **早期 MVP：**TriageProof 能降低无效分诊和意外泄露风险，但不能保证报告完整或完全没有敏感信息。

## 查看实际结果

```text
TriageProof report

Status: Needs information / 需要补充信息
Completeness: 25/100

Reproduction / 复现步骤   MISSING
Environment / 环境信息   PASS
Expected / 预期结果      MISSING
Actual / 实际结果        MISSING

Security preflight: no high-confidence pattern detected
```

报告只包含受控的检查结果和位置，不回显原始 Issue 正文或检测到的凭据值。

## 五分钟接入 GitHub 仓库

在你的仓库中创建 `.github/workflows/issue-preflight.yml`：

```yaml
name: Issue preflight

on:
  issues:
    types: [opened, edited, reopened]

permissions: {}

jobs:
  preflight:
    runs-on: ubuntu-latest
    steps:
      - name: Check issue
        uses: 0hell/triageproof@v0
        with:
          mode: advisory
```

提交文件后，新建或编辑一个 Issue，然后前往 **Actions → Issue preflight → Summary** 查看报告。

建议试用阶段使用 `advisory`：只生成报告，不阻断工作流。改成 `strict` 后，信息缺失会返回退出码 `1`，疑似包含敏感凭据会返回 `2`。如果你的供应链策略要求不可变 Action，请将 `v0` 换成完整提交 SHA。

## 本地运行

需要 Node.js 20 或更高版本，不需要安装运行时依赖。

```powershell
git clone https://github.com/0hell/triageproof.git
cd triageproof
node bin/triageproof.js check examples/complete-issue.md
```

执行 `npm run demo` 可以离线体验完整流程：脚本会使用模拟样例验证命令行、
脱敏和 Action 的两种模式，并在新的 `demo-output/run-*/` 目录生成可阅读的报告。
先打开其中的 `SUMMARY.md`。详见[本地演示指南](docs/LOCAL_DEMO.md)。

检查自己的 Markdown、读取标准输入、输出 JSON 或生成清理后的文本：

```powershell
node bin/triageproof.js check issue.md
Get-Content -Raw issue.md | node bin/triageproof.js check -
node bin/triageproof.js check issue.md --format json
node bin/triageproof.js sanitize issue.md > safe-issue.md
```

| 退出码 | 含义 |
| ---: | --- |
| `0` | 可以进入分诊 |
| `1` | 需要补充信息 |
| `2` | 检测到疑似敏感凭据 |
| `64` | 命令、输入、事件或 Action 模式无效 |

## 当前检查内容

| 检查项 | 当前行为 |
| --- | --- |
| 复现证据 | 支持英文和简体中文 Markdown 标题 |
| 环境信息 | 要求存在非占位内容 |
| 预期与实际结果 | 分开检查，明确指出缺口 |
| 凭据预检 | 对部分密钥、Token、显式赋值和私钥块使用少量高置信规则 |
| 安全报告 | 输出 Markdown 或 JSON，不回显检测值 |

## 安全设计

- 将 Issue 和 PR 文本作为不可信数据处理，永不执行其中的内容。
- 核心功能不联网，也不上传报告正文。
- Action 不请求仓库权限，不执行写操作。
- 限制输入、事件和发现数量，避免输出失控。
- 敏感凭据检测刻意保持小范围；完整仓库扫描仍应使用专用工具。

详细威胁边界和漏洞报告方式见 [SECURITY.md](SECURITY.md)。

## 加入试用

我们正在寻找少量接收公开错误报告的开源仓库自愿试用。接入约需五分钟，只记录经维护者同意公开的汇总反馈，绝不保存私有 Issue 正文或密钥值。

[申请试用或提交反馈](https://github.com/0hell/triageproof/issues/new?template=pilot-feedback.yml) · [阅读试用指南](PILOT.md)

## 当前状态与路线图

**v0.2 — Pilot Ready** 增加可重复运行的本地演示、损坏事件的安全错误提示，
以及实际加载 Action 入口的 CI 验证。版本号统一来自项目配置。
AI 集成、自动修改 Issue、广泛密钥扫描和复杂配置系统仍不在范围内。

CI 使用模拟 Issue 数据。这些自测不代表外部采用；真实 Issue 事件的验证和维护者反馈单独记录。

参见 [v0.2 计划](docs/V0.2_PLAN.md)、[路线图](ROADMAP.md)和[更新日志](CHANGELOG.md)。

## 参与贡献

欢迎提交错误报告、安全测试样例、翻译和试用反馈。请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)和[行为准则](CODE_OF_CONDUCT.md)。

本项目使用 [MIT License](LICENSE)。
