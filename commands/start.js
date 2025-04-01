import { execSync } from "child_process"
import colorize from "#lib/colorize"
import fs from "fs"
import process from "process"

export default async (flags, config) => {
  try {
    execSync("docker info", { stdio: "ignore" })
  } catch (error) {
    console.error(
      colorize(
        "Docker is required and must be running to run this script. Please ensure Docker is installed and started.",
        "red"
      )
    )
    process.exit(1)
  }

  const configPath = `${process.cwd()}/.hims.env`
  if (!fs.existsSync(configPath)) {
    console.error(colorize("Error: Configuration file .hims.env not found in the project directory!", "red"))
    process.exit(1)
  }

  let start_command = "docker-compose --env-file .env --env-file .hims.env up -d --wait traefik"
  console.log(colorize("Starting the HiMS development version setup...", "blue"))

  const development_path_in_config = config.get("DOCKER_COMPOSE_DEVELOPMENT_PATH").split(",") || []
  const production_path_in_config = config.get("DOCKER_COMPOSE_PRODUCTION_PATH").split(",") || []

  switch (config.get("ENVIRONMENT")) {
    case "development":
      start_command = `docker compose --env-file .env --env-file .hims.env -f docker-compose.yml ${
        development_path_in_config.length > 0 ? `-f ${development_path_in_config.join(" -f ")}` : ""
      } up -d --wait traefik`
      break
    case "production":
      start_command = `docker compose --env-file .env --env-file .hims.env -f docker-compose.yml ${
        production_path_in_config.length > 0 ? `-f ${production_path_in_config.join(" -f ")}` : ""
      } up -d --wait traefik`
      break
  }

  execSync(start_command, { stdio: "inherit" })
}
