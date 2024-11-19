const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m"
}

export default (text, color = "reset") => {
  const colorCode = colors[color] || colors.reset
  return `${colorCode}${text}${colors.reset}`
}
