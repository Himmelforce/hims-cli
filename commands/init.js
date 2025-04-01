import process from "process"
import crypto from "crypto"
import fs from "fs"
import input from "#lib/input"
import colorize from "#lib/colorize"

const current_directory = process.cwd()

export default async options => {
  console.log(
    colorize(
      "Welcome to hims initialization script, if u want to create a default config run script with flag --default",
      "cyan"
    )
  )

  const config = {}

  if (!options.default) {
    const default_configuration = await input(
      colorize("Do you want to create a default configuration? (y/N): ", "blue"),
      "n"
    )
    if (["yes", "y"].includes(default_configuration.trim().toLowerCase())) options.default = true
    else options.default = false
  }

  if (options.default) {
    config.project_name = options.project_name || "Simple HiMS App"
    config.project_description = "A simple HiMS app created with the HiMS CLI"
    config.environment = "development"
    config.admin_initialisation_username = "hims"
    config.admin_initialisation_password = "hims"
    config.secret_user_key = crypto.randomBytes(32).toString("hex")
    config.secret_admin_key = crypto.randomBytes(32).toString("hex")
    config.mongo_username = "root"
    config.mongo_password = crypto.randomBytes(12).toString("hex")
    config.mongo_database = "hims"
    config.redis_password = crypto.randomBytes(12).toString("hex")
    config.encryption_key = crypto.randomBytes(32).toString("hex")
    config.security_mode = "insecure"
    config.host = "localhost"
    config.admin_path = "admin"
  } else {
    config.project_name = await input("Project name", "Simple HiMS App")
    config.project_description = await input("Project description", "A simple HiMS app created with the HiMS CLI")
    config.environment = await input("Environment", "development")
    config.admin_initialisation_username = await input("Admin initialisation username")
    config.admin_initialisation_password = await input("Admin initialisation password")
    config.secret_user_key = crypto.randomBytes(32).toString("hex")
    config.secret_admin_key = crypto.randomBytes(32).toString("hex")
    config.mongo_username = await input("MongoDB username", "root")
    config.mongo_password = crypto.randomBytes(12).toString("hex")
    config.mongo_database = await input("MongoDB database", "hims")
    config.redis_password = crypto.randomBytes(12).toString("hex")
    config.encryption_key = crypto.randomBytes(32).toString("hex")
    config.security_mode = await input("Security mode", "insecure")
    config.host = await input("Host", "localhost")
    config.admin_path = await input("Admin path", "admin")
    config.docker_compose_development_path = await input(
      "Docker compose development path (comma separated, leave empty for default)",
      ""
    )
    config.docker_compose_production_path = await input(
      "Docker compose production path (comma separated, leave empty for default)",
      ""
    )
  }

  const configPath = `${current_directory}/.hims.env`

  if (fs.existsSync(configPath)) {
    console.log(colorize("Configuration file already exists!", "red"))
    const overwrite = await input(colorize("Do you want to overwrite the configuration? (y/No): ", "blue"))
    if (!["yes", "y"].includes(overwrite.trim().toLowerCase())) {
      console.log("Exiting without changes.")
      return
    }
  }

  fs.writeFileSync(
    configPath,
    Object.entries(config)
      .map(([key, value]) => `${key.toUpperCase()}=${value}`)
      .join("\n")
  )

  console.log("Configuration saved successfully.\nHappy coding!\n")
}
