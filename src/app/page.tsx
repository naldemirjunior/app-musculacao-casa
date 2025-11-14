"use client";

import { useState, useEffect } from "react";
import { 
  Home, 
  Search, 
  BarChart3, 
  Settings, 
  Bell, 
  Crown,
  Dumbbell,
  Timer,
  Flame,
  Target,
  Play,
  ChevronRight,
  CheckCircle2,
  Circle,
  Check,
  X,
  Zap,
  Star,
  LogOut,
  Pause,
  SkipForward,
  Volume2,
  User,
  CreditCard,
  Loader2,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { calculateBMI, determineGoal, generateWorkoutPlan } from "@/lib/workout-generator";
import { Exercise, WorkoutPlan } from "@/types/workout";

export default function NalApp() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium" | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [weekProgress, setWeekProgress] = useState([true, true, false, false, false, false, false]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<Exercise | null>(null);
  const [workoutIndex, setWorkoutIndex] = useState(0);
  const [isWorkoutPlaying, setIsWorkoutPlaying] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSupabaseWarning, setShowSupabaseWarning] = useState(false);

  // Verificar se Supabase está configurado
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl === '!090598#' || supabaseKey === '!090598#') {
      setShowSupabaseWarning(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showSupabaseWarning) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        checkUserProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [showSupabaseWarning]);

  // Verificar sucesso do pagamento
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');

    if (success === 'true' && sessionId && session) {
      // Atualizar plano para premium
      handleSelectPlan('premium');
      // Limpar URL
      window.history.replaceState({}, '', '/');
    }
  }, [session]);

  const checkUserProfile = async (userId: string) => {
    // Verificar se usuário já tem perfil
    const profile = localStorage.getItem(`user_profile_${userId}`);
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
      setSelectedPlan(parsedProfile.plan || 'free');
      
      // Gerar plano de treino
      const plan = generateWorkoutPlan(
        userId,
        parsedProfile.goal,
        parsedProfile.experience_level
      );
      setWorkoutPlan(plan);
    } else {
      setShowQuestionnaire(true);
    }
  };

  const questions = [
    {
      id: 0,
      question: "Qual é o seu nível atual de experiência em musculação?",
      options: ["Iniciante", "Intermediário", "Avançado"]
    },
    {
      id: 1,
      question: "Com que frequência você pratica exercícios em casa?",
      options: ["Diariamente", "Algumas vezes por semana", "Raramente"]
    },
    {
      id: 2,
      question: "Quais são seus objetivos principais?",
      options: ["Ganho de massa muscular", "Perda de peso", "Melhoria da resistência", "Definição muscular"]
    },
    {
      id: 3,
      question: "Qual é a sua altura? (em cm)",
      type: "number",
      placeholder: "Ex: 175"
    },
    {
      id: 4,
      question: "Qual é o seu peso? (em kg)",
      type: "number",
      placeholder: "Ex: 70"
    },
    {
      id: 5,
      question: "Qual é a sua idade?",
      options: ["Menos de 18 anos", "18-24 anos", "25-34 anos", "35-44 anos", "45-54 anos", "55 anos ou mais"]
    },
    {
      id: 6,
      question: "Você possui algum equipamento de treino em casa?",
      options: ["Sim, tenho equipamentos", "Não, apenas peso corporal", "Tenho alguns acessórios básicos"]
    }
  ];

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  const handleFinishQuestionnaire = () => {
    // Calcular IMC e determinar objetivo
    const height = parseFloat(answers[3]);
    const weight = parseFloat(answers[4]);
    const bmi = calculateBMI(weight, height);
    const goal = determineGoal(bmi, answers[2]);
    
    const profile = {
      email: session?.user?.email,
      height,
      weight,
      age: answers[5],
      goal,
      bmi: bmi.toFixed(1),
      experience_level: answers[0],
      workout_frequency: answers[1],
      equipment: answers[6],
      created_at: new Date().toISOString()
    };

    // Salvar perfil localmente
    localStorage.setItem(`user_profile_${session?.user?.id}`, JSON.stringify(profile));
    setUserProfile(profile);
    
    setShowQuestionnaire(false);
    setShowPricingPlans(true);
  };

  const handleSelectPlan = (plan: "free" | "premium") => {
    setSelectedPlan(plan);
    
    // Atualizar perfil com plano
    const updatedProfile = { ...userProfile, plan };
    localStorage.setItem(`user_profile_${session?.user?.id}`, JSON.stringify(updatedProfile));
    setUserProfile(updatedProfile);
    
    // Gerar plano de treino
    const workoutPlan = generateWorkoutPlan(
      session?.user?.id,
      userProfile.goal,
      userProfile.experience_level
    );
    setWorkoutPlan(workoutPlan);
    
    setTimeout(() => {
      setShowPricingPlans(false);
    }, 500);
  };

  const handlePremiumCheckout = async () => {
    if (!session) return;

    // Verificar se Stripe está configurado
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey || stripeKey === '') {
      alert('⚠️ Sistema de pagamento não configurado ainda.\n\nPor enquanto, você pode usar o plano gratuito!\n\nPara configurar pagamentos, adicione suas credenciais do Stripe nas variáveis de ambiente.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Criar sessão de checkout
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          userEmail: session.user.email,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert('Erro ao processar pagamento: ' + data.error);
        setIsProcessingPayment(false);
        return;
      }

      // Redirecionar para checkout do Stripe
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Erro:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
      setIsProcessingPayment(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserProfile(null);
    setWorkoutPlan(null);
    setShowQuestionnaire(false);
    setShowPricingPlans(false);
  };

  const startWorkout = (exercise: Exercise, index: number) => {
    setActiveWorkout(exercise);
    setWorkoutIndex(index);
    setIsWorkoutPlaying(true);
    setWorkoutTimer(exercise.duration);
    setCurrentSet(1);
    setIsResting(false);
    
    // Falar instrução usando Web Speech API
    speakInstruction(exercise.voiceInstruction);
  };

  const speakInstruction = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWorkoutPlaying && workoutTimer > 0) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => {
          if (prev <= 1) {
            // Tempo acabou
            if (!isResting && activeWorkout && currentSet < (activeWorkout.sets || 1)) {
              // Iniciar descanso
              setIsResting(true);
              speakInstruction(`Descanso! ${activeWorkout.restTime} segundos.`);
              return activeWorkout.restTime;
            } else if (isResting) {
              // Fim do descanso, próxima série
              setIsResting(false);
              setCurrentSet(prev => prev + 1);
              speakInstruction(`Série ${currentSet + 1}. Vamos lá!`);
              return activeWorkout?.duration || 0;
            } else {
              // Exercício completo
              setIsWorkoutPlaying(false);
              speakInstruction('Exercício completo! Parabéns!');
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isWorkoutPlaying, workoutTimer, isResting, currentSet, activeWorkout]);

  const skipToNextExercise = () => {
    if (workoutPlan && workoutIndex < workoutPlan.exercises.length - 1) {
      const nextExercise = workoutPlan.exercises[workoutIndex + 1];
      startWorkout(nextExercise, workoutIndex + 1);
    } else {
      setActiveWorkout(null);
      setIsWorkoutPlaying(false);
      speakInstruction('Treino completo! Excelente trabalho!');
    }
  };

  const categories = [
    { name: "Abdômen", icon: "💪", color: "from-blue-400 to-blue-600" },
    { name: "Braço", icon: "💪", color: "from-purple-400 to-purple-600" },
    { name: "Peito", icon: "🏋️", color: "from-red-400 to-red-600" },
    { name: "Perna", icon: "🦵", color: "from-green-400 to-green-600" },
    { name: "Ombro", icon: "💪", color: "from-orange-400 to-orange-600" },
    { name: "Costas", icon: "🏋️", color: "from-cyan-400 to-cyan-600" },
  ];

  // Tela de aviso de configuração do Supabase
  if (showSupabaseWarning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-orange-400">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-12 h-12 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ⚠️ Configuração Necessária
              </h1>
              <p className="text-gray-600">
                O app NAL precisa ser configurado com suas credenciais do Supabase
              </p>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
              <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔧</span>
                Como configurar:
              </h2>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-orange-600 flex-shrink-0">1.</span>
                  <span>Acesse <a href="https://supabase.com" target="_blank" className="text-blue-600 underline font-semibold">supabase.com</a> e crie um projeto gratuito</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-orange-600 flex-shrink-0">2.</span>
                  <span>No dashboard do Supabase, vá em <strong>Settings → API</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-orange-600 flex-shrink-0">3.</span>
                  <span>Copie a <strong>URL do projeto</strong> e a <strong>anon/public key</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-orange-600 flex-shrink-0">4.</span>
                  <span>Configure as variáveis de ambiente no arquivo <code className="bg-gray-200 px-2 py-1 rounded text-sm">.env.local</code>:</span>
                </li>
              </ol>
            </div>

            <div className="bg-gray-900 text-green-400 rounded-xl p-4 mb-6 font-mono text-sm overflow-x-auto">
              <div className="mb-2 text-gray-500"># .env.local</div>
              <div>NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui</div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong className="text-blue-600">💡 Dica:</strong> Após configurar, reinicie o servidor de desenvolvimento com <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code>
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
              >
                🔄 Recarregar Página
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="w-16 h-16 text-blue-600 animate-bounce mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Dumbbell className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">NAL</h1>
            </div>
            <p className="text-gray-600 text-lg">Seu Personal em Casa</p>
            <p className="text-gray-500 text-sm mt-2">Entre para começar seu treino personalizado</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#3b82f6',
                      brandAccent: '#2563eb',
                    },
                  },
                },
              }}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Email',
                    password_label: 'Senha',
                    button_label: 'Entrar',
                    loading_button_label: 'Entrando...',
                    social_provider_text: 'Entrar com {{provider}}',
                    link_text: 'Já tem uma conta? Entre',
                  },
                  sign_up: {
                    email_label: 'Email',
                    password_label: 'Senha',
                    button_label: 'Criar conta',
                    loading_button_label: 'Criando conta...',
                    social_provider_text: 'Entrar com {{provider}}',
                    link_text: 'Não tem uma conta? Cadastre-se',
                  },
                },
              }}
              providers={['facebook']}
            />
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            <p>✓ Treinos personalizados • ✓ Sem equipamentos necessários</p>
          </div>
        </div>
      </div>
    );
  }

  // Active Workout Screen
  if (activeWorkout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={() => {
              setActiveWorkout(null);
              setIsWorkoutPlaying(false);
              window.speechSynthesis.cancel();
            }}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <p className="text-sm opacity-90">Exercício {workoutIndex + 1} de {workoutPlan?.exercises.length}</p>
            <p className="text-xs opacity-75">
              {isResting ? 'Descansando' : `Série ${currentSet} de ${activeWorkout.sets}`}
            </p>
          </div>
          <button
            onClick={skipToNextExercise}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {/* Timer Circle */}
          <div className="relative mb-8">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - workoutTimer / (isResting ? activeWorkout.restTime : activeWorkout.duration))}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{workoutTimer}</div>
                <div className="text-sm opacity-75">segundos</div>
              </div>
            </div>
          </div>

          {/* Exercise Info */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{activeWorkout.name}</h2>
            <p className="text-lg opacity-90 mb-4">{activeWorkout.description}</p>
            {!isResting && (
              <div className="flex items-center justify-center gap-6 text-sm">
                {activeWorkout.reps && (
                  <div className="bg-white/20 px-4 py-2 rounded-full">
                    <span className="font-semibold">{activeWorkout.reps}</span> repetições
                  </div>
                )}
                {activeWorkout.sets && (
                  <div className="bg-white/20 px-4 py-2 rounded-full">
                    <span className="font-semibold">{activeWorkout.sets}</span> séries
                  </div>
                )}
              </div>
            )}
            {isResting && (
              <div className="bg-yellow-500/30 px-6 py-3 rounded-full inline-block">
                <span className="font-semibold">⏸️ Descansando</span>
              </div>
            )}
          </div>

          {/* Animation */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <Dumbbell className="w-16 h-16" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsWorkoutPlaying(!isWorkoutPlaying)}
              className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg"
            >
              {isWorkoutPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </button>
            <button
              onClick={() => speakInstruction(activeWorkout.voiceInstruction)}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-4">
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((workoutIndex + 1) / (workoutPlan?.exercises.length || 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Pricing Plans Screen
  if (showPricingPlans) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Dumbbell className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">NAL</h1>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Escolha seu plano
            </h2>
            <p className="text-gray-600">
              Seu objetivo: <span className="font-bold text-blue-600">
                {userProfile?.goal === 'gain_mass' ? 'Ganho de Massa Muscular' : 
                 userProfile?.goal === 'lose_weight' ? 'Perda de Peso' : 'Manutenção'}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              IMC: {userProfile?.bmi} • {userProfile?.height}cm • {userProfile?.weight}kg
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-gray-200 hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Plano Gratuito</h3>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-800">R$ 0</span>
                  <span className="text-gray-500">/mês</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Para sempre gratuito</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Plano de treino personalizado</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">4 exercícios por treino</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Instruções por voz</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">Treinos ilimitados</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">Vídeos HD</span>
                </li>
              </ul>

              <button
                onClick={() => handleSelectPlan("free")}
                className="w-full py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all"
              >
                COMEÇAR GRÁTIS
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-blue-400 relative overflow-hidden transform hover:scale-105 transition-all">
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3" />
                RECOMENDADO
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Plano Premium</h3>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-300" />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">R$ 29,90</span>
                  <span className="text-blue-100">/mês</span>
                </div>
                <p className="text-sm text-blue-100 mt-1">Cancele quando quiser</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Tudo do plano gratuito</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Treinos ilimitados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">6+ exercícios por treino</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Vídeos HD com demonstrações</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Relatórios de progresso</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Suporte prioritário</span>
                </li>
              </ul>

              <button
                onClick={handlePremiumCheckout}
                disabled={isProcessingPayment}
                className="w-full py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    PROCESSANDO...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    ASSINAR PREMIUM
                  </>
                )}
              </button>
              
              {/* Info sobre configuração */}
              {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
                <div className="mt-4 bg-yellow-500/20 border border-yellow-300/30 rounded-lg p-3 text-xs text-white flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Sistema de pagamento em configuração. Use o plano gratuito por enquanto!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Questionnaire Screen
  if (showQuestionnaire) {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const isLastQuestion = currentQuestion === questions.length - 1;
    const allQuestionsAnswered = Object.keys(answers).length === questions.length;
    const currentQ = questions[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Dumbbell className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">NAL</h1>
            </div>
            <p className="text-gray-600">Vamos personalizar seu treino</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">
                Pergunta {currentQuestion + 1} de {questions.length}
              </span>
              <span className="text-sm font-semibold text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
              {currentQ.question}
            </h2>

            {currentQ.type === "number" ? (
              <input
                type="number"
                placeholder={currentQ.placeholder}
                value={answers[currentQuestion] || ""}
                onChange={(e) => setAnswers({ ...answers, [currentQuestion]: e.target.value })}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
              />
            ) : (
              <div className="space-y-3">
                {currentQ.options?.map((option, index) => {
                  const isSelected = answers[currentQuestion] === option;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-left font-medium ${
                        isSelected ? "text-blue-600" : "text-gray-700"
                      }`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Voltar
              </button>
            )}
            
            {currentQ.type === "number" && answers[currentQuestion] && (
              <button
                onClick={() => {
                  if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                PRÓXIMO
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            
            {isLastQuestion && allQuestionsAnswered && (
              <button
                onClick={handleFinishQuestionnaire}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                CONTINUAR
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main App Screen
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">NAL</h1>
              <p className="text-xs text-blue-100">Seu Personal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => selectedPlan === 'free' && setShowPricingPlans(true)}
              className="flex items-center gap-1 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold hover:bg-yellow-400 transition-all"
            >
              <Crown className="w-4 h-4" />
              {selectedPlan === "premium" ? "PRO" : "FREE"}
            </button>
            <button 
              onClick={handleSignOut}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* User Profile Card */}
        {userProfile && (
          <section className="mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Olá, {session?.user?.email?.split('@')[0]}!</h3>
                  <p className="text-sm text-indigo-100">
                    Objetivo: {userProfile.goal === 'gain_mass' ? 'Ganhar Massa' : 'Perder Peso'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-2xl font-bold">{userProfile.weight}</p>
                  <p className="text-xs text-indigo-100">kg</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-2xl font-bold">{userProfile.height}</p>
                  <p className="text-xs text-indigo-100">cm</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-2xl font-bold">{userProfile.bmi}</p>
                  <p className="text-xs text-indigo-100">IMC</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Workout Plan */}
        {workoutPlan && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">Seu Plano de Treino</h2>
              <span className="text-sm text-blue-600 font-semibold">
                {Math.floor(workoutPlan.totalDuration / 60)} min
              </span>
            </div>
            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-xl mb-4">
              <h3 className="text-2xl font-bold mb-2">{workoutPlan.name}</h3>
              <p className="text-white/90 mb-4">
                {workoutPlan.exercises.length} exercícios personalizados para você
              </p>
              <button 
                onClick={() => startWorkout(workoutPlan.exercises[0], 0)}
                className="bg-white text-red-500 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg"
              >
                <Play className="w-5 h-5" />
                COMEÇAR TREINO
              </button>
            </div>

            {/* Exercise List */}
            <div className="space-y-3">
              {workoutPlan.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">{exercise.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Timer className="w-4 h-4" />
                          {exercise.duration}s
                        </span>
                        {exercise.reps && (
                          <span>{exercise.reps} reps</span>
                        )}
                        {exercise.sets && (
                          <span>{exercise.sets} séries</span>
                        )}
                      </div>
                      <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">
                        {exercise.category}
                      </span>
                    </div>
                    <button 
                      onClick={() => startWorkout(exercise, index)}
                      className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-md"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Categorias</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`bg-gradient-to-br ${category.color} text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <p className="text-sm font-semibold">{category.name}</p>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeTab === "home"
                ? "text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-semibold">Início</span>
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeTab === "discover"
                ? "text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Search className="w-6 h-6" />
            <span className="text-xs font-semibold">Descobrir</span>
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeTab === "stats"
                ? "text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-semibold">Progresso</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeTab === "settings"
                ? "text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-semibold">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
