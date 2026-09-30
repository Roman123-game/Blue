const readline = require("readline");
const { execSync } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  try {
    const lastThree = await ask("IP last digits: ");
    const port = await ask("Port: ");
    const code = await ask("Pairing code: ");

    const ip = `192.168.1.${lastThree}`;

    console.log(`\nPairing ${ip}:${port}...`);

    execSync(`adb pair ${ip}:${port}`, {
      input: `${code}\n`,
      stdio: ["pipe", "inherit", "inherit"],
    });

    console.log(`\nConnecting ${ip}:${port}...`);

    execSync(`adb connect ${ip}:${port}`, {
      stdio: "inherit",
    });

    console.log("\nDevices:");

    execSync("adb devices", {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("\nFailed:", error.message);
  } finally {
    rl.close();
  }
}

main();