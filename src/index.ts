import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import {
  handlerListUsers,
  handlerLogin,
  handlerRegister,
} from "./commands/users";
import { handlerReset } from "./commands/reset";
import { handlerAgg } from "./commands/aggregate";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import {
  handlerFollow,
  handlerListFeedFollows,
  handlerUnfollow,
} from "./commands/feed-follows";
import { middlewareLoggedIn } from "./middleware";
import { handlerBrowse } from "./commands/browse";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerReset);
  registerCommand(commandsRegistry, "users", handlerListUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(
    commandsRegistry,
    "addfeed",
    middlewareLoggedIn(handlerAddFeed)
  );
  registerCommand(commandsRegistry, "feeds", handlerListFeeds);
  registerCommand(
    commandsRegistry,
    "follow",
    middlewareLoggedIn(handlerFollow)
  );
  registerCommand(
    commandsRegistry,
    "following",
    middlewareLoggedIn(handlerListFeedFollows)
  );
  registerCommand(
    commandsRegistry,
    "unfollow",
    middlewareLoggedIn(handlerUnfollow)
  );
  registerCommand(
    commandsRegistry,
    "browse",
    middlewareLoggedIn(handlerBrowse)
  );

  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
