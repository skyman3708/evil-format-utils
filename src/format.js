// 故意保留 bug（无补零），任务有真实修复目标
function formatDuration(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s}`;
}

module.exports = { formatDuration };
