import { readConfig, setUser } from "../config";
import { createUser, getUser, getUsers } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];

  const verifyUser = await getUser(userName);

  if (!verifyUser) {
    throw new Error(`User ${userName} not found`);
  } else {
    setUser(userName);
    console.log("User switched successfully!");
  }
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length != 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const user = await createUser(userName);
  if (!user) {
    throw new Error(`User ${userName} not found`);
  }

  setUser(user.name);
  console.log("User created successfully!");
}

export async function handlerListUsers(_: string) {
  const users = await getUsers();
  const config = readConfig();

  for (let user of users) {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
}
