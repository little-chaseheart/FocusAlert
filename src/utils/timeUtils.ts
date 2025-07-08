/**
 * 将秒数格式化为 "分:秒" 格式
 * @param seconds 秒数
 * @returns 格式化后的时间字符串
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// 在时间区间内随机取秒数
export function getRandomTimes(minMinutes: number, maxMinutes: number): number {
  return Math.floor(Math.random() * (maxMinutes - minMinutes) * 60) + minMinutes * 60
}
