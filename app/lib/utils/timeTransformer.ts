/**
 * 展示时区。这些时间是在构建时算好写进静态 HTML 的，
 * 用本地时间方法取值会跟着构建机走（本地 CST、CI 为 UTC），
 * 所以这里显式固定成北京时间，与运行环境无关。
 */
const TIME_ZONE = "Asia/Shanghai";

const timeZoneFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/**
 * 时间戳转时间（按 Asia/Shanghai 渲染）
 * @param timestamp 时间戳
 * @param format yyyy-mm-dd HH:MM:SS
 * @returns 格式化后的时间
 */
export const timeTransformer = (
  timestamp: number,
  format: string = "yyyy-mm-dd HH:MM",
) => {
  const parts: Record<string, string> = {};
  for (const { type, value } of timeZoneFormatter.formatToParts(
    new Date(timestamp),
  )) {
    parts[type] = value;
  }

  return format
    .replace("yyyy", parts.year)
    .replace("mm", parts.month)
    .replace("dd", parts.day)
    .replace("HH", parts.hour)
    .replace("MM", parts.minute)
    .replace("SS", parts.second);
};
