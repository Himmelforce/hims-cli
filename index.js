#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const process = require("process")

const directory = process.cwd()

process.on("SIGINT", () => {
  console.log("Process interrupted. Exiting...")
  shutdown()
})

process.on("SIGTERM", () => {
  console.log("Process terminated. Exiting...")
  shutdown()
})

process.on("uncaughtException", err => {
  console.error("Uncaught Exception:", err)
  process.exit(1)
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
  process.exit(1)
})

const commands = {
  init: require("./scripts/init"),
  start: require("./scripts/start"),
  stop: require("./scripts/stop"),
  help: require("./scripts/help"),
  purge: require("./scripts/purge"),
  test: require("./scripts/test")
}

const close = require(`./lib/input`).close

const args = process.argv.slice(2)

const flags = {}

args.filter(arg => {
  if (arg.startsWith("-")) {
    const [flag, value] = arg.split("=")
    flags[flag.replace(/^--/, "")] = value || true
    return false
  }
  return true
})

const check_docker = async () => {
  try {
    await require("child_process").execSync("docker -v", { stdio: "ignore" })
  } catch (error) {
    console.error("Docker is required to run this script.")
    process.exit(1)
  }
}

const main = async () => {
  check_docker()

  const hims_env = new Map()
  const hims_env_path = path.resolve(directory, ".hims.env")

  if (fs.existsSync(hims_env_path)) {
    const env_file = fs.readFileSync(hims_env_path, "utf8")
    env_file.split("\n").forEach(line => {
      const [key, value] = line.split("=")
      if (key && value) {
        hims_env.set(key, value)
      }
    })
  }

  const env = new Map()
  const env_path = path.resolve(directory, ".env")

  if (fs.existsSync(env_path)) {
    const env_file = fs.readFileSync(env_path, "utf8")
    env_file.split("\n").forEach(line => {
      const [key, value] = line.split("=")
      if (key && value) {
        env.set(key, value)
      }
    })
  }

  try {
    switch (args[0]) {
      case "init":
        await commands.init(flags)
        break
      case "start":
        await commands.start(flags, hims_env)
        break
      case "stop":
        await commands.stop(flags)
        break
      case "help":
        await commands.help(flags)
        break
      case "--help":
        await commands.help(flags)
      case "-h":
        await commands.help(flags)
        break
      case "purge":
        await commands.purge(flags)
        break
      case "test":
        await commands.test(flags)
        break
      case "set_config":
        hims_env.set(args[1], args[2])
        fs.writeFileSync(
          hims_env_path,
          Array.from(hims_env)
            .map(([key, value]) => `${key}=${value}`)
            .join("\n")
        )
        break
      case "get_env":
        console.log(env.get(args[1]))
        break
      case undefined:
        console.log("No command provided!")
        break
      default:
        console.log(`Unknown command: ${args[0]}`)
        break
    }
  } catch (error) {
    console.error(error)
  } finally {
    await shutdown()
  }
}

const shutdown = async () => {
  close()
  process.exit(0)
}

main()
