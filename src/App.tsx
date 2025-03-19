import { useState, useEffect, useRef } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';

// Note: Make sure to add the following to your index.html:
// <script src="https://js.stripe.com/v3/"></script>

// Add Stripe to the Window interface
declare global {
  interface Window {
    Stripe?: any;
  }
}
import { Volume2, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  genres: string[];
  gradient: string;
  bubbleColor: string;
  content: string[][];
}

const LibraryPreview = () => {
  type ColorTheme = 'standard' | 'warm' | 'cool' | 'dark' | 'sepia';
  type ParticleDensity = 'none' | 'few' | 'normal' | 'many';
  type ParticleSize = 'small' | 'medium' | 'large';
  type AnimationSpeed = 'slow' | 'normal' | 'fast';
  type TextSize = 'small' | 'medium' | 'large' | 'xlarge';
  type VoiceOption = 'default' | 'female-1' | 'female-2' | 'female-3' | 'male-1';

  interface AppSettings {
    colorTheme: ColorTheme;
    particles: ParticleDensity;
    particleSize: ParticleSize;
    animationSpeed: AnimationSpeed;
    textSize: TextSize;
    voiceSpeed: number;
    voice: VoiceOption;
  }

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [narratorMessage, setNarratorMessage] = useState<string>("");
  const [appSettings, setAppSettings] = useState<AppSettings>({
    colorTheme: 'standard',
    particles: 'normal',
    particleSize: 'large',
    animationSpeed: 'normal',
    textSize: 'large',
    voiceSpeed: 1.0,
    voice: 'default'
  });
  
  // Speech synthesis utility function
  const speakText = (text: string, rate: number = appSettings.voiceSpeed): Promise<void> => {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported in this browser");
      return Promise.reject(new Error("Speech synthesis not supported"));
    }
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      
      // Get available voices
      let voices = window.speechSynthesis.getVoices();
      
      // If voices array is empty, try again after a short delay
      if (voices.length === 0) {
        setTimeout(() => {
          voices = window.speechSynthesis.getVoices();
        }, 100);
      }
      
      // Set voice based on settings
      if (appSettings.voice !== 'default') {
        const voiceMap: Record<VoiceOption, string> = {
          'default': '',
          'female-1': 'Samantha',
          'female-2': 'Victoria', 
          'female-3': 'Allison',
          'male-1': 'Daniel'
        };
        
        const voiceName = voiceMap[appSettings.voice];
        const selectedVoice = voices.find(v => v.name.includes(voiceName));
        if (selectedVoice) utterance.voice = selectedVoice;
      } else {
        // Prefer female voices if no specific voice is set
        const femaleVoice = voices.find(v => 
          v.name.includes('female') || 
          v.name.includes('Female') || 
          v.name.includes('Samantha') || 
          v.name.includes('Victoria')
        );
        if (femaleVoice) utterance.voice = femaleVoice;
      }
      
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };
  
    interface ThemeStyles {
    background: string;
    text: string;
    headerText: string;
  }

// Get theme styles based on selected theme
  const getThemeStyles = (theme: ColorTheme): ThemeStyles => {
    switch (theme) {
      case 'warm':
        return {
          background: 'linear-gradient(135deg, #3a0000 0%, #260339 100%)',
          text: '#f8e3cb',
          headerText: '#ffb74d'
        };
      case 'cool':
        return {
          background: 'linear-gradient(135deg, #001a33 0%, #002b4d 100%)',
          text: '#e6f7ff',
          headerText: '#8ecdf7'
        };
      case 'dark':
        return {
          background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
          text: '#c0c0c0',
          headerText: '#d4d4d4'
        };
      case 'sepia':
        return {
          background: 'linear-gradient(135deg, #f5eedd 0%, #e8ddbd 100%)',
          text: '#5c4b36',
          headerText: '#8a6d3b'
        };
      default: // standard
        return {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          text: '#e0e0e0',
          headerText: '#ffc107'
        };
    }
  };
  
  const theme = getThemeStyles(appSettings.colorTheme);

  // Setting change is handled directly in each component
  
  // Enhanced book data with actual content
  const books: Book[] = [
    {
      id: 'needle-and-yarn',
      title: "The Love Story of a Needle and a Yarn",
      author: "Leola Sister Lee",
      description: "A heartwarming tale of love between crafting tools. Follow Needle and Yarn as they navigate challenges, form deep bonds, and create beautiful projects together.",
      coverUrl: "/api/placeholder/600/800",
      genres: ["Fantasy", "Love Story", "Adventure", "DIY"],
      gradient: 'linear-gradient(135deg, #4361EE 0%, #7209B7 100%)',
      bubbleColor: '#7B61FF',
      content: [
        // Acknowledgment
        [
          "Acknowledgment",
          "Thank you for the love, lessons, and laughter that have shaped this journey. To my six remarkable children—Freddie, Micky, Timothy, Leonard, Jermaine, and Laron—you are the vibrant threads woven into the fabric of my life. Each of you brings unique strength, love, and creativity, and I am endlessly proud of you.",
          "This story is also a tribute to the resilient, diverse community of Milwaukee, Wisconsin, whose warmth and spirit have enriched my craft. May this tale reflect my passion for crochet and the enduring power of love."
        ],
        // Chapter 1
        [
          "Chapter 1: A Tangled Beginning",
          "Leola's sewing basket was a world unto itself, a community of tools bound by years of craft. Among them was Needle, an experienced crochet hook with a polished silver body, and Yarn, a vibrant ball of orange cotton, eager yet tangled. Needle had seen many projects in his time, guided by skilled hands through intricate patterns, but Yarn was new, uncertain of her purpose. She was excited yet anxious, wondering where she fit in this well-worn basket of seasoned tools.",
          "Leola, a warm-hearted woman with decades of crochet experience, had found both at a craft swap—Needle, a well-loved relic, and Yarn, a messy tangle waiting to be smoothed. Placing them together in her basket, she unknowingly set their journey in motion. When Yarn first spoke, her voice was bright, full of energy. \"Oh, dear, I seem to have gotten myself into a bit of a… mess.\"",
          "Needle chuckled. \"Nothing I haven't seen before. Let's get you sorted.\" As he worked through her knots with patient expertise, a bond formed. The other tools—Scissors, Thimble, and Measuring Tape—watched with interest. \"Looks like you've met your match, old friend,\" Scissors quipped. And in a way, he had."
        ],
        // Chapter 2
        [
          "Chapter 2: The First Dance",
          "With Yarn untangled, she was eager to create. \"Needle, I want to make something beautiful!\" she declared. He smiled at her enthusiasm. \"A scarf, perhaps? Simple, yet elegant.\" Yarn agreed, and Needle guided her through the first stitches—slip knot, chain stitch, then single crochet. Each movement was new to Yarn, her fibers tightening with uncertainty before finally settling into the rhythm of the work.",
          "At first, Yarn fumbled, her tension too tight, then too loose. Needle reassured her. \"It's all about rhythm. Find the flow.\" As she practiced, the stitches grew more even. Scissors, usually sharp-tongued, offered encouragement. \"Not bad, kid. Keep at it.\" Thimble, ever wise, nodded approvingly. Slowly but surely, the scarf took shape, a blend of reds and oranges forming a soft, flowing pattern.",
          "The scarf grew, a soft cascade of colors reflecting Yarn's newfound confidence. As Yarn moved with more ease, she shared her dreams. \"I want to dance, to move freely, to express myself.\" Needle, listening intently, realized he wanted to be part of that journey. She was more than just another ball of cotton—she was vibrant, alive. And he was falling for her."
        ],
        // Chapter 3
        [
          "Chapter 3: A Hat of Hopes",
          "As autumn's chill settled in, Yarn shivered. \"I wish I had something to keep my top warm.\" Needle grinned. \"A hat, then. We'll use the half-double crochet stitch—sturdy and warm.\" It was a new challenge, one that required patience and practice. But Yarn had grown stronger, and with Needle's guidance, she embraced the task, determined to create something both useful and beautiful.",
          "Yarn hesitated. \"Isn't that difficult?\" Thimble chimed in. \"Leola once made hats for her grandchildren, each unique, filled with love. Yours will be, too.\" Encouraged, Yarn learned the new stitch, slowly building confidence. She and Needle worked late into the night, their connection deepening with each loop. She imagined wrapping the hat around herself, a symbol of warmth and perseverance.",
          "But as they neared the final rows, disaster struck—Needle snagged on a knot, and with a sharp snap, his tip chipped. The tools gasped. Yarn panicked. \"Needle! Are you alright?\" He winced. \"I've… had better days.\" Leola, sensing the trouble, picked him up gently. \"Don't you worry, little friend. We'll fix you right up.\" And with that, she carried him away."
        ],
        // Chapter 4
        [
          "Chapter 4: Mended and Magnificent",
          "Yarn felt lost without Needle. She tried to finish the hat on her own, but the stitches felt wrong, uneven. Thimble comforted her. \"Needle is strong. He'll be back.\" She wanted to believe it, but without him, her confidence wavered. The unfinished hat sat in the basket, a reminder of how much she depended on him.",
          "Finally, Leola returned, holding Needle, now repaired. He gleamed, his tip polished smooth. \"Needle!\" Yarn cried, wrapping around him in relief. \"You're back!\" The tools gathered around, relieved to have their friend home. Needle smiled at Yarn's embrace, feeling stronger than before. \"I'm better than ever,\" he reassured her.",
          "Buoyed by joy, Yarn twirled, the finished hat swirling with her. \"Let's create something even bigger!\" she declared. She had found not just her skill, but her voice, her purpose. The tools celebrated together, reveling in the warmth of their craft and the friendships they had built."
        ],
        // Chapter 5
        [
          "Chapter 5: A Blanket of Dreams",
          "Their next project was their most ambitious yet—a blanket. \"Each square will hold a piece of our journey,\" Needle said. Yarn imagined a patchwork of colors, stories woven together. She wanted to create something lasting, something that could embrace others in warmth and love. The task felt daunting, but Needle was there, guiding her every step of the way.",
          "At first, her stitches were uneven, her color changes messy. Frustrated, she cried, \"I can't do it!\" Needle's voice was gentle. \"Even the best creations have knots and flaws. It's not about perfection, it's about love.\" With renewed determination, Yarn persisted, learning to embrace the imperfections. Each square, though not flawless, carried the essence of her heart and soul.",
          "Square by square, the blanket grew. When it was finally complete, it was a masterpiece of color and warmth, a testament to patience, creativity, and love. As Yarn draped it over Leola's chair, she whispered to Needle, \"We did it.\" Needle smiled. \"Yes, we did. Together.\" And in that moment, they knew—they had found their perfect stitch."
        ],
        // Epilogue
        [
          "Epilogue: Woven Together",
          "The sewing basket was never just a collection of tools—it was a family. Yarn and Needle, once strangers, had become inseparable, their work intertwined in every loop and stitch. The hat kept Yarn warm, the scarf flowed with her every dance, and the blanket became a symbol of their shared journey.",
          "Leola smiled as she admired their work, her hands tracing the stitches. \"Every creation tells a story,\" she murmured. And indeed, this one did—a story of patience, perseverance, and love. The tools rested together, basking in the satisfaction of a job well done.",
          "As the sun set, casting a golden glow over Leola's home, Yarn nestled beside Needle. \"What's next?\" she asked. Needle chuckled. \"Whatever we dream, my dear Yarn. Whatever we dream.\""
        ]
      ]
    },
    {
      id: 'crochet-mastery',
      title: "Crochet Mastery: A Complete Guide",
      author: "Leola Sister Lee",
      description: "A comprehensive guide to mastering the art of crochet. From basic stitches to complex techniques, this guide has everything you need to become a crochet master.",
      coverUrl: "/api/placeholder/600/800",
      genres: ["DIY", "Instruction", "Crafts", "Reference"],
      gradient: 'linear-gradient(135deg, #F72585 0%, #B5179E 100%)',
      bubbleColor: '#F5515F',
      content: [
        // Acknowledgment
        [
          "Acknowledgment",
          "This guide is dedicated to the crafters, dreamers, and makers who find joy in the art of crochet. To my children—Freddie, Micky, Timothy, Leonard, Jermaine, and Laron—your love and inspiration have woven strength into my life, just like every carefully placed stitch.",
          "And to the community of Milwaukee, whose resilience and warmth mirror the essence of handmade creations, thank you for shaping my journey. May this guide serve as a roadmap to creativity, patience, and the joy of crafting with love."
        ],
        // Chapter 1
        [
          "Chapter 1: The Essentials of Crochet",
          "Before diving into projects, it's important to understand the basic tools and techniques that make up the foundation of crochet. Here's what you need to get started:",
          "Tools & Materials:\n- Crochet Hook (Needle): Choose an aluminum, plastic, or wooden hook based on personal preference. Hook sizes vary, but a 5mm (H-8) hook is a great beginner size.\n- Yarn: Cotton, acrylic, or wool, depending on the project. Worsted weight is a versatile choice.\n- Scissors: For cutting yarn cleanly.\n- Measuring Tape: Ensures your projects are the correct size.\n- Stitch Markers: Helps track stitches in complex patterns.\n- Thimble (Optional): Useful for hand-sewing and weaving in ends.",
          "Basic Techniques:\n1. Slip Knot: The foundation of every crochet project. Wrap yarn around two fingers, pull through a loop, and tighten around your hook.\n2. Chain Stitch (ch): Creates the starting base of most projects.\n3. Single Crochet (sc): Insert hook into stitch, yarn over, pull through, yarn over again, pull through both loops.\n4. Half Double Crochet (hdc): Yarn over, insert hook into stitch, yarn over, pull through, yarn over again, pull through all three loops.\n5. Double Crochet (dc): Yarn over, insert hook, yarn over, pull through, yarn over, pull through two loops, yarn over, pull through the last two loops."
        ],
        // Chapter 2
        [
          "Chapter 2: Creating a Cozy Scarf",
          "A scarf is a perfect beginner project that introduces fundamental crochet skills.",
          "Materials Needed:\n- Worsted weight yarn (2-3 skeins, any color)\n- 5mm (H-8) crochet hook\n- Scissors\n- Tapestry needle for weaving in ends",
          "Instructions:\n1. Create a Foundation Chain: Chain 30 (or more for a wider scarf).\n2. First Row: Work a single crochet (sc) into the second chain from the hook. Continue across.\n3. Next Rows: Chain 1 at the end of each row, turn, and single crochet across until the scarf reaches your desired length.\n4. Finishing Touches: Fasten off and weave in any loose ends."
        ],
        // Chapter 3
        [
          "Chapter 3: Crafting a Warm Hat",
          "A hat is slightly more advanced, introducing circular crochet and increases.",
          "Materials Needed:\n- Worsted weight yarn (1-2 skeins)\n- 5mm (H-8) crochet hook\n- Stitch marker\n- Scissors\n- Tapestry needle",
          "Instructions:\n1. Magic Ring: Create a loop with yarn, insert hook, and pull up a loop.\n2. Round 1: Chain 2 (counts as first hdc), work 9 half double crochets (hdc) into the ring. Slip stitch to join.\n3. Round 2: Chain 2, 2 hdc in each stitch around (18 stitches total).\n4. Increasing Rounds: Continue increasing in this pattern, adding one more hdc between each increase in each round, until the hat fits your head diameter.\n5. Work Even: Once the crown is the right size, work even hdc rounds until the hat reaches your desired length.\n6. Finishing: Fasten off, weave in ends, and add a decorative edge if desired."
        ],
        // Chapter 4
        [
          "Chapter 4: Making a Beautiful Blanket",
          "A granny square blanket is a versatile and customizable project that lets you combine different colors and stitch patterns.",
          "Materials Needed:\n- Various colors of worsted weight yarn\n- 5mm (H-8) crochet hook\n- Scissors\n- Tapestry needle",
          "Instructions:\n1. Create a Magic Ring: Chain 3 (counts as first double crochet), work 2 double crochets (dc) into the ring.\n2. Chain 2: This forms a corner. Work 3 dc, chain 2, repeat two more times.\n3. Close the Round: Slip stitch to join.\n4. Increase the Square: Continue working 3 dc in each space along the sides and 3 dc, chain 2, 3 dc in each corner. Change colors as desired.\n5. Join Squares: Use slip stitch, single crochet, or whip stitch to join squares together.\n6. Finishing: Weave in ends and add a border if desired."
        ],
        // Chapter 5
        [
          "Chapter 5: Assembling Your Masterpieces",
          "Once you've completed each project, it's time to assemble and refine your work.",
          "Final Touches:\n- Blocking: Lightly mist projects with water and pin them to a flat surface to set the shape.\n- Weaving in Ends: Use a tapestry needle to hide yarn tails securely.\n- Adding Embellishments: Pom-poms, tassels, or buttons can personalize your creations.",
          "Tips for Success:\n- Keep consistent tension for even stitches.\n- Practice stitches before starting a big project.\n- Don't be afraid to undo and redo stitches for a cleaner look."
        ],
        // Epilogue
        [
          "Epilogue: The Art of Crochet",
          "Crochet is more than just loops and stitches—it is a form of storytelling, an expression of love and creativity. Each project carries the essence of the maker, just as Needle and Yarn discovered in their journey together. Whether crafting for yourself or gifting to others, every creation holds warmth, care, and dedication.",
          "As you continue to refine your skills, remember that even the most skilled crocheters started with a single loop. Keep learning, keep creating, and most of all—enjoy the process. Happy crocheting!"
        ]
      ]
    }
  ];
  
  interface NarratorStatusProps {
    isActive: boolean;
    message: string;
  }

  // Narrator status indicator component
  const NarratorStatus = ({ isActive, message }: NarratorStatusProps) => {
    return (
      <div 
        className={`fixed bottom-4 left-4 px-4 py-2 rounded-lg text-white flex items-center z-50 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          background: isActive ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <span className="mr-2">
          {isActive ? '🔊' : '🔇'}
        </span>
        {message}
      </div>
    );
  };
  
interface Particle {
    id: number;
    emoji: string;
    x: number;
    y: number;
    xSpeed: number;
    ySpeed: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity?: number;
    fadeDirection?: 'in' | 'out';
    fadeSpeed?: number;
    type?: 'heart' | 'craft';
  }

  // Gentle floating particles with falling hearts and appearing/disappearing craft items
  const Particles = () => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const animationFrameRef = useRef<number | null>(null);
    
    useEffect(() => {
      // Determine number of particles based on settings
      let particleCount;
      switch (appSettings.particles) {
        case 'none': particleCount = 0; break;
        case 'few': particleCount = 8; break;
        case 'normal': particleCount = 15; break;
        case 'many': particleCount = 25; break;
        default: particleCount = 15;
      }
      
      // Only crochet-related tool emojis
      const heartEmojis = ['❤️', '💕', '💝', '💞']; 
      const craftEmojis = ['🧶', '🪡', '🧵', '✂️'];
      
      // Create initial particles
      const newParticles: Particle[] = [];
      
      // Create hearts that fall from top
      for (let i = 0; i < particleCount / 2; i++) {
        const emoji = heartEmojis[i % heartEmojis.length];
        newParticles.push({
          id: i,
          emoji,
          x: Math.random() * 100, // random x position (%)
          y: -10 - Math.random() * 30, // start above the viewport
          xSpeed: (Math.random() * 0.2 - 0.1) * 0.3, // very minimal horizontal drift
          ySpeed: 0.05 + Math.random() * 0.1, // slow falling speed
          size: 1 + Math.random(), // smaller size (1-2 rem)
          rotation: 0, // no rotation
          rotationSpeed: 0, // no rotation speed
          opacity: 0.8 + Math.random() * 0.2, // slightly varied opacity
          type: 'heart'
        });
      }
      
      // Create craft items that appear and disappear
      for (let i = particleCount / 2; i < particleCount; i++) {
        const emoji = craftEmojis[(i - particleCount / 2) % craftEmojis.length];
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        
        newParticles.push({
          id: i,
          emoji,
          x: randomX,
          y: randomY,
          xSpeed: 0, // static position
          ySpeed: 0, // static position
          size: 1.5 + Math.random() * 0.5, // size 1.5-2 rem
          rotation: 0, // no rotation
          rotationSpeed: 0,
          opacity: 0, // start invisible
          fadeDirection: 'in', // start fading in
          fadeSpeed: 0.005 + Math.random() * 0.01, // slow fade speed
          type: 'craft'
        });
      }
      
      setParticles(newParticles);
      
      // Animation speed based on settings - significantly slower than before
      let speedMultiplier;
      switch (appSettings.animationSpeed) {
        case 'slow': speedMultiplier = 0.3; break;
        case 'normal': speedMultiplier = 0.5; break;
        case 'fast': speedMultiplier = 0.7; break;
        default: speedMultiplier = 0.5;
      }
      
      // Animation loop for gentle floating movement
      const moveParticles = () => {
        setParticles(prevParticles => {
          return prevParticles.map(particle => {
            // Handle different particle types
            if (particle.type === 'heart') {
              // Hearts fall gently
              let newY = particle.y + particle.ySpeed * speedMultiplier;
              let newX = particle.x + particle.xSpeed * speedMultiplier;
              
              // If heart falls below screen, reset to top
              if (newY > 105) {
                newY = -10 - Math.random() * 10;
                newX = Math.random() * 100;
              }
              
              // Keep hearts within horizontal bounds
              if (newX < 0) newX = 0;
              if (newX > 100) newX = 100;
              
              return {
                ...particle,
                x: newX,
                y: newY
              };
            } else {
              // Craft items fade in and out
              let newOpacity = particle.opacity || 0;
              let newFadeDirection = particle.fadeDirection || 'in';
              
              if (newFadeDirection === 'in') {
                newOpacity += (particle.fadeSpeed || 0.01) * speedMultiplier;
                if (newOpacity >= 1) {
                  newOpacity = 1;
                  newFadeDirection = 'out';
                }
              } else {
                newOpacity -= (particle.fadeSpeed || 0.01) * speedMultiplier;
                if (newOpacity <= 0) {
                  newOpacity = 0;
                  newFadeDirection = 'in';
                  // Reposition to a new random location when completely faded out
                  return {
                    ...particle,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    opacity: newOpacity,
                    fadeDirection: newFadeDirection
                  };
                }
              }
              
              return {
                ...particle,
                opacity: newOpacity,
                fadeDirection: newFadeDirection
              };
            }
          });
        });
        
        animationFrameRef.current = requestAnimationFrame(moveParticles);
      };
      
      animationFrameRef.current = requestAnimationFrame(moveParticles);
      
      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [appSettings.particles, appSettings.animationSpeed]);
    
    // Determine size based on settings
    let sizeMultiplier;
    switch (appSettings.particleSize) {
      case 'small': sizeMultiplier = 0.8; break;
      case 'medium': sizeMultiplier = 1.2; break;
      case 'large': sizeMultiplier = 1.8; break;
      default: sizeMultiplier = 1.2;
    }
    
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map(particle => (
          <div 
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size * sizeMultiplier}rem`,
              opacity: particle.opacity,
              transition: 'opacity 0.5s ease',
              filter: particle.type === 'heart' ? 'drop-shadow(0 0 3px rgba(255, 100, 100, 0.3))' : 'none'
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>
    );
  };

  // Settings Panel
  const SettingsPanel = () => {
    const [localSettings, setLocalSettings] = useState<AppSettings>({...appSettings});
    
    const handleSave = () => {
      setAppSettings(localSettings);
      setShowSettingsPanel(false);
    };
    
    if (!showSettingsPanel) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-blue-500/30 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-300">Library Settings</h2>
            <button 
              onClick={() => setShowSettingsPanel(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-8">
            {/* Color Theme */}
            <div>
              <h3 className="text-xl text-blue-200 mb-4">Color Theme</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {['standard', 'warm', 'cool', 'dark', 'sepia'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setLocalSettings({...localSettings, colorTheme: theme as ColorTheme})}
                    className={`p-4 rounded-lg transition-all ${
                      localSettings.colorTheme === theme ? 'ring-4 ring-blue-500' : ''
                    }`}
                    style={{
                      background: 
                        theme === 'standard' ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' :
                        theme === 'warm' ? 'linear-gradient(135deg, #3a0000 0%, #260339 100%)' :
                        theme === 'cool' ? 'linear-gradient(135deg, #001a33 0%, #002b4d 100%)' :
                        theme === 'dark' ? 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)' :
                        'linear-gradient(135deg, #f9f3e5 0%, #e8ddbd 100%)'
                    }}
                  >
                    <div className="h-8 flex items-center justify-center">
                      <span className={`font-medium ${theme === 'sepia' ? 'text-gray-800' : 'text-white'}`}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Text Size */}
            <div>
              <h3 className="text-xl text-blue-200 mb-4">Reading Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Text Size</label>
                  <select 
                    value={localSettings.textSize}
                    onChange={(e) => setLocalSettings({...localSettings, textSize: e.target.value as TextSize})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xlarge">Extra Large</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Reading Speed</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={localSettings.voiceSpeed}
                      onChange={(e) => setLocalSettings({...localSettings, voiceSpeed: parseFloat(e.target.value)})}
                      className="w-full mr-3"
                    />
                    <span className="text-white">{localSettings.voiceSpeed.toFixed(1)}x</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Voice Settings */}
            <div>
              <h3 className="text-xl text-blue-200 mb-4">Narration Voice</h3>
              <select 
                value={localSettings.voice}
                onChange={(e) => setLocalSettings({...localSettings, voice: e.target.value as VoiceOption})}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
              >
                <option value="default">System Default</option>
                <option value="female-1">Samantha (Female)</option>
                <option value="female-2">Victoria (Female)</option>
                <option value="female-3">Allison (Female)</option>
                <option value="male-1">Daniel (Male)</option>
              </select>
              <div className="mt-4 bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                <span className="text-blue-200">💡 Tip:</span> 
                <span className="text-gray-300"> The app will automatically prioritize female voices by default.</span>
              </div>
            </div>
            
            {/* Particles */}
            <div>
              <h3 className="text-xl text-blue-200 mb-4">Background Elements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Particle Density</label>
                  <select 
                    value={localSettings.particles}
                    onChange={(e) => setLocalSettings({...localSettings, particles: e.target.value as ParticleDensity})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  >
                    <option value="none">None</option>
                    <option value="few">Few</option>
                    <option value="normal">Normal</option>
                    <option value="many">Many</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Particle Size</label>
                  <select 
                    value={localSettings.particleSize}
                    onChange={(e) => setLocalSettings({...localSettings, particleSize: e.target.value as ParticleSize})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Animation Speed</label>
                  <select 
                    value={localSettings.animationSpeed}
                    onChange={(e) => setLocalSettings({...localSettings, animationSpeed: e.target.value as AnimationSpeed})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button 
              onClick={() => setShowSettingsPanel(false)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  interface BookReaderProps {
    book: Book;
    onClose: () => void;
  }
  
  // Enhanced Book reader modal with real speech synthesis
  const BookReader = ({ book, onClose }: BookReaderProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isReading, setIsReading] = useState(false);
    const [readerNarratorMessage, setReaderNarratorMessage] = useState("");
    const [showNarrationSettings, setShowNarrationSettings] = useState(false);
    
    const totalPages = book.content.length; // Total pages from our content
    
    // Text size based on settings
    const getTextSizeClass = () => {
      switch (appSettings.textSize) {
        case 'small': return 'text-base';
        case 'medium': return 'text-xl';
        case 'large': return 'text-2xl';
        case 'xlarge': return 'text-3xl';
        default: return 'text-xl';
      }
    };
    
    // Get theme styles for reader
    const readerTheme = (() => {
      switch (appSettings.colorTheme) {
        case 'warm':
          return {
            background: 'linear-gradient(135deg, #331c0c 0%, #38220f 100%)',
            text: '#ffebcc',
            headerText: '#ffb74d'
          };
        case 'cool':
          return {
            background: 'linear-gradient(135deg, #0a1929 0%, #102a43 100%)',
            text: '#d6f0ff',
            headerText: '#8ecdf7'
          };
        case 'dark':
          return {
            background: 'linear-gradient(135deg, #0d0d0d 0%, #141414 100%)',
            text: '#bcbcbc',
            headerText: '#d4d4d4'
          };
        case 'sepia':
          return {
            background: 'linear-gradient(135deg, #f7f1e3 0%, #efe5c4 100%)',
            text: '#5c4b36',
            headerText: '#8a6d3b'
          };
        default:
          return {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            text: '#ffffff',
            headerText: '#ffc107'
          };
      }
    })();
    
    // Function to read the current page aloud
    const readCurrentPage = async () => {
      if (!isReading) {
        setIsReading(true);
        setReaderNarratorMessage(`Reading with voice: ${appSettings.voice === 'default' ? 'System Default' : appSettings.voice}`);
        
        const pageContent = book.content[currentPage];
        // Skip the title/heading when reading
        const textToRead = pageContent.slice(1).join(' ');
        
        try {
          await speakText(textToRead, appSettings.voiceSpeed);
          
          // After reading is complete, either go to next page or stop reading
          if (currentPage < totalPages - 1) {
            goToNextPage();
          } else {
            setIsReading(false);
            setReaderNarratorMessage("");
          }
        } catch (error) {
          console.error("Error during speech synthesis:", error);
          setIsReading(false);
          setReaderNarratorMessage("");
        }
      } else {
        // Stop reading
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        setIsReading(false);
        setReaderNarratorMessage("");
      }
    };
    
    // Enhanced page navigation
    const goToNextPage = () => {
      if (currentPage < totalPages - 1) {
        setCurrentPage(prevPage => prevPage + 1);
        if (isReading) {
          // If we were reading, start reading the new page
          setTimeout(() => {
            readCurrentPage();
          }, 500); // Short delay to update UI first
        }
      }
    };
    
    const goToPrevPage = () => {
      if (currentPage > 0) {
        // If we're currently reading, stop first
        if (isReading && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          setIsReading(false);
          setReaderNarratorMessage("");
        }
        setCurrentPage(prevPage => prevPage - 1);
      }
    };
    
    // Clean up speech synthesis when component unmounts
    useEffect(() => {
      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
    }, []);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div
          className="w-full h-full max-h-screen flex flex-col relative overflow-hidden rounded-lg"
          style={{
            background: readerTheme.background
          }}
        >
          <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-lg flex items-center gap-2"
              >
                <X size={20} />
                Close
              </button>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: readerTheme.headerText }}>{book.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowNarrationSettings(!showNarrationSettings)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  Reading Settings
                </span>
              </button>
              <button
                onClick={readCurrentPage}
                className={`px-4 py-3 rounded-lg text-white font-bold flex items-center gap-2 ${isReading ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}
              >
                {isReading ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                    Stop Reading
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Start Reading
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Narration settings */}
          {showNarrationSettings && (
            <div className="bg-gray-800 p-6 border-b border-gray-700">
              <h3 className="text-2xl font-bold text-blue-300 mb-4">Reading Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl text-gray-300 mb-3">Display Theme</h4>
                    <div className="grid grid-cols-5 gap-3">
                      {(['standard', 'warm', 'cool', 'dark', 'sepia'] as const).map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setAppSettings({...appSettings, colorTheme: theme})}
                          className={`p-3 rounded-lg transition-all ${
                            appSettings.colorTheme === theme ? 'ring-4 ring-blue-500' : ''
                          }`}
                          style={{
                            background: 
                              theme === 'standard' ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' :
                              theme === 'warm' ? 'linear-gradient(135deg, #3a0000 0%, #260339 100%)' :
                              theme === 'cool' ? 'linear-gradient(135deg, #001a33 0%, #002b4d 100%)' :
                              theme === 'dark' ? 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)' :
                              'linear-gradient(135deg, #f9f3e5 0%, #e8ddbd 100%)'
                          }}
                        >
                          <div className="h-8 flex items-center justify-center">
                            <span className={`font-medium ${theme === 'sepia' ? 'text-gray-800' : 'text-white'}`}>
                              {theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                
                  <div>
                    <h4 className="text-xl text-gray-300 mb-3">Text Size</h4>
                    <div className="flex gap-3">
                      {(['small', 'medium', 'large', 'xlarge'] as const).map(size => (
                        <button
                          key={size}
                          onClick={() => setAppSettings({...appSettings, textSize: size})}
                          className={`px-4 py-3 rounded-lg flex-1 ${appSettings.textSize === size ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                        >
                          <span className={size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : size === 'large' ? 'text-lg' : 'text-xl'}>
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl text-gray-300 mb-3">Narration Voice</h4>
                    <select 
                      value={appSettings.voice}
                      onChange={(e) => setAppSettings({...appSettings, voice: e.target.value as VoiceOption})}
                      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg text-lg"
                    >
                      <option value="default">System Default</option>
                      <option value="female-1">Samantha (Female)</option>
                      <option value="female-2">Victoria (Female)</option>
                      <option value="female-3">Allison (Female)</option>
                      <option value="male-1">Daniel (Male)</option>
                    </select>
                  </div>
                
                  <div>
                    <h4 className="text-xl text-gray-300 mb-3">Reading Speed: {appSettings.voiceSpeed.toFixed(1)}x</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-white">0.5x</span>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={appSettings.voiceSpeed}
                        onChange={(e) => setAppSettings({...appSettings, voiceSpeed: parseFloat(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="text-white">2.0x</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-300 text-xl">💡</span>
                    <span className="text-gray-300">Settings are applied immediately and will be remembered for your next reading session.</span>
                  </div>
                </div>
                
                <div className="flex justify-end items-center">
                  <button 
                    onClick={() => setShowNarrationSettings(false)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Apply & Close Settings
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-grow overflow-hidden">
            <div className="flex items-center">
              <button 
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className="h-full px-6 bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center disabled:opacity-30"
              >
                <ChevronLeft size={36} />
              </button>
            </div>
            
            <div className="flex-grow overflow-auto p-8">
              <div className={`${getTextSizeClass()} leading-relaxed max-w-5xl mx-auto`} style={{ color: readerTheme.text }}>
                {book.content[currentPage] && book.content[currentPage].map((paragraph: string, index: number) => {
                  if (index === 0) {
                    return (
                      <h3 key={index} className="text-4xl mb-8 font-bold" style={{ color: readerTheme.headerText }}>
                        {paragraph}
                      </h3>
                    );
                  } else {
                    // Handle formatting for bullet points and numbered lists
                    if (paragraph.includes('\n')) {
                      const lines = paragraph.split('\n');
                      return (
                        <div key={index} className="mb-6">
                          {lines.map((line: string, lineIndex: number) => {
                            // Check if it's a bullet point or numbered list
                            if (line.match(/^[0-9]+\./)) {
                              // Numbered list
                              return (
                                <p key={lineIndex} className="ml-6 mb-3">
                                  {line}
                                </p>
                              );
                            } else if (line.match(/^-/)) {
                              // Bullet list
                              return (
                                <p key={lineIndex} className="ml-6 mb-3">
                                  {line}
                                </p>
                              );
                            } else {
                              // Regular paragraph
                              return <p key={lineIndex} className="mb-3">{line}</p>;
                            }
                          })}
                        </div>
                      );
                    } else {
                      return (
                        <p key={index} className="mb-6">
                          {paragraph}
                        </p>
                      );
                    }
                  }
                })}
                <div className="flex justify-center mt-8 mb-12">
                  <span className="px-4 py-2 rounded-lg bg-gray-700 bg-opacity-40 text-base"
                    style={{ color: readerTheme.headerText }}>
                    {isReading ? 
                      "🔊 Reading in progress... Will automatically turn the page when finished." : 
                      "Click 'Start Reading' to have the story read aloud"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={goToNextPage}
                disabled={currentPage >= totalPages - 1}
                className="h-full px-6 bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center disabled:opacity-30"
              >
                <ChevronRight size={36} />
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-800 border-t border-gray-700">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded-lg ${currentPage === 0 ? 'bg-gray-600 opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
            >
              ← Previous Page
            </button>
            
            <div style={{ color: readerTheme.headerText }}>
              Page {currentPage + 1} of {totalPages}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage >= totalPages - 1}
              className={`px-4 py-2 rounded-lg ${currentPage >= totalPages - 1 ? 'bg-gray-600 opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
            >
              Next Page →
            </button>
          </div>
          
          {/* Narrator status indicator */}
          {readerNarratorMessage && (
            <div 
              className="fixed bottom-4 left-4 px-4 py-2 rounded-lg text-white bg-green-600 flex items-center z-50"
              style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              <span className="mr-2">🔊</span>
              {readerNarratorMessage}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  interface SupportModalProps {
    onClose: () => void;
  }
  
  // Stripe service for donation processing
  interface DonationDetails {
    amount: number;
    currency: string;
    name?: string;
    email?: string;
  }

  class StripeService {
    // Replace with your actual publishable key when deploying
    private static PUBLISHABLE_KEY = 'pk_test_TYooMQauvdEDq54NiTphI7jx';
    
    public static async initializeStripe() {
      if (!window.Stripe) {
        // Load the Stripe.js script if not already loaded
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        document.body.appendChild(script);
        
        // Wait for script to load
        await new Promise<void>((resolve) => {
          script.onload = () => resolve();
        });
      }
      
      // @ts-ignore - Stripe is loaded from external script
      return window.Stripe(this.PUBLISHABLE_KEY);
    }
    
    public static async createCheckoutSession(donationDetails: DonationDetails) {
      try {
        // This would normally go through your server
        // For demo purposes, we'll create a checkout session directly
        const stripe = await this.initializeStripe();
        
        // Redirect to Stripe Checkout for simple demo purposes
        // In a real implementation, you would create a session on your server
        return stripe.redirectToCheckout({
          lineItems: [{
            price_data: {
              currency: donationDetails.currency,
              product_data: {
                name: 'Donation to Leola Sister Lee',
                description: 'Support for independent storytelling',
              },
              unit_amount: donationDetails.amount, // amount in cents
            },
            quantity: 1,
          }],
          mode: 'payment',
          successUrl: window.location.href,
          cancelUrl: window.location.href,
          customerEmail: donationDetails.email,
        });
      } catch (error) {
        console.error('Error creating checkout:', error);
        throw error;
      }
    }
    
    public static async processDonation(donationDetails: DonationDetails) {
      try {
        const result = await this.createCheckoutSession(donationDetails);
        return !result.error;
      } catch (error) {
        console.error('Error processing donation:', error);
        return false;
      }
    }
  }

  // Support modal with donation functionality
  const SupportModal = ({ onClose }: SupportModalProps) => {
    const [donationAmount, setDonationAmount] = useState<number>(5);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    
    const handleAmountSelect = (amount: number) => {
      setDonationAmount(amount);
      setCustomAmount('');
    };
    
    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
        setCustomAmount(value);
        if (value !== '') {
          setDonationAmount(parseFloat(value));
        }
      }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!donationAmount || donationAmount < 1 || donationAmount > 100) {
        setErrorMessage('Please enter a valid donation amount between $1 and $100.');
        return;
      }
      
      setIsProcessing(true);
      setErrorMessage('');
      
      try {
        const stripe = await StripeService.initializeStripe();
        
        // Direct checkout for simplicity
        const { error } = await stripe.redirectToCheckout({
          lineItems: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Donation to Leola Sister Lee',
                description: 'Thank you for supporting independent storytelling!',
              },
              unit_amount: Math.round(donationAmount * 100), // amount in cents
            },
            quantity: 1,
          }],
          mode: 'payment',
          successUrl: window.location.href,
          cancelUrl: window.location.href,
          customerEmail: email || undefined,
        });
        
        if (error) {
          console.error('Checkout error:', error);
          setErrorMessage(error.message || 'There was a problem processing your donation.');
        }
      } catch (error) {
        console.error('Donation error:', error);
        setErrorMessage('An unexpected error occurred. Please try again later.');
      } finally {
        setIsProcessing(false);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div
          className="relative bg-gradient-to-b from-amber-800 to-amber-600 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
          style={{
            transform: 'perspective(1000px) rotateX(5deg)',
            boxShadow: '0 20px 60px -10px rgba(255, 193, 7, 0.3), 0 0 30px rgba(255, 193, 7, 0.2)'
          }}
        >
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 text-amber-200 hover:text-white transition-colors z-10"
          >
            <X size={24} />
          </button>
          
          <div className="p-10">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Heart className="text-red-400 w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-amber-100 mb-4">Support Leola Sister Lee</h2>
              <div className="bg-amber-900/30 p-6 rounded-xl border border-amber-500/20 mb-8">
                <p className="text-xl text-amber-100 leading-relaxed italic">
                  Your generous support helps Leola continue creating heartwarming stories that inspire crafters of all ages. Every donation weaves a thread of possibility!
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-amber-100 text-lg mb-3 font-medium">Select Donation Amount</label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[1, 5, 10].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountSelect(amount)}
                        className={`py-3 rounded-lg transition-colors ${
                          donationAmount === amount && !customAmount
                            ? 'bg-amber-500 text-white'
                            : 'bg-amber-900/50 text-amber-100 hover:bg-amber-800'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-amber-100 text-base mb-2">Custom Amount</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-900">
                        <span className="font-bold">$</span>
                      </div>
                      <input
                        type="text"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="Enter custom amount"
                        className="w-full pl-10 pr-4 py-3 bg-amber-50 rounded-lg text-amber-900 placeholder-amber-700/50"
                      />
                    </div>
                    <p className="text-amber-200 text-sm mt-2">Enter any amount between $1 and $100</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-amber-100 text-base mb-2">Name (Optional)</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3 bg-amber-50 rounded-lg text-amber-900 placeholder-amber-700/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-amber-100 text-base mb-2">Email (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        className="w-full px-4 py-3 bg-amber-50 rounded-lg text-amber-900 placeholder-amber-700/50"
                      />
                    </div>
                  </div>
                </div>
                
                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-white">{errorMessage}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isProcessing || !donationAmount || donationAmount < 1}
                  className={`w-full py-4 rounded-lg text-white font-bold text-xl ${
                    isProcessing
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-500 shadow-lg'
                  }`}
                >
                  {isProcessing ? 'Processing...' : `Donate ${donationAmount || 0}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Smooth Scrolling Banner
  const ScrollingBanner = () => {
    return (
      <div className="relative w-full h-16 overflow-hidden flex items-center">
        <div
          className="absolute whitespace-nowrap font-serif text-3xl animate-marquee"
          style={{
            background: 'linear-gradient(90deg, #7e22ce, #fbbf24, #7e22ce)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            backgroundSize: '200% 100%',
            animationDuration: '20s'
          }}
        >
          Find joy in each stitch as your hands create what your heart imagines
        </div>
      </div>
    );
  };
  
  // Handle narration for book cards with real speech synthesis
  const handleBookNarration = (book: Book) => {
    if (isNarrating) {
      // Stop narration
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsNarrating(false);
      setNarratorMessage("");
      return;
    }
    
    setIsNarrating(true);
    const voiceLabel = appSettings.voice === 'default' 
      ? 'System Default' 
      : appSettings.voice.replace('-', ' ').charAt(0).toUpperCase() + appSettings.voice.slice(1);
    
    setNarratorMessage(`Reading description with voice: ${voiceLabel}`);
    
    // Read the book description
    speakText(book.description, appSettings.voiceSpeed)
      .then(() => {
        setIsNarrating(false);
        setNarratorMessage("");
      })
      .catch(error => {
        console.error("Error in speech synthesis:", error);
        setIsNarrating(false);
        setNarratorMessage("");
      });
  };
  
  interface BookCardProps {
    book: Book;
    onOpenBook: (book: Book) => void;
  }
  
  // Book Card Component with custom Cover rendering
  const BookCard = ({ book, onOpenBook }: BookCardProps) => {
    const cardStyle = (() => {
      switch (appSettings.colorTheme) {
        case 'dark':
          return { background: 'rgba(30, 30, 30, 0.6)', color: '#c0c0c0' };
        case 'sepia':
          return { background: 'rgba(242, 232, 207, 0.8)', color: '#5c4b36' };
        case 'warm':
          return { background: 'rgba(58, 0, 0, 0.6)', color: '#f8e3cb' };
        case 'cool':
          return { background: 'rgba(0, 26, 51, 0.6)', color: '#e6f7ff' };
        default:
          return { background: 'rgba(26, 26, 46, 0.6)', color: '#e0e0e0' };
      }
    })();
    
    // Render specific book covers based on book id with animated elements
    const renderBookCover = () => {
      if (book.id === 'crochet-mastery') {
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100 relative overflow-hidden">
            {/* Book cover particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    fontSize: `${0.5 + Math.random()}rem`,
                    animationDelay: `${i * 0.5}s`,
                    opacity: 0.4 + Math.random() * 0.3
                  }}
                >
                  {['🧶', '🪡', '🧵', '✂️'][i % 4]}
                </div>
              ))}
            </div>
            
            <div className="relative w-full h-full z-10" style={{ padding: '5%' }}>
              {/* Double border design */}
              <div className="absolute inset-0 border-8 border-teal-700 m-4 animate-pulse" style={{ animationDuration: '4s' }}></div>
              <div className="absolute inset-0 border-2 border-teal-500 m-8"></div>
              
              <div className="relative h-full w-full flex flex-col items-center justify-between py-4">
                <div className="text-center mt-4">
                  <div className="text-teal-700 text-xl font-serif tracking-wider animate-shimmer">A COMPLETE GUIDE</div>
                  <div className="text-5xl font-bold text-center my-2 bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent drop-shadow-lg">
                    CROCHET
                  </div>
                  <div className="text-5xl font-bold text-center my-2 bg-gradient-to-r from-teal-800 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
                    MASTERY
                  </div>
                </div>
                
                <div className="flex-grow flex items-center justify-center p-4">
                  {/* Animated crochet patterns */}
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-teal-100 p-4 rounded-lg border border-teal-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="w-16 h-16 mx-auto relative">
                          {i === 0 && (
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="animate-pulse" style={{ animationDuration: '3s' }}>
                              <path d="M10,50 Q50,10 90,50 Q50,90 10,50 Z" fill="none" stroke="#0d9488" strokeWidth="3" />
                              <path d="M25,50 Q50,25 75,50 Q50,75 25,50 Z" fill="none" stroke="#0d9488" strokeWidth="3" />
                              <path d="M40,50 Q50,40 60,50 Q50,60 40,50 Z" fill="none" stroke="#0d9488" strokeWidth="3" />
                            </svg>
                          )}
                          {i === 1 && (
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="animate-spin" style={{ animationDuration: '10s' }}>
                              <rect x="20" y="20" width="60" height="60" fill="none" stroke="#0d9488" strokeWidth="3" />
                              <rect x="30" y="30" width="40" height="40" fill="none" stroke="#0d9488" strokeWidth="3" />
                              <rect x="40" y="40" width="20" height="20" fill="none" stroke="#0d9488" strokeWidth="3" />
                            </svg>
                          )}
                          {i === 2 && (
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="animate-pulse" style={{ animationDuration: '4s' }}>
                              <line x1="20" y1="20" x2="80" y2="80" stroke="#0d9488" strokeWidth="3" />
                              <line x1="80" y1="20" x2="20" y2="80" stroke="#0d9488" strokeWidth="3" />
                              <line x1="50" y1="10" x2="50" y2="90" stroke="#0d9488" strokeWidth="3" />
                              <line x1="10" y1="50" x2="90" y2="50" stroke="#0d9488" strokeWidth="3" />
                            </svg>
                          )}
                          {i === 3 && (
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="animate-ping" style={{ animationDuration: '5s' }}>
                              <circle cx="50" cy="50" r="30" fill="none" stroke="#0d9488" strokeWidth="3" />
                              <circle cx="50" cy="50" r="20" fill="none" stroke="#0d9488" strokeWidth="3" />
                              <circle cx="50" cy="50" r="10" fill="none" stroke="#0d9488" strokeWidth="3" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center mb-4 transform hover:scale-105 transition-transform">
                  <div className="text-base text-teal-800 tracking-widest">BY</div>
                  <div 
                    className="text-2xl font-bold mt-1 animate-glow"
                    style={{
                      background: 'linear-gradient(135deg, #0d9488 0%, #7c3aed 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 15px rgba(13, 148, 136, 0.5), 0 0 30px rgba(124, 58, 237, 0.3)',
                      letterSpacing: '1px'
                    }}
                  >
                    Leola Sister Lee
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        // The Love Story of a Needle and a Yarn - Enhanced with particles and animations
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-rose-200 via-rose-100 to-purple-100 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Falling heart particles */}
              {[...Array(15)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute animate-float-slow"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    fontSize: `${0.5 + Math.random() * 0.5}rem`,
                    animationDelay: `${i * 0.8}s`,
                    opacity: 0.4 + Math.random() * 0.3
                  }}
                >
                  {['❤️', '💕', '💖', '💘'][i % 4]}
                </div>
              ))}
              
              {/* Subtle animated gradient overlay */}
              <div 
                className="absolute inset-0 opacity-30 animate-pulse" 
                style={{
                  background: 'radial-gradient(circle, rgba(244,114,182,0.2) 0%, rgba(147,51,234,0.1) 100%)',
                  animationDuration: '8s'
                }}
              ></div>
            </div>
            
            <div className="w-full h-full p-5 flex flex-col items-center justify-between z-10 relative">
              {/* Decorative border */}
              <div className="absolute inset-x-8 inset-y-6 border-2 border-pink-300 rounded-lg opacity-60"></div>
              
              {/* Title */}
              <div className="text-center mt-8 z-10">
                <div className="flex justify-center gap-2 mb-2 animate-pulse" style={{animationDuration: '3s'}}>
                  <div className="text-red-500 text-2xl">❤</div>
                  <div className="text-purple-800 text-xl font-serif italic">The Love Story of</div>
                  <div className="text-red-500 text-2xl">❤</div>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 bg-clip-text text-transparent drop-shadow-lg mb-1">
                  A Needle and a Yarn
                </div>
                <div className="mx-auto w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{animationDuration: '2s'}}></div>
              </div>
              
              {/* Main illustration */}
              <div className="flex-grow flex items-center justify-center w-full py-2">
                <div className="relative mx-auto w-64 h-64">
                  {/* Ball of Yarn - with animation */}
                  <div className="absolute left-4 z-10 w-40 h-40 hover:scale-105 transition-transform">
                    <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-pink-300 to-pink-500 shadow-lg animate-pulse" style={{animationDuration: '4s'}}></div>
                    
                    {/* Yarn texture */}
                    <div className="absolute w-full h-full rounded-full overflow-hidden opacity-60">
                      <div className="absolute left-5 top-5 w-10 h-10 rounded-full border-2 border-pink-200"></div>
                      <div className="absolute left-15 top-15 w-14 h-14 rounded-full border-2 border-pink-200"></div>
                      <div className="absolute left-10 top-20 w-12 h-12 rounded-full border-2 border-pink-200"></div>
                      <div className="absolute left-20 top-10 w-8 h-8 rounded-full border-2 border-pink-200"></div>
                      <div className="absolute left-25 top-25 w-10 h-10 rounded-full border-2 border-pink-200"></div>
                    </div>
                    
                    {/* Animated yarn shimmer */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                    
                    {/* Loose thread - with animation */}
                    <div className="absolute top-5 left-32 w-40 h-2 animate-wave" style={{transformOrigin: 'left center'}}>
                      <svg viewBox="0 0 120 10" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,5 C10,0 20,10 30,5 C40,0 50,10 60,5 C70,0 80,10 90,5 C100,0 110,10 120,5" 
                              fill="none" stroke="#ec4899" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Crochet Needle - with animation */}
                  <div className="absolute right-0 top-12 w-60 h-16 rotate-12 z-20 hover:scale-105 transition-transform animate-float-gentle">
                    {/* Needle thin body */}
                    <div className="absolute top-6 right-0 w-48 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
                    
                    {/* Needle hook end */}
                    <div className="absolute top-4 right-0 w-10 h-6">
                      <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,10 L25,10 C28,10 28,0 25,0 C22,0 20,5 25,5 L30,5" 
                              fill="none" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </div>
                    
                    {/* Needle handle end with glowing effect */}
                    <div className="absolute top-4 left-0 w-12 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-l-lg shadow-md">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                    </div>
                  </div>
                  
                  {/* Animated hearts floating */}
                  <div className="absolute top-0 right-10 text-red-400 text-xl animate-float-slow">❤️</div>
                  <div className="absolute bottom-5 left-10 text-red-400 text-lg animate-float-slow" style={{ animationDelay: "0.5s" }}>❤️</div>
                  <div className="absolute top-12 left-0 text-red-400 text-sm animate-float-slow" style={{ animationDelay: "1s" }}>❤️</div>
                  
                  {/* Thread connecting needle and yarn - with animation */}
                  <div className="absolute left-36 top-16 w-20 h-10">
                    <svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg" className="animate-pulse" style={{animationDuration: '3s'}}>
                      <path d="M0,20 C20,0 60,40 80,20" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4 2" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Author name with enhanced glow effect */}
              <div className="text-center mb-6 mt-2 z-10 transform hover:scale-105 transition-transform">
                <div className="text-sm text-purple-800 tracking-widest">A NOVEL BY</div>
                <div 
                  className="text-2xl font-bold animate-glow" 
                  style={{
                    background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #ef4444 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 15px rgba(236, 72, 153, 0.5), 0 0 30px rgba(147, 51, 234, 0.3)',
                    letterSpacing: '1px'
                  }}
                >
                  Leola Sister Lee
                </div>
                <div className="mx-auto w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-1"></div>
              </div>
            </div>
          </div>
        );
      }
    };
    
    return (
      <div
        className="relative rounded-lg overflow-hidden backdrop-blur-sm border border-gray-700 h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
        style={{
          background: cardStyle.background,
          color: cardStyle.color
        }}
      >
        <div className="p-4 pb-2">
          <h3 className="text-4xl font-bold" style={{ color: book.bubbleColor }}>{book.title}</h3>
          <p className="text-xl flex items-center">
            by <span className="ml-2 mr-2" style={{
              color: '#a855f7',
              textShadow: '0 0 8px #a855f7, 0 0 15px #a855f7, 0 0 25px #a855f7'
            }}>{book.author}</span>
            <button 
              className={`ml-3 p-3 rounded-full transition-colors ${isNarrating ? 'bg-red-600 text-white' : 'bg-blue-700 text-white'}`}
              onClick={() => handleBookNarration(book)}
            >
              <Volume2 size={20} />
            </button>
          </p>
        </div>
        
        <div
          className="w-full aspect-[3/4] overflow-hidden transition-all duration-300 relative"
          style={{
            background: book.gradient
          }}
        >
          {renderBookCover()}
        </div>
        
        <div className="p-4 pt-3 flex-grow">
          <p className="text-xl mb-3 leading-relaxed">
            {book.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {book.genres.map((genre: string, index: number) => {
              const colors = ['#FF6B6B', '#48BEFF', '#9775FA', '#4CAF50'];
              const color = colors[index % colors.length];
              
              return (
                <span
                  key={index}
                  className="inline-block rounded-full px-4 py-2 text-base font-medium"
                  style={{
                    backgroundColor: `${color}20`,
                    color: color,
                    border: `1px solid ${color}40`
                  }}
                >
                  {genre}
                </span>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 pt-0 flex justify-center">
          <button
            onClick={() => onOpenBook(book)}
            className="w-full py-4 text-white rounded-lg font-bold text-xl shadow-lg"
            style={{ backgroundColor: book.bubbleColor }}
          >
            Open "{book.title}"
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: theme.background, color: theme.text }}>
      <Particles />
      
      <div className="relative z-10 p-6 pb-0">
        <div className="text-center mb-6">
          <h1 className="text-6xl font-bold" 
              style={{ 
                color: theme.headerText,
                textShadow: '0 0 15px rgba(255, 193, 7, 0.5), 0 0 30px rgba(255, 193, 7, 0.3)'
              }}>
            Leola's Digital Library
          </h1>
          <p className="mt-4 text-2xl">
            A collection of heartwarming stories and guides by
            <span className="ml-2" style={{
              color: '#a855f7',
              textShadow: '0 0 8px #a855f7, 0 0 15px #a855f7, 0 0 25px #a855f7'
            }}>Leola "Sister" Lee</span>
          </p>
        </div>
        
        <div className="absolute top-8 left-8 flex flex-row gap-4">
          <button
            className="flex flex-col items-center justify-center hover:scale-110 transition-transform cursor-pointer bg-amber-900/30 p-4 rounded-xl border border-amber-500/30"
            onClick={() => setShowSupportModal(true)}
            style={{ width: '120px', height: '120px' }}
          >
            <span className="text-5xl">🎁</span>
            <span className="text-sm text-amber-300 mt-2 font-bold">Support Leola</span>
          </button>
          
          <button
            className="flex flex-col items-center justify-center hover:scale-110 transition-transform cursor-pointer bg-blue-800/60 p-4 rounded-xl border border-blue-400/60 shadow-lg"
            onClick={() => setShowSettingsPanel(true)}
            style={{
              boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)',
              width: '120px',
              height: '120px'
            }}
          >
            <span className="text-5xl">⚙️</span>
            <span className="text-sm text-blue-200 mt-2 font-bold">Settings</span>
          </button>
        </div>
        
        <div className="mb-6">
          <ScrollingBanner />
        </div>
      </div>
      
      <div className="flex-grow relative z-10 px-6 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 px-12 md:px-24">
            {books.map(book => (
              <div key={book.id} className="h-full max-w-lg mx-auto">
                <BookCard
                  book={book}
                  onOpenBook={(book) => setSelectedBook(book)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedBook && (
        <BookReader
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
      
      {showSupportModal && (
        <SupportModal
          onClose={() => setShowSupportModal(false)}
        />
      )}
      
      <SettingsPanel />
      
      {/* Narrator status indicator - App level */}
      {narratorMessage && (
        <NarratorStatus isActive={isNarrating} message={narratorMessage} />
      )}
      
      {/* Custom fish-like animation styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(15deg); }
          }
          
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LibraryPreview;