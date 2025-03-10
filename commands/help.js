import colorize from "#lib/colorize"

export default async () => {
  console.log("\n" + colorize("Help for the HiMS development version setup!", "green") + "\n")

  console.log(colorize("Available Commands:", "yellow") + "\n")

  console.log(colorize("init", "blue") + " - Initialize a new project.")
  console.log("    Options: " + colorize("-d, --default", "magenta") + "  Use default configuration.\n")

  console.log(colorize("up", "blue") + " - Start the project.")
  console.log("    Checks that Docker is running and that the .hims.env file exists in the project directory.\n")

  console.log(colorize("down", "blue") + " - Stop the project.\n")

  console.log(colorize("restart", "blue") + " - Restart the project (stops and then starts the services).\n")

  console.log(colorize("config", "blue") + " - Manage project configuration.")
  console.log("    Subcommands:")
  console.log("      " + colorize("config set <key> <value>", "magenta") + " - Set a configuration variable.")
  console.log("      " + colorize("config get <key>", "magenta") + " - Get the value of a configuration variable.\n")

  console.log(colorize("env", "blue") + " - Manage the project environment.")
  console.log("    Subcommands:")
  console.log("      " + colorize("env show", "magenta") + " - Display all environment variables.")
  console.log("      " + colorize("env set <key> <value>", "magenta") + " - Set an environment variable.")
  console.log(
    "      " + colorize("env get <key>", "magenta") + " - Retrieve the value of a specific environment variable.\n"
  )

  console.log(colorize("help", "blue") + " - Show this help message.\n")

  console.log(colorize("Usage Examples:", "yellow"))
  console.log(colorize("  hims init --default", "cyan") + "         // Initialize a project with default configuration")
  console.log(colorize("  hims up", "cyan") + "                     // Start the project")
  console.log(colorize("  hims config set API_PORT 3000", "cyan") + "  // Set a configuration variable")
  console.log(colorize("  hims env get NODE_ENV", "cyan") + "         // Get an environment variable\n")
}
