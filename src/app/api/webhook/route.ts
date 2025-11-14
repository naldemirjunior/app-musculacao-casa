import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Verificar se Stripe está configurado
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey || !webhookSecret) {
  console.warn('⚠️ Stripe não configurado. Webhook desabilitado.');
}

const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    // Verificar se Stripe está configurado
    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook não configurado' },
        { status: 503 }
      );
    }

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Assinatura ausente' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Erro ao verificar webhook:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Processar eventos do Stripe
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Pagamento concluído:', session.id);
        console.log('User ID:', session.metadata?.userId);
        
        // Aqui você pode:
        // 1. Atualizar banco de dados do usuário
        // 2. Enviar email de confirmação
        // 3. Ativar recursos premium
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        console.log('❌ Assinatura cancelada:', subscription.id);
        
        // Aqui você pode:
        // 1. Desativar recursos premium
        // 2. Enviar email de cancelamento
        break;

      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('⚠️ Pagamento falhou:', invoice.id);
        
        // Aqui você pode:
        // 1. Notificar usuário
        // 2. Suspender acesso premium
        break;

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}
