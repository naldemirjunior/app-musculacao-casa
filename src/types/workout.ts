export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number; // em segundos
  reps?: number;
  sets?: number;
  restTime: number; // em segundos
  voiceInstruction: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  totalDuration: number; // em segundos
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goal: 'gain_mass' | 'lose_weight' | 'maintenance';
}

export interface UserProfile {
  email: string;
  height: number;
  weight: number;
  age: string;
  goal: 'gain_mass' | 'lose_weight' | 'maintenance';
  bmi: string;
  experience_level: string;
  workout_frequency: string;
  equipment: string;
  plan?: 'free' | 'premium';
  created_at: string;
}
