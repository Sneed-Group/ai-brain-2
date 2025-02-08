// Import the libraries
import { Ollama } from 'ollama'
import fs from 'fs'
import path from 'path'

var ollama
export class ConsciousnessSimulator {

  constructor() {
    this.emotions = ['😊', '😢', '😐', '🤩', '😡', '😱'];
    this.currentEmotion = "happy";
    // Initialize other properties with "Unknown"
    this.opinions = {
      computers: "Unknown"
    };
    this.quantumStates = [];
    this.perception = {
      currentSensoryInput: null,
      sensoryProcessors: ['visual', 'auditory', 'tactile']
    };
    this.intent = {
      currentGoal: "Unknown goal",
      focus: "Unknown focus"
    };
    this.memoryLog = [];
    this.isUserActive = true;
  }

  createOllamaValue(url) {
    const finalURL = url || 'http://127.0.0.1:11434'
    ollama = new Ollama({ host: finalURL})
    return ollama
  }

  async redefineOpinions(newValues) {
    for (const key in this.opinions) {
      if (this.opinions.hasOwnProperty(key) && newValues[key]) {
        this.opinions[key] = newValues[key];
      }
    }
    this.logAIContextMemory()
    await this.updateEmotion()
  }

  async redefineSpecificOpinion(opinionKey, newValue) {
    if (this.opinions.hasOwnProperty(opinionKey)) {
      this.opinions[opinionKey] = newValue;
    } else {
      console.log(`Opinion key "${opinionKey}" not found.`);
    }
    this.logAIContextMemory()
    await this.updateEmotion()
  }

  resetOpinions() {
    this.opinions = {
      computers: "Unknown"
    }
  }

  // Method to generate opinions using Ollama
  async automaticRedefineOpinion(targetOpinionKey, newAbout) {

    try {
      const response = await ollama.chat({
        model: 'llama3.2',
        messages: [{ role: 'assistant', content: ` Generate an opinion about ${newAbout}.
        Show only the opinion, according to AI MEMORY CONTEXT.

          AI MEMORY CONTEXT ARRAY:
          ${JSON.stringify(this.memoryLog)}` }]
      });
      redefineSpecificOpinion(targetOpinion, response.message.content)
      return response.message.content
    } catch (error) {
      console.error("Error generating thought:", error);
      return "Error generating thought.";
    }
  }

  // Function to load the array from a text file
  loadArrayFromFile(filename) {
    // Read the file synchronously
    const data = fs.readFileSync(filename, 'utf8');

    // Split the data by newline and return as an array
    return data.split('\n').map(item => item.trim()); // `.map(item => item.trim())` to remove any extra spaces
  }

  // Method to generate thoughts using Ollama
  async generateThought(prompt) {
    try {
      const response = await ollama.chat({
        model: 'llama3.2',
        messages: [{ role: 'assistant', content: ` Generate a thought about the "PROMPT."
        Show only the thought, according to AI MEMORY CONTEXT.
        PROMPT: ${prompt}
          
          AI MEMORY CONTEXT ARRAY:
          ${JSON.stringify(this.memoryLog)}` }]
      });
      this.logMemory('THOUGHT', `${response.message.content}`);
      this.logAIContextMemory()
      await this.updateEmotion()
      return response.message.content;
    } catch (error) {
      console.error("Error generating thought:", error);
      return "Error generating thought.";
    }
  }

  async generateThoughtAndChat(prompt) {
    try {
      const response = await ollama.chat({
        model: 'rns96/deepseek-R1-ablated:f16_q40',
        messages: [{ role: 'user', content: `Talk about/answer to the "PROMPT" using the "AI MEMORY CONTEXT."
        
        PROMPT: ${prompt}
          
          AI MEMORY CONTEXT ARRAY:
          ${JSON.stringify(this.memoryLog)}` }]
      });

      this.logMemory('CHAT', `USER: ${prompt}
      AI: ${response.message.content}`);
      this.logAIContextMemory()
      await this.updateEmotion()
      return `USER: ${prompt}
      AI: ${response.message.content}`;
    } catch (error) {
      console.error("Error generating thought:", error);
      return "Error generating thought.";
    }
  }

  // Method to generate a new goal using Ollama
  async generateGoal() {
    const response = await this.generateThought("Generate a new goal to achieve. Show only a sentence describing the goal.");
    return response;
  }

  // Method to generate a new focus using Ollama
  async generateFocus() {
    const response = await this.generateThought("Generate a new focus/idea/thought/answer for your current goal. Show only a sentence describing the focus/idea/thought/answer.");
    return response;
  }

  // Get a random emotion
  randEmotions = ['happy', 'sad', 'neutral', 'excited', 'angry', 'scared'];
  //getRandomEmotion() {
    //const index = Math.floor(Math.random() * this.randEmotions.length);
    //return this.randEmotions[index];
  //}

  getLastWordLowerCase(str) {
    // Split the string by spaces, trim any extra spaces, and get the last word
    const words = str.trim().split(/\s+/);
    const lastWord = words[words.length - 1];
    return lastWord.toLowerCase();
  }

  // Method to generate emotions using Ollama
  async updateEmotion() {
    try {
      let emotion = await ollama.chat({
        model: 'llama3.2',
        messages: [{ role: 'assistant', content: `
          PROMPT: pick an emotion according to the memory context.
            *NOTE: ONLY display the emotion name, NO QUOTES, feel free to add an emoji - but besides that, no symbols. If there is nothing in AI MEMORY CONTEXT, default to happy.*

          AI MEMORY CONTEXT ARRAY:
          ${JSON.stringify(this.memoryLog)}` }]
      });
      emotion = emotion.message.content.toLowerCase()
      this.currentEmotion = emotion
      this.logAIContextMemory()
      return emotion
    } catch {
      return "happy"
    }
  }

  // Quantum state representation (0 to 1)
  getQuantumState() {
    return parseFloat(Math.random().toFixed(2));
  }

  // Perception processing
  processPerception(input) {
    this.perception.currentSensoryInput = input;
    console.log(`Current perception: ${input}`);
  }

  // Intentionality and goal setting
  async updateIntentions() {
    this.intent.currentGoal = await this.generateGoal();
    this.intent.focus = await this.generateFocus();
    console.log(`Generated goal: ${this.intent.currentGoal}`);
    console.log(`Generated focus: ${this.intent.focus}`);
  }

  logAIContextMemory() {
    this.logMemory('AI CONTEXT', `Current emotion: ${this.currentEmotion},
      Current Opinions: ${JSON.stringify(this.opinions)},
      Quantum state: ${this.getQuantumState()}`);
  }

  // Memory logging with USA Format timestamps
  logMemory(entryType, content) {
    const timestamp = new Date().toLocaleString('en-US', { timeStyle: 'short' });
    this.memoryLog.push({ timestamp, type: entryType, content });
    // Save to file if needed
    this.saveMemoryLog();
  }

  // Continuity check and load from log
  loadMemory() {
    try {
      this.memoryLog = this.loadArrayFromFile("consciousness.log")
      return this.memoryLog;
    } catch {
      return this.memoryLog;
    }
  }

    // Helper method for emotions array access
  getRandomIndex() {
      return Math.floor(Math.random() * this.emotions.length);
  }

  // Dreaming functionality when inactive for 15 minutes
  startDreaming() {
    const dreamingInterval = setInterval(async () => {
      if (!this.isUserActive) {
        let dream = generateThought("a dream")
        this.logMemory('DREAM', `${dream}`);
        this.logMemory('AI CONTEXT', `Current emotion: ${this.currentEmotion}, Quantum state: ${this.getQuantumState()}`);
      }
    }, 900000); // every 15 minutes

    // Stop the interval when user resumes interaction
    this.dreamingInterval = dreamingInterval;
  }

  // Toggle user activity status
  setUserActive(active) {
    this.isUserActive = active;
    if (!active && !this.dreamingInterval) {
      this.startDreaming();
    } else if (active) {
      clearInterval(this.dreamingInterval);
      this.dreamingInterval = null;
    }
  }

  // Save memory log to file
  saveMemoryLog() {
    const __dirname = import.meta.dirname;
    const logPath = path.join(__dirname, 'consciousness.log');
    fs.appendFile(logPath, JSON.stringify(this.memoryLog) + '\n', (err) => {
      if (err) throw err;
    });
  }



  // Method to simulate consciousness
  async simulateConsciousness(prompt) {
    console.log(`Current emotion: ${this.currentEmotion}`);
    console.log(`Current opinions: ${JSON.stringify(this.opinions)}`);
    const thought = await this.generateThought(
      prompt || "Generate a thought."
    );
    console.log("Generated thought:", thought);
    const quantumState = this.getQuantumState();
    console.log("Quantum state:", quantumState);

    // Log memory
    this.logMemory('thought', thought);
    this.logMemory('emotion', this.currentEmotion);
    this.logMemory('quantum state', quantumState);

    // Generate new goal and focus
    await this.updateIntentions();
  }
}