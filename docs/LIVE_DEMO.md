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
The README text is a compact representation of those results. Three original
maintainer-provided screenshots are now included: two from the CI self-tests and
one from the second live Issue run. The first live Issue run is documented by its
run link and saved body; the 25/100 screenshot illustrates the CI `action-smoke` result.

真实运行的完成状态已通过 GitHub API 核实；报告数值已用同一版本的 Action 入口回放正文核对。
已收录维护者提供的三张原始截图：两张来自 CI 自测，一张来自第二次真实 Issue 运行。
第一次真实 Issue 运行保留运行链接与正文快照；25/100 的截图展示的是 CI `action-smoke` 结果。

`advisory` reports missing information without failing the job. Therefore both runs
are green, while only the second report is `ready`. The completeness score measures
report structure; it does not prove that a bug was fixed. `strict` mode returns a
nonzero exit code for missing information or a potential secret.

`advisory` 模式下，两次工作流均为绿色，只有第二次报告为 `ready`。
补全通过表示 Issue 信息结构完整，不代表修复了产品缺陷。
如需缺失信息时工作流变红，可在自己的仓库将 `mode: advisory` 改为 `mode: strict`。

## Published screenshots / 已发布截图

All three PNGs are stored unchanged under `docs/assets/` and shared by both READMEs.
Their original filenames are preserved; the source column identifies what each image shows.

三张 PNG 原样保存于 `docs/assets/`，保留原文件名，由中英文 README 共用。
下表按截图中的实际工作流标注来源。

| Image / 原图 | Source / 来源 | Visible result / 展示内容 | README placement / 展示位置 |
| --- | --- | --- | --- |
| [issue-preflight-needs-info1.png](assets/issue-preflight-needs-info1.png) | [CI · 33953191758](https://github.com/0hell/triageproof/actions/runs/33953191758), `push`, commit `bb9332e` | `test` + `action-smoke`; synthetic case table and sanitization / 模拟场景表与脱敏结果 | Expandable CI overview / 可展开的 CI 自测总览 |
| [issue-preflight-needs-info2.png](assets/issue-preflight-needs-info2.png) | [CI · 33953191758](https://github.com/0hell/triageproof/actions/runs/33953191758), `action-smoke` | `Needs information`, 25/100; three missing sections / 缺少三项信息 | Missing-information report, labeled CI self-test / 明确标注为 CI 自测的缺失信息报告 |
| [issue-preflight-ready.png](assets/issue-preflight-ready.png) | [Issue preflight · 33952930498](https://github.com/0hell/triageproof/actions/runs/33952930498), `issues.edited` | `edited #1`, `preflight`, `Ready`, 100/100, four `PASS` checks | Live Issue result after completion / 真实 Issue 补全后通过结果 |

The CI images use synthetic event payloads. The ready image shows the real
`issues.edited` run for issue #1. Captions in both READMEs retain this distinction.

CI 截图使用模拟事件；通过截图展示 Issue #1 的真实编辑事件。两份 README 的图注均保留来源说明。

## Refresh screenshots / 后续更新截图

Open the relevant run link above, sign in if needed, and stay on **Summary**.
Scroll to **TriageProof report** and capture the title, status, score, four checks,
and security preflight. A live Issue run has the `preflight` job; the CI self-test
has `test` and `action-smoke`. When replacing an image, update its source link and
caption in both READMEs and this record. Keep the existing run links for historical reference.

后续更新时，打开对应运行链接并登录，在 **Summary** 中截取报告标题、状态、分数、
四个检查项和安全预检。真实 Issue 运行的任务名为 `preflight`，CI 自测任务名为
`test` 和 `action-smoke`。更换图片时同步更新两份 README 和本页的来源链接与图注，保留历史运行链接。

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
