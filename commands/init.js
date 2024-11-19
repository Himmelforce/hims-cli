import process from "process"
import crypto from "crypto"
import fs from "fs"

import input from "#lib/input"

const current_directory = process.cwd()

export default async options => {
  const config = {}

  if (options.default) {
    config.project_name = options.project_name || "Simple HiMS App"
    config.project_description = "A simple HiMS app created with the HiMS CLI"
    config.environment = "development"
    config.admin_initialisation_username = "hims"
    config.admin_initialisation_password = "hims"
    config.secret_user_key = crypto.randomBytes(32).toString("hex")
    config.secret_admin_key = crypto.randomBytes(32).toString("hex")
    config.mongo_username = "hims"
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
    config.admin_initialisation_username = await input("Admin initialisation username", "hims")
    config.admin_initialisation_password = await input("Admin initialisation password", "hims")
    config.secret_user_key = crypto.randomBytes(32).toString("hex")
    config.secret_admin_key = crypto.randomBytes(32).toString("hex")
    config.mongo_username = await input("MongoDB username", "hims")
    config.mongo_password = crypto.randomBytes(12).toString("hex")
    config.mongo_database = await input("MongoDB database", "hims")
    config.redis_password = crypto.randomBytes(12).toString("hex")
    config.encryption_key = crypto.randomBytes(32).toString("hex")
    config.security_mode = await input("Security mode", "insecure")
    config.host = await input("Host", "localhost")
    config.admin_path = await input("Admin path", "admin")
  }

  fs.writeFileSync(
    `${current_directory}/.hims.env`,
    Object.entries(config)
      .map(([key, value]) => `${key.toUpperCase()}=${value}`)
      .join("\n")
  )
}
