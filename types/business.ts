/**
 * Business Profile - Information gathered during discovery phase
 * Stores business snapshot, goals, challenges, and coach-specific data
 */
export interface BusinessProfile {
  // Quick snapshot (2-3 sentence business description)
  snapshot: string;
  
  // Top 1-3 goals for the next 6-12 months
  goals: string[];
  
  // Where they feel stuck or frustrated
  challenges: string[];
  
  // Current products/services/offers
  offers: string[];
  
  // Constraints: team size, time available, budget, etc.
  constraints: string;
  
  // Coach-specific data stored as key-value pairs
  // This allows different coaches to store their specific discovery findings
  [key: string]: any;
}

