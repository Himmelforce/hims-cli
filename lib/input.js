import readline from "readline"

export default async (question, defaultValue = null) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const prompt = q => new Promise(resolve => rl.question(q, resolve))

  const answer = await prompt(`${question}${defaultValue ? ` (${defaultValue})` : ""}: `)
  rl.close()
  return answer || defaultValue
}
