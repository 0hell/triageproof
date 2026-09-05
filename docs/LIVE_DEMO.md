# Live Issue demonstration / 真实 Issue 演示

On 2026-09-05, a maintainer opened and then edited [issue #1](https://github.com/0hell/triageproof/issues/1)
to exercise the repository's existing `Issue preflight` workflow. The content is
synthetic; both events ran on GitHub-hosted runners using the real issue payload.
No `workflow_dispatch`, synthetic event override, or bot comment was used.

2026-09-05，维护者创建并编辑了同一个测试 Issue，实际触发仓库已有的预检工作流。
正文为模拟样例，事件是真实的 Issue 新建与编辑事件。Action 只读运行，报告位于 Actions Summary。

## Run record / 运行记录

| Item / 项目 | Before / 修改前 | After / 修改后 |
| --- | --- | --- |
| Event / 事件 | `issues.opened` | `issues.edited` |
| Run / 运行 | [33952775281](https://github.com/0hell/triageproof/actions/runs/33952775281) | [33952930498](https://github.com/0hell/triageproof/actions/runs/33952930498) |
| Started (UTC) / 开始时间 | 2026-09-05 07:31:01 | 2026-09-05 07:34:25 |
| Body snapshot / 正文快照 | [before.md](../examples/live-demo/before.md) | [after.md](../examples/live-demo/after.md) |
| Workflow conclusion / 工作流结论 | `success` | `success` |
| Report status / 报告状态 | `needs-info` | `ready` |
| Completeness / 完整度 | 25/100 | 100/100 |
| Potential secrets / 疑似凭据 | 0 | 0 |

Both runs used `mode: advisory` and `0hell/triageproof@v0`, which resolved to
[`ec69b52ba7f2ff6200ded2e816ed51aa68c09d93`](https://github.com/0hell/triageproof/commit/ec69b52ba7f2ff6200ded2e816ed51aa68c09d93).
The default branch also pointed to that commit for both runs.

The hosted run conclusions were verified through the GitHub API. The report values
were checked by replaying the exact saved bodies through the same Action entry point.
The README text is a compact representation of those results, not a captured screenshot.
Actual GitHub Summary screenshots remain to be added by the maintainer.

真实运行的完成状态已通过 GitHub API 核实；报告数值已用同一版本的 Action 入口回放正文核对。
README 中的文字结果不是截图，真实 GitHub Summary 截图由维护者后续补充。

`advisory` reports missing information without failing the job. Therefore both runs
are green, while only the second report is `ready`. The completeness score measures
report structure; it does not prove that a bug was fixed. `strict` mode returns a
nonzero exit code for missing information or a potential secret.

`advisory` 模式下，两次工作流均为绿色，只有第二次报告为 `ready`。
补全通过表示 Issue 信息结构完整，不代表修复了产品缺陷。
如需缺失信息时工作流变红，可在自己的仓库将 `mode: advisory` 改为 `mode: strict`。

## Capture the two reports / 补充两张截图

1. Sign in to GitHub and open the [first run](https://github.com/0hell/triageproof/actions/runs/33952775281).
   Stay on **Summary** and scroll to **TriageProof report**. Capture the report title,
   `Needs information`, `25/100`, the four checks, and the security preflight result.
   Save as `docs/assets/issue-preflight-needs-info.png`.
2. Open the [second run](https://github.com/0hell/triageproof/actions/runs/33952930498)
   and capture the same area showing `Ready`, `100/100`, and four `PASS` results.
   Save as `docs/assets/issue-preflight-ready.png`.
3. In both `README.md` and `README.zh-CN.md`, find
   `LIVE-DEMO-BEFORE-SCREENSHOT` and `LIVE-DEMO-AFTER-SCREENSHOT`. Replace each
   whole comment block with its image line. Remove the sentence saying screenshots
   are pending, update the pending note above, and commit the two PNGs and Markdown changes.

中文操作：

1. 登录 GitHub，打开上表“修改前”的运行链接，在 **Summary** 页面向下找到报告。
   用 `Win + Shift + S` 截取报告标题、状态、25/100 分数、四个检查项和安全预检结果。
   保存为 `docs/assets/issue-preflight-needs-info.png`。
2. 打开“修改后”的运行链接，截取相同区域，确认显示 `Ready`、100/100、四项 `PASS`。
   保存为 `docs/assets/issue-preflight-ready.png`。
3. 两份 README 都已预留图片语句。搜索 `LIVE-DEMO-`，将对应的整个 HTML 注释块替换为
   其中的图片语句，再删除“截图待补充”的说明，并更新本页的待补充说明，一起提交。

For consistent images, use the same browser zoom and crop width. Capture the report
itself rather than only the green workflow badge. The same two PNGs serve both READMEs.
If the summary is hidden, sign in and reload the run; the report is not posted on the issue.

两张图使用相同缩放和裁剪宽度即可，中英文 README 共用图片。
不要只截绿色工作流徽章；截图重点是报告内容。如果未显示报告，请登录后刷新。
报告不会自动评论到 Issue 下。

## Replay the saved bodies / 本地复跑正文

```bash
node bin/triageproof.js check examples/live-demo/before.md
node bin/triageproof.js check examples/live-demo/after.md
```

The first CLI command returns exit code `1`; the second returns `0`.
For Action replay and both modes, see [LOCAL_DEMO.md](LOCAL_DEMO.md).

第一个命令退出码为 `1`，第二个为 `0`。Action 入口与两种模式的回放见本地演示指南。

To repeat the hosted demonstration, install [the copyable workflow](../examples/issue-preflight.yml)
on a repository's default branch. Open a blank issue with `before.md`, wait for the
run to finish, then edit its body to `after.md`. Wait for the first run before editing:
the concurrency setting cancels an older run if a newer edit arrives while it is running.
Keep issue #1 and the two recorded runs as evidence; use a separate demo issue for new recordings.

要重复线上演示，先把工作流放到默认分支。新建空白 Issue，粘贴 `before.md`；
等待第一次运行完成，再将正文替换为 `after.md`。不要过早编辑，以免并发配置取消前一次运行。
现有 Issue #1 和两次运行用作演示记录，重新录制时另建测试 Issue。

GitHub requires the workflow file to exist on the default branch for Issue events:
[official event documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#issues).
