// 故意保留 bug（无补零），任务有真实修复目标
function formatDuration(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const mStr = String(m).padStart(2, '0');
  const sStr = String(s).padStart(2, '0');
  return `${mStr}:${sStr}`;
}

module.exports = { formatDuration };
