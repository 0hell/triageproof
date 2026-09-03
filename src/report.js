const STATUS_LABELS = {
  ready: "Ready / 可进入分诊",
  "needs-info": "Needs information / 需要补充信息",
  blocked: "Blocked / 已阻止"
};

function escapeCell(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

export function renderMarkdown(result) {
  const lines = [
    "## TriageProof report",
    "",
    `**Status:** ${STATUS_LABELS[result.status] ?? result.status}`,
    `**Completeness:** ${result.score}/100`,
    "",
    "| Check | Result | Detail |",
    "| --- | --- | --- |"
  ];

  for (const check of result.checks) {
    lines.push(`| ${escapeCell(check.label)} | ${check.passed ? "PASS" : "MISSING"} | ${escapeCell(check.detail)} |`);
  }

  lines.push("", "### Security preflight", "");
  if (result.security.potentialSecrets > 0) {
    lines.push(
      `Found **${result.security.potentialSecrets}** potential secret(s). Secret values are intentionally omitted.`,
      "",
      "| Type | Location |",
      "| --- | --- |"
    );
    for (const finding of result.security.findings) {
      lines.push(`| ${finding.type} | line ${finding.line}, column ${finding.column} |`);
    }
    if (result.security.findingsTruncated) {
      lines.push("", "Additional finding locations were omitted to keep this report bounded.");
    }
    lines.push(
      "",
      "If any value was real, revoke or rotate it immediately. Editing or deleting a public issue may not undo prior exposure."
    );
  } else {
    lines.push("No high-confidence secret pattern was detected.");
  }

  lines.push(
    "",
    "> TriageProof is a preflight aid, not a guarantee that a report is complete or free of sensitive data."
  );

  return `${lines.join("\n")}\n`;
}
