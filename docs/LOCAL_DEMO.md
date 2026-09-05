# Run v0.2 locally / 本地运行第二版

Requires Node.js 20 or newer. No dependency installation, account, API key, Docker,
or network connection is required after downloading the source.

需要 Node.js 20 或以上版本。下载项目后，无需安装依赖、登录账号、配置 API 密钥或 Docker。

From the project directory / 在项目目录执行：

```powershell
npm run demo
```

The script launches the actual CLI and Action processes with synthetic examples.
It verifies their exits and outputs and prints the new report directory.
脚本实际启动 CLI 和 Action，验证退出码与结果，并打印本次报告目录。

| Scenario / 场景 | Completeness / 分数 | CLI | Advisory Action | Strict Action |
| --- | ---: | ---: | ---: | ---: |
| Ready / 信息完整 | 100 | 0 | 0 | 0 |
| Needs information / 缺少信息 | 25 | 1 | 0 | 1 |
| Potential secret / 疑似凭据 | 100 | 2 | 0 | 2 |

A 100-point report can still be blocked by the credential check. The score measures
field completeness, not security. 高分不代表安全；即使四项信息齐全，疑似密钥仍会阻止报告进入分诊。

Open `demo-output/run-*/SUMMARY.md` for the overview. Each scenario also has Markdown,
JSON, Action summaries, and Action output files. `sanitized-issue.md` shows the fake
credential replaced with `[GITHUB_TOKEN_1]`. Each run gets a fresh directory.

打开本次目录中的 `SUMMARY.md` 查看汇总；同目录还有 Markdown、JSON、Action 报告和
`sanitized-issue.md` 脱敏样例。每次运行使用新目录，历史结果保留；这些目录被 Git 忽略。

To check your own file / 检查自己的文件：

```powershell
node bin/triageproof.js check issue.md
node bin/triageproof.js check issue.md --format json
node bin/triageproof.js sanitize issue.md
```

Use `npm run check` to run regression tests. Demo fixtures are synthetic and must not
be used as claims of external users or real-world security effectiveness.

使用 `npm run check` 运行回归测试。模拟演示和自测结果不能算作真实用户或实际安全效果的证据。

For a trusted event JSON replay, the Action accepts an optional `event-path` input.
Normal issue workflows should omit it and use the runner event. Only a maintainer-controlled
workflow should select this path; never derive it from an issue body.

Action 提供可选的 `event-path`，用于回放由维护者准备的事件 JSON。
普通 Issue 工作流无需设置；不要根据 Issue 正文拼接该路径。
