// src/types.ts

/**
 * Shared Type Definitions
 */

// Basic page structure
export interface BookPage {
    title: string;
    content: string;
  }
  
  // Entire book structure
  export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    pages: BookPage[];
  }
  
  // Example: If you need a "Particle" or "ParticleSystem" type, it would go here.
  // (Only if your background or other features rely on it.)
  
