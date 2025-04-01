#!/usr/bin/env node

import { Command } from "commander"
import { readFileSync, existsSync, writeFileSync } from "fs"
import path from "path"
import process from "process"

import init from "#commands/init"
import start from "#commands/start"
import stop from "#commands/stop"
import help from "#commands/help"

const package_json = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8"))
const { version } = package_json

process.on("SIGINT", () => {
  console.log("Process interrupted. Exiting...")
  shutdown()
})

process.on("SIGTERM", () => {
  console.log("Process terminated. Exiting...")
  shutdown()
})

const current_directory = process.cwd()

const program = new Command()

const env_path = path.join(current_directory, ".env")
const config_path = path.join(current_directory, ".hims.env")

const env = existsSync(env_path)
  ? new Map(
      readFileSync(env_path, "utf-8")
        .split("\n")
        .filter(line => line.trim() && line.includes("="))
        .map(line => line.split("="))
    )
  : new Map()

const config = existsSync(config_path)
  ? new Map(
      readFileSync(config_path, "utf-8")
        .split("\n")
        .filter(line => line.trim() && line.includes("="))
        .map(line => line.split("="))
    )
  : new Map()

program.name("hims").description("Himmelforce Management System CLI tool").version(version)

program
  .command("init")
  .description("Initialize a new project")
  .option("-d, --default", "Default configuration")
  .action(async options => {
    await init(options)
  })

program
  .command("up")
  .description("Start the project")
  .action(async options => {
    await start(options, config)
  })

program
  .command("help")
  .description("Help command")
  .action(async options => {
    await help()
  })

program
  .command("down")
  .description("Stop the project")
  .action(async () => {
    await stop()
  })

program
  .command("restart")
  .description("Restart the project")
  .action(async () => {
    await stop()
    await start({}, config)
  })

program
  .command("config")
  .description("Manage the project configuration")
  .addCommand(
    new Command("set")
      .description("Set a project configuration value")
      .argument("<key>", "Key to set")
      .argument("<value>", "Value to set")
      .action((key, value) => {
        config.set(key.toUpperCase(), value)
        const updatedConfig = [...config].reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, {})
        writeFileSync(
          config_path,
          Object.entries(updatedConfig)
            .map(([key, value]) => `${key}=${value}`)
            .join("\n")
        )
        console.log(`Configuration updated: ${key}=${value}`)
      })
  )
  .addCommand(
    new Command("get")
      .description("Get a project configuration value")
      .argument("<key>", "Key to get")
      .action(key => {
        console.log(config.get(key.toUpperCase()))
      })
  )

program
  .command("env")
  .description("Manage the project environment")
  .addCommand(
    new Command("show").description("Show the project environment").action(() => {
      console.log(env)
    })
  )
  .addCommand(
    new Command("set")
      .description("Set a project environment value")
      .argument("<key>", "Key to set")
      .argument("<value>", "Value to set")
      .action((key, value) => {
        env.set(key.toUpperCase(), value)
        const updatedEnv = [...env].reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, {})
        writeFileSync(
          env_path,
          Object.entries(updatedEnv)
            .map(([key, value]) => `${key}=${value}`)
            .join("\n")
        )
        console.log(`Environment updated: ${key}=${value}`)
      })
  )
  .addCommand(
    new Command("get")
      .description("Get a project environment value")
      .argument("<key>", "Key to get")
      .action(key => {
        console.log(env.get(key.toUpperCase()))
      })
  )

program.parse(process.argv)
