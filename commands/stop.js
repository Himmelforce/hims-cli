import colorize from "#lib/colorize"
import { execSync } from "child_process"

export default () => {
  console.log(colorize("Stopping HiMS...", "blue"))

  execSync("docker compose --env-file .env --env-file .hims.env down", { stdio: "inherit" })
  console.log("\n" + colorize("HiMS was successfully stopped!", "green") + "\n")
}
