import { evaluateRequiredFields } from "./parser.js";
import { inspectSecrets } from "./redactor.js";
import { validateInputText } from "./limits.js";

export function analyzeIssue(input) {
  const source = validateInputText(input);
  const completeness = evaluateRequiredFields(source);
  const secretInspection = inspectSecrets(source);

  let status = "ready";
  if (secretInspection.findingCount > 0) status = "blocked";
  else if (completeness.missing.length > 0) status = "needs-info";

  return {
    schemaVersion: "1.0",
    status,
    score: completeness.score,
    checks: completeness.checks,
    missing: completeness.missing,
    security: {
      potentialSecrets: secretInspection.findingCount,
      findings: secretInspection.findings,
      findingsTruncated: secretInspection.findingsTruncated,
      valuesIncluded: false
    }
  };
}
