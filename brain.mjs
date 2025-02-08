import { ConsciousnessSimulator } from './brainapi.mjs';
import readline from 'readline';

class ConsciousnessApp {
  constructor() {
    this.simulator = new ConsciousnessSimulator();
    this.ollama = this.simulator.createOllamaValue("https://ollama-api.nodemixaholic.com"); // init ollama @ baked-in localhost/default port
    this.isActive = true; // User starts active
    this.lastActiveTime = Date.now();
    this.dreamTimeout = null;
    this.activityTimeout = null;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.asking = false; // Track if a question is being asked
  }

  // Function to simulate user talking
  async userTalks(input) {
    const reply = await this.simulator.generateThoughtAndChat(input);
    console.log("<User>: " + input);
    console.log("<Bot>: " + reply);
  }

  async thinker() {
    while (true) {
        // Generate random interval between 7 and 15 minutes (in milliseconds)
        const intervalTime = Math.random() * (15 * 60 * 1000 - 7 * 60 * 1000) + 7 * 60 * 1000;

        // Wait for the random interval (non-blocking)
        await new Promise(resolve => setTimeout(resolve, intervalTime));

        await this.simulator.simulateConsciousness();
    }
  }

  // Helper function for asking questions
  async asker() {
      this.rl.question('<Query>: ', async (query) => {
        if (query == "exit" || query == "quit") {
          console.log("Goodbye!")
          return rl.close()
        }
        await this.userTalks(query); // Call userTalks and resolve when done
        this.asker()
      });
  }

  async intentUpdater() {
    while (true) {
        // Generate random interval between 7 and 15 minutes (in milliseconds)
        const intervalTime = Math.random() * (15 * 60 * 1000 - 7 * 60 * 1000) + 7 * 60 * 1000;

        // Wait for the random interval (non-blocking)
        await new Promise(resolve => setTimeout(resolve, intervalTime));

        // 50% chance to execute the function
        if (Math.random() < 0.5) {
          await this.simulator.updateIntentions();
        }
    }
  }
}

async function main() {
  const minibrain = new ConsciousnessApp();
  
  // Run all asynchronous functions concurrently
  await Promise.all([
    minibrain.simulator.startDreaming(),
    minibrain.intentUpdater(),
    minibrain.thinker(),
    minibrain.asker()
  ]);
}

main().catch(e => console.error(e));
