import dayjs from "dayjs";

export function formatDate(date: string | number | Date, format?: string) {
  const time = dayjs(new Date(date)).format(format || "DD.MM.YY HH:MM");
  return time;
}
