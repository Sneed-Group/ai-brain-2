import { ConsciousnessSimulator } from './brain.mjs'

async function main() {
    const simulator = new ConsciousnessSimulator();
    await simulator.simulateConsciousness();

    // Simulate consciousness
    simulator.simulateConsciousness();

    // Update the goal and focus
    await simulator.updateIntentions("Explore new AI possibilities", "Experimenting with emotions");
    simulator.simulateConsciousness();

    // Change the emotion
   
    simulator.simulateConsciousness();

    // Example of user interaction
    setTimeout(() => {
      simulator.setUserActive(false); // Simulate inactivity after 10 seconds
    }, 10000);
  
    setTimeout(() => {
      simulator.setUserActive(true); // Simulate activity resumption after 20 seconds
    }, 20000);
  }

main().catch(console.error);