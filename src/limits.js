export const MAX_INPUT_BYTES = 256 * 1024;
export const MAX_FINDINGS = 50;

export class InputValidationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "InputValidationError";
    this.code = code;
  }
}

export function validateInputText(input) {
  const text = String(input);
  if (Buffer.byteLength(text, "utf8") > MAX_INPUT_BYTES) {
    throw new InputValidationError(
      `Input exceeds the ${MAX_INPUT_BYTES}-byte safety limit.`,
      "INPUT_TOO_LARGE"
    );
  }
  if (text.includes("\0")) {
    throw new InputValidationError("Input contains a NUL byte.", "INVALID_TEXT");
  }
  return text;
}

export function decodeInputBuffer(buffer) {
  if (buffer.length > MAX_INPUT_BYTES) {
    throw new InputValidationError(
      `Input exceeds the ${MAX_INPUT_BYTES}-byte safety limit.`,
      "INPUT_TOO_LARGE"
    );
  }

  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    throw new InputValidationError("Input is not valid UTF-8.", "INVALID_TEXT");
  }
  return validateInputText(text);
}
