

export const safeStringify = (value: unknown): string => {
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
};

export const capitalize = (str: string | undefined) : string => {
  if (str === undefined || str.length === 0) return "";
  return str[0]?.toUpperCase + str.slice(1);
}