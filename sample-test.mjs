import { ConsciousnessSimulator } from './brainapi.mjs'

async function main() {
    const simulator = new ConsciousnessSimulator();
    await simulator.createOllamaValue(); //init ollama @ baked-in localhost/default port

    await simulator.simulateConsciousness();

    // Simulate consciousness
    simulator.simulateConsciousness();

    // Update the goal and focus
    await simulator.updateIntentions();

    //Simulate self-consciousness
    simulator.simulateConsciousness();


    // Example of user interaction (dream/wake functions)
    setTimeout(() => {
      simulator.setUserActive(false); // Simulate inactivity (dreaming) after 10 seconds
    }, 10000);
  
    setTimeout(() => {
      simulator.setUserActive(true); // Simulate activity resumption (awakeness) after 20 seconds
    }, 20000);

    simulator.generateThought("The dream you just had") // generate a thought about the dream we just had

    simulator.generateThoughtAndChat("How was the dream?") // user asks how was the dream
  }

main().catch(console.error);