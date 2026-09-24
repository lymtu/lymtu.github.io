/**
 * 时间戳转时间
 * @param timestamp 时间戳
 * @param format yyyy-mm-dd HH:MM:SS
 * @returns 格式化后的时间
 */
export const timeTransformer = (
  timestamp: number,
  format: string = "yyyy-mm-dd HH:MM",
) => {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const formattedDate = format
    .replace("yyyy", year.toString())
    .replace("mm", month.toString().padStart(2, "0"))
    .replace("dd", day.toString().padStart(2, "0"))
    .replace("HH", hour.toString().padStart(2, "0"))
    .replace("MM", minute.toString().padStart(2, "0"))
    .replace("SS", second.toString().padStart(2, "0"));
  return formattedDate;
};
