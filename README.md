# 💪 NAL - Seu Personal em Casa

**App de treinos personalizados com IA, pagamentos integrados e autenticação completa**

---

## 🎯 Funcionalidades

✅ **Autenticação Completa**
- Login com Email/Senha
- Login com Facebook (OAuth)
- Sessões persistentes com Supabase

✅ **Treinos Personalizados**
- Questionário inteligente (altura, peso, objetivos)
- Cálculo automático de IMC
- 14 exercícios diferentes (Abdômen, Braço, Peito, Perna, Ombro, Costas)
- Planos adaptados ao seu objetivo (ganho de massa, perda de peso, manutenção)

✅ **Sistema de Pagamento**
- Plano Gratuito (4 exercícios por treino)
- Plano Premium (R$ 29,90/mês - treinos ilimitados)
- Integração com Stripe
- Checkout seguro e webhook automático

✅ **Experiência Premium**
- Instruções por voz em português (Web Speech API)
- Timer visual com círculo animado
- Controle de séries e descanso
- Interface responsiva e moderna

---

## 🚀 Como Usar

### 1️⃣ **Configurar Supabase**

1. Acesse [supabase.com](https://supabase.com) e crie um projeto gratuito
2. No dashboard, vá em **Settings → API**
3. Copie a **URL do projeto** e a **anon/public key**
4. Configure no arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

5. **Configurar OAuth do Facebook** (opcional):
   - No Supabase: **Authentication → Providers → Facebook**
   - Adicione App ID e App Secret do Facebook
   - Configure URL de callback: `https://seu-projeto.supabase.co/auth/v1/callback`

---

### 2️⃣ **Configurar Stripe (Opcional - para pagamentos)**

1. Acesse [stripe.com](https://stripe.com) e crie uma conta
2. No dashboard, vá em **Developers → API Keys**
3. Copie as chaves e adicione no `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. **Configurar Webhook**:
   - No Stripe: **Developers → Webhooks → Add endpoint**
   - URL: `https://seu-dominio.vercel.app/api/webhook`
   - Eventos: `checkout.session.completed`

---

### 3️⃣ **Deploy na Vercel**

#### **Opção A: Via GitHub (Recomendado)**

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com) e conecte seu repositório
3. Configure as variáveis de ambiente no painel da Vercel
4. Deploy automático! 🎉

#### **Opção B: Via CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel

# Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET

# Deploy em produção
vercel --prod
```

---

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Iniciar servidor de desenvolvimento
npm run dev

# Abrir no navegador
# http://localhost:3000
```

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx                    # Página principal do app
│   ├── api/
│   │   ├── create-checkout/        # API de checkout Stripe
│   │   └── webhook/                # Webhook Stripe
├── lib/
│   ├── supabase.ts                 # Cliente Supabase
│   └── workout-generator.ts        # Gerador de treinos
├── types/
│   └── workout.ts                  # Tipos TypeScript
```

---

## 🎨 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **Supabase** - Autenticação e banco de dados
- **Stripe** - Pagamentos
- **Lucide Icons** - Ícones modernos
- **Web Speech API** - Instruções por voz

---

## 🔐 Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Sim | Chave pública do Supabase |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ⚠️ Opcional | Chave pública do Stripe |
| `STRIPE_SECRET_KEY` | ⚠️ Opcional | Chave secreta do Stripe |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ Opcional | Secret do webhook Stripe |

**Nota:** O app funciona sem Stripe (apenas plano gratuito). Configure apenas se quiser ativar pagamentos.

---

## 💡 Dicas

### **Sistema de Pagamento**
- O app detecta automaticamente se o Stripe está configurado
- Sem Stripe: apenas plano gratuito disponível
- Com Stripe: planos gratuito e premium funcionais

### **Autenticação**
- Login com Facebook requer configuração no Supabase
- Email/senha funciona imediatamente após configurar Supabase
- Perfis são salvos localmente (localStorage)

### **Treinos**
- Plano gratuito: 4 exercícios por treino
- Plano premium: 6+ exercícios por treino
- Instruções por voz em português (funciona em navegadores modernos)

---

## 🐛 Troubleshooting

### **"Configuração Necessária" aparece na tela**
- Verifique se configurou `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Reinicie o servidor: `npm run dev`

### **Login com Facebook não funciona**
- Configure OAuth no Supabase (Authentication → Providers → Facebook)
- Adicione App ID e App Secret do Facebook
- Configure URL de callback correta

### **Pagamento não funciona**
- Verifique se configurou todas as variáveis do Stripe
- Teste com cartões de teste do Stripe: `4242 4242 4242 4242`
- Verifique webhook no dashboard do Stripe

---

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar!

---

## 🤝 Suporte

Precisa de ajuda? Entre em contato ou abra uma issue no GitHub!

**Desenvolvido com ❤️ para transformar sua rotina de treinos**
