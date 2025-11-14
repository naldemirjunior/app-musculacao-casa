import { Exercise, WorkoutPlan } from '@/types/workout';

// Calcular IMC
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

// Determinar objetivo baseado no IMC
export function determineGoal(bmi: number, userGoal: string): 'gain_mass' | 'lose_weight' | 'maintenance' {
  // Se usuário escolheu objetivo específico, respeitar
  if (userGoal.includes('Ganho de massa')) return 'gain_mass';
  if (userGoal.includes('Perda de peso')) return 'lose_weight';
  
  // Caso contrário, sugerir baseado no IMC
  if (bmi < 18.5) return 'gain_mass';
  if (bmi > 25) return 'lose_weight';
  return 'maintenance';
}

// Banco de exercícios
const exerciseDatabase: Exercise[] = [
  // ABDÔMEN
  {
    id: 'abs-1',
    name: 'Prancha',
    description: 'Mantenha o corpo reto, apoiado nos antebraços e pontas dos pés',
    category: 'Abdômen',
    duration: 30,
    sets: 3,
    restTime: 20,
    voiceInstruction: 'Prancha por 30 segundos. Mantenha o corpo reto e o abdômen contraído.',
    difficulty: 'beginner',
  },
  {
    id: 'abs-2',
    name: 'Abdominal Crunch',
    description: 'Deitado, eleve o tronco contraindo o abdômen',
    category: 'Abdômen',
    duration: 40,
    reps: 15,
    sets: 3,
    restTime: 20,
    voiceInstruction: 'Abdominal crunch. 15 repetições. Contraia bem o abdômen a cada movimento.',
    difficulty: 'beginner',
  },
  {
    id: 'abs-3',
    name: 'Bicicleta no Ar',
    description: 'Alterne os joelhos em direção aos cotovelos opostos',
    category: 'Abdômen',
    duration: 45,
    reps: 20,
    sets: 3,
    restTime: 25,
    voiceInstruction: 'Bicicleta no ar. 20 repetições alternadas. Mantenha o ritmo constante.',
    difficulty: 'intermediate',
  },
  
  // BRAÇO
  {
    id: 'arm-1',
    name: 'Flexão de Braço',
    description: 'Flexão tradicional ou com joelhos apoiados',
    category: 'Braço',
    duration: 40,
    reps: 12,
    sets: 3,
    restTime: 30,
    voiceInstruction: 'Flexão de braço. 12 repetições. Desça até o peito quase tocar o chão.',
    difficulty: 'intermediate',
  },
  {
    id: 'arm-2',
    name: 'Tríceps no Banco',
    description: 'Use uma cadeira para apoiar as mãos e desça o corpo',
    category: 'Braço',
    duration: 35,
    reps: 15,
    sets: 3,
    restTime: 25,
    voiceInstruction: 'Tríceps no banco. 15 repetições. Foque na contração do tríceps.',
    difficulty: 'beginner',
  },
  {
    id: 'arm-3',
    name: 'Rosca Direta (Peso Corporal)',
    description: 'Use uma mesa ou barra baixa para puxar o corpo',
    category: 'Braço',
    duration: 40,
    reps: 10,
    sets: 3,
    restTime: 30,
    voiceInstruction: 'Rosca direta. 10 repetições. Contraia bem o bíceps.',
    difficulty: 'intermediate',
  },
  
  // PEITO
  {
    id: 'chest-1',
    name: 'Flexão Tradicional',
    description: 'Flexão com mãos na largura dos ombros',
    category: 'Peito',
    duration: 40,
    reps: 15,
    sets: 3,
    restTime: 30,
    voiceInstruction: 'Flexão tradicional. 15 repetições. Mantenha o corpo alinhado.',
    difficulty: 'intermediate',
  },
  {
    id: 'chest-2',
    name: 'Flexão Diamante',
    description: 'Mãos juntas formando um diamante',
    category: 'Peito',
    duration: 35,
    reps: 10,
    sets: 3,
    restTime: 30,
    voiceInstruction: 'Flexão diamante. 10 repetições. Foque no centro do peito.',
    difficulty: 'advanced',
  },
  
  // PERNA
  {
    id: 'leg-1',
    name: 'Agachamento',
    description: 'Agachamento livre com peso corporal',
    category: 'Perna',
    duration: 45,
    reps: 20,
    sets: 3,
    restTime: 30,
    voiceInstruction: 'Agachamento. 20 repetições. Desça até as coxas ficarem paralelas ao chão.',
    difficulty: 'beginner',
  },
  {
    id: 'leg-2',
    name: 'Afundo',
    description: 'Alterne as pernas dando um passo à frente',
    category: 'Perna',
    duration: 50,
    reps: 12,
    sets: 3,
    restTime: 30,
    voiceInstruction: 'Afundo alternado. 12 repetições por perna. Mantenha o equilíbrio.',
    difficulty: 'intermediate',
  },
  {
    id: 'leg-3',
    name: 'Elevação de Panturrilha',
    description: 'Suba nas pontas dos pés',
    category: 'Perna',
    duration: 40,
    reps: 25,
    sets: 3,
    restTime: 20,
    voiceInstruction: 'Elevação de panturrilha. 25 repetições. Suba o máximo que conseguir.',
    difficulty: 'beginner',
  },
  
  // OMBRO
  {
    id: 'shoulder-1',
    name: 'Elevação Lateral (Peso Corporal)',
    description: 'Braços estendidos lateralmente',
    category: 'Ombro',
    duration: 35,
    reps: 15,
    sets: 3,
    restTime: 25,
    voiceInstruction: 'Elevação lateral. 15 repetições. Mantenha os braços estendidos.',
    difficulty: 'beginner',
  },
  {
    id: 'shoulder-2',
    name: 'Pike Push-up',
    description: 'Flexão em V invertido focando nos ombros',
    category: 'Ombro',
    duration: 40,
    reps: 12,
    sets: 3,
    restTime: 30,
    voiceInstruction: 'Pike push-up. 12 repetições. Foque na força dos ombros.',
    difficulty: 'intermediate',
  },
  
  // COSTAS
  {
    id: 'back-1',
    name: 'Superman',
    description: 'Deitado de bruços, eleve braços e pernas',
    category: 'Costas',
    duration: 30,
    sets: 3,
    restTime: 20,
    voiceInstruction: 'Superman. 30 segundos. Mantenha braços e pernas elevados.',
    difficulty: 'beginner',
  },
  {
    id: 'back-2',
    name: 'Remada Invertida',
    description: 'Use uma mesa para puxar o corpo',
    category: 'Costas',
    duration: 40,
    reps: 12,
    sets: 3,
    restTime: 30,
    voiceInstruction: 'Remada invertida. 12 repetições. Puxe o peito em direção à mesa.',
    difficulty: 'intermediate',
  },
];

// Gerar plano de treino personalizado
export function generateWorkoutPlan(
  userId: string,
  goal: 'gain_mass' | 'lose_weight' | 'maintenance',
  experienceLevel: string
): WorkoutPlan {
  // Determinar dificuldade baseada na experiência
  let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  if (experienceLevel.includes('Intermediário')) difficulty = 'intermediate';
  if (experienceLevel.includes('Avançado')) difficulty = 'advanced';

  // Filtrar exercícios apropriados
  let selectedExercises: Exercise[] = [];

  // Para ganho de massa: foco em força e hipertrofia
  if (goal === 'gain_mass') {
    selectedExercises = [
      exerciseDatabase.find(e => e.id === 'chest-1')!,
      exerciseDatabase.find(e => e.id === 'arm-1')!,
      exerciseDatabase.find(e => e.id === 'leg-1')!,
      exerciseDatabase.find(e => e.id === 'back-2')!,
      exerciseDatabase.find(e => e.id === 'shoulder-2')!,
      exerciseDatabase.find(e => e.id === 'abs-2')!,
    ];
  }
  // Para perda de peso: foco em cardio e resistência
  else if (goal === 'lose_weight') {
    selectedExercises = [
      exerciseDatabase.find(e => e.id === 'leg-2')!,
      exerciseDatabase.find(e => e.id === 'abs-3')!,
      exerciseDatabase.find(e => e.id === 'chest-1')!,
      exerciseDatabase.find(e => e.id === 'leg-1')!,
      exerciseDatabase.find(e => e.id === 'abs-1')!,
      exerciseDatabase.find(e => e.id === 'arm-2')!,
    ];
  }
  // Para manutenção: treino balanceado
  else {
    selectedExercises = [
      exerciseDatabase.find(e => e.id === 'abs-1')!,
      exerciseDatabase.find(e => e.id === 'arm-1')!,
      exerciseDatabase.find(e => e.id === 'leg-1')!,
      exerciseDatabase.find(e => e.id === 'back-1')!,
      exerciseDatabase.find(e => e.id === 'shoulder-1')!,
      exerciseDatabase.find(e => e.id === 'chest-1')!,
    ];
  }

  // Calcular duração total
  const totalDuration = selectedExercises.reduce((total, exercise) => {
    const exerciseTime = exercise.duration * (exercise.sets || 1);
    const restTime = exercise.restTime * ((exercise.sets || 1) - 1);
    return total + exerciseTime + restTime;
  }, 0);

  return {
    id: `plan-${userId}-${Date.now()}`,
    name: goal === 'gain_mass' 
      ? 'Treino de Hipertrofia' 
      : goal === 'lose_weight' 
      ? 'Treino de Emagrecimento' 
      : 'Treino Balanceado',
    description: goal === 'gain_mass'
      ? 'Foco em ganho de massa muscular e força'
      : goal === 'lose_weight'
      ? 'Foco em queima de calorias e definição'
      : 'Treino completo para manutenção',
    exercises: selectedExercises,
    totalDuration,
    difficulty,
    goal,
  };
}
