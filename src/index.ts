import { readConfig, setUser } from "./config";
function main() {
  setUser("Daniel");
  const cfg = readConfig();
  console.log(cfg);
}

main();
