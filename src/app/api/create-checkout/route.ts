import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Verificar se Stripe está configurado
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('⚠️ STRIPE_SECRET_KEY não configurada. Sistema de pagamento desabilitado.');
}

const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    // Verificar se Stripe está configurado
    if (!stripe) {
      return NextResponse.json(
        { error: 'Sistema de pagamento não configurado. Configure as variáveis de ambiente do Stripe.' },
        { status: 503 }
      );
    }

    const { userId, userEmail } = await req.json();

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Dados do usuário são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'NAL - Plano Premium',
              description: 'Treinos ilimitados, vídeos HD e suporte prioritário',
              images: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'],
            },
            unit_amount: 2990, // R$ 29,90
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/?canceled=true`,
      customer_email: userEmail,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Erro ao criar checkout:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
