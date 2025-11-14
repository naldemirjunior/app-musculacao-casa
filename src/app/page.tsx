"use client";

import { useState } from "react";
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
  Star
} from "lucide-react";

export default function NalApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium" | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [weekProgress, setWeekProgress] = useState([true, true, false, false, false, false, false]);

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
      question: "Quais tipos de treino você prefere?",
      options: ["Treinos de força", "Treinos de resistência", "Treinos de flexibilidade", "Treinos de alta intensidade"]
    },
    {
      id: 4,
      question: "Você possui algum equipamento de treino em casa?",
      options: ["Sim, tenho equipamentos", "Não, apenas peso corporal", "Tenho alguns acessórios básicos"]
    },
    {
      id: 5,
      question: "Qual é a sua faixa etária?",
      options: ["Menos de 18 anos", "18-24 anos", "25-34 anos", "35-44 anos", "45-54 anos", "55 anos ou mais"]
    },
    {
      id: 6,
      question: "Você gostaria de receber notificações de lembrete para treinos?",
      options: ["Sim, diariamente", "Sim, algumas vezes por semana", "Não, prefiro treinar no meu ritmo"]
    },
    {
      id: 7,
      question: "Quais funcionalidades você gostaria de ver no app?",
      options: ["Vídeos de instrução", "Planos de treino personalizados", "Monitoramento de progresso", "Comunidade de usuários"]
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
    setShowQuestionnaire(false);
    setShowPricingPlans(true);
  };

  const handleSelectPlan = (plan: "free" | "premium") => {
    setSelectedPlan(plan);
    setTimeout(() => {
      setShowPricingPlans(false);
    }, 500);
  };

  const categories = [
    { name: "Abdômen", icon: "💪", color: "from-blue-400 to-blue-600" },
    { name: "Braço", icon: "💪", color: "from-purple-400 to-purple-600" },
    { name: "Peito", icon: "🏋️", color: "from-red-400 to-red-600" },
    { name: "Perna", icon: "🦵", color: "from-green-400 to-green-600" },
    { name: "Ombro", icon: "💪", color: "from-orange-400 to-orange-600" },
    { name: "Costas", icon: "🏋️", color: "from-cyan-400 to-cyan-600" },
  ];

  const workouts = [
    {
      title: "Treino Completo",
      duration: "15 min",
      exercises: 12,
      level: "Intermediário",
      image: "🏋️‍♂️",
      isPremium: false
    },
    {
      title: "Abdômen Definido",
      duration: "10 min",
      exercises: 8,
      level: "Iniciante",
      image: "💪",
      isPremium: false
    },
    {
      title: "Braços Fortes",
      duration: "12 min",
      exercises: 10,
      level: "Avançado",
      image: "💪",
      isPremium: true
    },
  ];

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
            <p className="text-gray-600">Comece grátis ou desbloqueie todo o potencial</p>
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
                  <span className="text-gray-700">Acesso a treinos básicos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">3 categorias de exercícios</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Acompanhamento semanal</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">Treinos personalizados</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">Vídeos de instrução completos</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">Suporte prioritário</span>
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
              {/* Popular Badge */}
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3" />
                POPULAR
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
                  <Check className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Tudo do plano gratuito</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Treinos personalizados ilimitados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Vídeos HD com instruções detalhadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Todas as categorias desbloqueadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Relatórios avançados de progresso</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Suporte prioritário 24/7</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Acesso a desafios exclusivos</span>
                </li>
              </ul>

              <button
                onClick={() => handleSelectPlan("premium")}
                className="w-full py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                COMEÇAR PREMIUM
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="text-center text-sm text-gray-500">
            <p>✓ Sem compromisso • ✓ Cancele quando quiser • ✓ Garantia de 7 dias</p>
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

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Dumbbell className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">NAL</h1>
            </div>
            <p className="text-gray-600">Vamos personalizar sua experiência</p>
          </div>

          {/* Progress Bar */}
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

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => {
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
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Voltar
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

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentQuestion
                    ? "w-8 bg-blue-600"
                    : index < currentQuestion
                    ? "w-2 bg-blue-400"
                    : "w-2 bg-gray-300"
                }`}
              ></div>
            ))}
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
            <h1 className="text-2xl font-bold">NAL</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center gap-1 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
              <Crown className="w-4 h-4" />
              {selectedPlan === "premium" ? "PRO" : "FREE"}
            </button>
          </div>
        </div>
        
        <p className="text-blue-100 text-sm mb-3">Seu Personal</p>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar treinos e planos"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* Premium Upgrade Banner (only for free users) */}
        {selectedPlan === "free" && (
          <section className="mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 text-9xl opacity-10">👑</div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-6 h-6" />
                  <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                    Premium
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Desbloqueie todo o potencial</h3>
                <p className="text-white/90 mb-4 text-sm">
                  Treinos personalizados, vídeos HD e muito mais por apenas R$ 29,90/mês
                </p>
                <button 
                  onClick={() => setShowPricingPlans(true)}
                  className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg"
                >
                  FAZER UPGRADE
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Weekly Goal */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">Meta Semanal</h2>
            <span className="text-sm text-blue-600 font-semibold">2/7 dias</span>
          </div>
          <div className="flex gap-2">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
              <div
                key={index}
                className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                  weekProgress[index]
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <span className="text-xs font-semibold">{day}</span>
                {weekProgress[index] && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>}
              </div>
            ))}
          </div>
        </section>

        {/* Featured Challenge */}
        <section className="mb-6">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 text-9xl opacity-10">🔥</div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-6 h-6" />
                <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                  Desafio
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Desafio 30 Dias</h3>
              <p className="text-white/90 mb-4">Transforme seu corpo em 1 mês</p>
              <button className="bg-white text-red-500 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg">
                COMEÇAR
                <Play className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

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

        {/* Recommended Workouts */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">Só para você</h2>
            <button className="text-blue-600 text-sm font-semibold flex items-center gap-1">
              Mais
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {workouts.map((workout, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all relative"
              >
                {workout.isPremium && selectedPlan === "free" && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    PRO
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-3xl shadow-md">
                    {workout.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{workout.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        {workout.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {workout.exercises} exercícios
                      </span>
                    </div>
                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">
                      {workout.level}
                    </span>
                  </div>
                  <button 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                      workout.isPremium && selectedPlan === "free"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    disabled={workout.isPremium && selectedPlan === "free"}
                  >
                    <Play className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Workout Card */}
        <section className="mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-6 h-6" />
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                Personalizado
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">Crie o seu próprio treino</h3>
            <p className="text-white/90 mb-4 text-sm">
              Monte um treino personalizado com os exercícios que você mais gosta
            </p>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg">
              CRIAR AGORA
            </button>
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
            <span className="text-xs font-semibold">Relatório</span>
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
            <span className="text-xs font-semibold">Definição</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
