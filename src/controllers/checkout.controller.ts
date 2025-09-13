/* eslint-disable */
import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
});

interface CheckoutItem {
  priceId: string;
  quantity: number;
}

interface CheckoutRequest {
  items: CheckoutItem[];
}

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items }: CheckoutRequest = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Items array is required and cannot be empty',
      });
      return;
    }

    // Validate each item
    for (const item of items) {
      if (!item.priceId || typeof item.priceId !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Each item must have a valid priceId',
        });
        return;
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        res.status(400).json({
          success: false,
          message: 'Each item must have a valid quantity greater than 0',
        });
        return;
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      mode: 'payment',
              success_url: `${process.env.FRONTEND_URL || 'https://nidas-payment.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'https://nidas-payment.vercel.app'}/cancel`,
    });

    res.status(200).json({
      success: true,
      message: 'Checkout session created successfully',
      data: {
        url: session.url,
      },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);

    if (error instanceof Stripe.errors.StripeError) {
      res.status(400).json({
        success: false,
        message: 'Stripe error occurred',
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
};
