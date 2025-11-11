import { safeStringify } from "./stringUtils";

export const getExceptionString = (error: unknown, prefix?: string): string => {
  const header = prefix ? `Error: ${prefix} ` : "Error: ";

  if (error instanceof Error) {
    return `${header}${error.name}: ${error.message}`;
  }

  return `${header}${safeStringify(error)}`;
};


/**
 * Detailed recursive description with optional stack traces and nested causes.
 * Similar to C# Exception.ToString() output.
 */
export const getDetailedExceptionString = (
  error: unknown,
  prefix?: string,
  includeStack = false
): string => {
  const visited: Error[] = [];

  const build = (err: unknown, level = 0): string => {
    const indent = "  ".repeat(level);

    if (err instanceof Error) {
      if (visited.includes(err)) return `${indent}[Circular cause]\n`;
      visited.push(err);

      const msg = `${indent}${err.name}: ${err.message}`;
      const stack = includeStack && err.stack
        ? `\n${indent}${err.stack}`
        : "";

      const causePart = err.cause
        ? `\n${indent}Cause →\n${build(err.cause, level + 1)}`
        : "";

      return `${msg}${stack}${causePart}`;
    }

    return `${indent}${safeStringify(err)}`;
  };

  const header = prefix ? `Error: ${prefix}\n` : "Error:\n";
  return header + build(error);
};


export const logException = (error: unknown, prefix?: string, addConsoleStack = false) => {
    const exceptionString = getDetailedExceptionString(error, prefix, addConsoleStack);
    console.log(exceptionString);
}




