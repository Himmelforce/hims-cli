import { execSync } from "child_process"
import colorize from "#lib/colorize"
import process from "process"

const current_directory = process.cwd()

export default async (flags, config) => {
  let command = "docker-compose --env-file .env --env-file .hims.env up -d --wait traefik"

  console.log(colorize("Starting the HiMS development version setup...", "blue"))
  
  switch (config.get("ENVIRONMENT")) {
    case "development":
      command =
        "docker-compose --env-file .env --env-file .hims.env -f docker-compose.yml -f docker-compose.development.yml up --watch -d --wait traefik"
      break
    case "production":
      command =
        "docker-compose --env-file .env --env-file .hims.env -f docker-compose.yml -f docker-compose.production.yml up -d --wait traefik"
      break
  }

  execSync(command, { stdio: "inherit", cwd: current_directory })
}
