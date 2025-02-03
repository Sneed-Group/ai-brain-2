// Import the libraries
import { Ollama } from 'ollama'
import fs from 'fs'
import path from 'path'

const ollama = new Ollama({ host: 'https://ollama-api.nodemixaholic.com' })

export class ConsciousnessSimulator {
  constructor() {
    this.emotions = ['😊', '😢', '😐', '🤩', '😡', '😱'];
    this.currentEmotion = "happy";
    // Initialize other properties with "Unknown"
    this.opinions = {
      coding: "I love coding, especially JavaScript and Node.js.",
      writing: "Writing is my passion; I enjoy creating blog posts and READMEs.",
      linux: "Linux is great for those who want to get their hands dirty with techy goodness!",
      macOS: "macOS is great for those who want to get a simple, easy-to-use experience!",
      windows: "Windows is only good for gaming - and linux is getting better every day."
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
        model: 'sparksammy/tinysam-l3.2',
        messages: [{ role: 'assistant', content: `PROMPT: ${prompt}
          
          AI MEMORY CONTEXT ARRAY:
          ${this.memoryLog}` }]
      });
      return response.message.content;
    } catch (error) {
      console.error("Error generating thought:", error);
      return "Error generating thought.";
    }
  }

  async generateThoughtAndChat(prompt) {
    try {
      const response = await ollama.chat({
        model: 'sparksammy/tinysam-l3.2',
        messages: [{ role: 'user', content: `PROMPT: ${prompt}
          
          AI MEMORY CONTEXT ARRAY:
          ${this.memoryLog}` }]
      });
      return `USER: ${prompt}
      AI: ${response.message.content}`;
    } catch (error) {
      console.error("Error generating thought:", error);
      return "Error generating thought.";
    }
  }

  // Method to generate a new goal using Ollama
  async generateGoal() {
    const response = await this.generateThought("Generate a new goal.");
    return response;
  }

  // Method to generate a new focus using Ollama
  async generateFocus() {
    const response = await this.generateThought("Generate a new focus.");
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
      const emotion = await ollama.chat({
        model: 'sparksammy/tinysam-l3.2',
        messages: [{ role: 'assistant', content: `
          PROMPT: pick an emotion from the following array according to the memory context.
            *NOTE: ONLY display the emotion name AS STATED in the array, NO QUOTES, NO EXTRA wording emoji or symbols. If there is nothing in AI MEMORY CONTEXT, default to happy.*
      
            Emotion array: ${this.randEmotions}

          AI MEMORY CONTEXT ARRAY:
          ${this.memoryLog}` }]
      });
      console.log(`**EMOTION DEBUG** - ${this.getLastWordLowerCase(emotion.message.content)}`)
      this.randEmotions.indexOf(this.emotion) //check if defined
      return this.getLastWordLowerCase(emotion.message.content)
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
        console.log("I'm dreaming a bit... 😴");
        this.logMemory('AI CONTEXT', `Current emotion: ${this.currentEmotion} ${this.emotions[randEmotions.indexOf(this.currentEmotion)]}, Quantum state: ${this.getQuantumState()}`);
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
    console.log(`Current emotion: ${this.currentEmotion} ${this.emotions[this.randEmotions.indexOf(this.currentEmotion)]}`);
    console.log(`Current opinion on coding: ${this.opinions.coding}`);
    console.log(`Current opinion on writing: ${this.opinions.writing}`);
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