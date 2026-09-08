const FIELD_DEFINITIONS = [
  {
    id: "reproduction",
    label: "Reproduction / 复现步骤",
    weight: 35,
    minimumLength: 12,
    aliases: [
      "steps to reproduce",
      "reproduction steps",
      "reproduction",
      "how to reproduce",
      "reproduce",
      "复现步骤",
      "如何复现",
      "重现步骤"
    ]
  },
  {
    id: "environment",
    label: "Environment / 环境信息",
    weight: 25,
    minimumLength: 3,
    aliases: [
      "environment",
      "system information",
      "runtime",
      "versions",
      "环境信息",
      "运行环境",
      "系统信息",
      "版本信息"
    ]
  },
  {
    id: "expected",
    label: "Expected / 预期结果",
    weight: 20,
    minimumLength: 5,
    aliases: [
      "expected behavior",
      "expected result",
      "expected",
      "what did you expect",
      "预期行为",
      "预期结果",
      "期望结果"
    ]
  },
  {
    id: "actual",
    label: "Actual / 实际结果",
    weight: 20,
    minimumLength: 5,
    aliases: [
      "actual behavior",
      "actual result",
      "actual",
      "what happened",
      "实际行为",
      "实际结果",
      "发生了什么"
    ]
  }
];

const PLACEHOLDERS = new Set([
  "",
  "none",
  "n/a",
  "na",
  "no response",
  "_no response_",
  "nothing",
  "todo",
  "tbd",
  "to be added",
  "待补充",
  "待完善",
  "无",
  "没有",
  "暂无",
  "不适用"
]);

function normalizeHeading(value) {
  return value
    .toLowerCase()
    .replace(/<!--.*?-->/g, "")
    .replace(/[：:？?！!。．.、，,()（）\[\]【】]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function headingMatches(heading, alias) {
  if (heading === alias) return true;
  const parts = heading.split(/\s*[\/|｜·—–]\s*/u);
  return parts.includes(alias);
}

function definitionForHeading(rawHeading) {
  const heading = normalizeHeading(rawHeading);
  return FIELD_DEFINITIONS.find((definition) =>
    definition.aliases.some((alias) => headingMatches(heading, alias))
  );
}

function meaningfulText(value) {
  return value
    .replace(/<!--[^]*?(?:-->|$)/g, "")
    .replace(/```[a-z0-9_-]*\s*/gi, "")
    .replace(/```/g, "")
    .replace(/[`*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseIssueSections(input) {
  const lines = String(input).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split("\n");
  const sections = {};
  let active = null;
  let activeLevel = 0;
  let fence = null;
  const commentState = { open: false };

  function appendContent(rawLine, visibleLine = rawLine) {
    if (!active) return;
    sections[active].lines.push(rawLine);
    sections[active].contentLines.push(visibleLine);
  }

  function visibleOutsideComments(line) {
    let rest = line;
    let visible = "";

    while (rest.length > 0) {
      if (commentState.open) {
        const end = rest.indexOf("-->");
        if (end === -1) return visible;
        rest = rest.slice(end + 3);
        commentState.open = false;
        continue;
      }

      const start = rest.indexOf("<!--");
      if (start === -1) return visible + rest;
      visible += rest.slice(0, start);
      rest = rest.slice(start + 4);
      commentState.open = true;
    }

    return visible;
  }

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];

    if (fence) {
      const closing = rawLine.match(/^\s{0,3}(`{3,}|~{3,})\s*$/);
      if (
        closing &&
        closing[1][0] === fence.character &&
        closing[1].length >= fence.length
      ) {
        fence = null;
      }
      appendContent(rawLine);
      continue;
    }

    const visibleLine = visibleOutsideComments(rawLine);
    const opening = visibleLine.match(/^\s{0,3}(`{3,}|~{3,})(?:\s*.*)?$/);
    if (opening) {
      fence = { character: opening[1][0], length: opening[1].length };
      appendContent(rawLine, visibleLine);
      continue;
    }

    const heading = visibleLine.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const definition = definitionForHeading(heading[2]);
      const level = heading[1].length;
      if (definition) {
        active = definition.id;
        activeLevel = level;
        if (!sections[definition.id]) {
          sections[definition.id] = { line: index + 1, lines: [], contentLines: [] };
        }
      } else if (active && level > activeLevel) {
        // Keep subsection titles in raw text, but only their body counts as evidence.
        sections[active].lines.push(rawLine);
      } else {
        active = null;
        activeLevel = 0;
      }
      continue;
    }

    appendContent(rawLine, visibleLine);
  }

  return Object.fromEntries(
    Object.entries(sections).map(([id, section]) => [
      id,
      {
        line: section.line,
        raw: section.lines.join("\n").trim(),
        text: meaningfulText(section.contentLines.join("\n"))
      }
    ])
  );
}

export function evaluateRequiredFields(input) {
  const sections = parseIssueSections(input);

  const checks = FIELD_DEFINITIONS.map((definition) => {
    const section = sections[definition.id];
    if (!section) {
      return {
        id: definition.id,
        label: definition.label,
        passed: false,
        points: 0,
        possible: definition.weight,
        detail: "Missing section / 缺少此部分"
      };
    }

    const normalized = section.text.toLowerCase();
    if (PLACEHOLDERS.has(normalized) || section.text.length < definition.minimumLength) {
      return {
        id: definition.id,
        label: definition.label,
        passed: false,
        points: 0,
        possible: definition.weight,
        line: section.line,
        detail: "Present but not actionable / 已填写但信息不足"
      };
    }

    return {
      id: definition.id,
      label: definition.label,
      passed: true,
      points: definition.weight,
      possible: definition.weight,
      line: section.line,
      detail: "Found / 已找到"
    };
  });

  return {
    checks,
    score: checks.reduce((total, check) => total + check.points, 0),
    missing: checks.filter((check) => !check.passed).map((check) => check.id)
  };
}

export { FIELD_DEFINITIONS };
