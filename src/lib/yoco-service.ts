import axios from 'axios';

export interface YocoPaymentRequest {
  amount: number;
  currency: 'ZAR';
  description: string;
  metadata?: Record<string, any>;
  redirectUrl?: string;
}

export interface YocoPaymentResponse {
  id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  description: string;
  redirectUrl?: string;
  metadata?: Record<string, any>;
}

export interface YocoChargeResponse {
  id: string;
  status: 'successful' | 'failed' | 'pending';
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
  createdDate: string;
}

export class YocoService {
  private apiKey: string;
  private baseUrl = 'https://api.yoco.com/v1';

  constructor() {
    this.apiKey = process.env.YOCO_SECRET_KEY || '';
    if (!this.apiKey) {
      throw new Error('YOCO_SECRET_KEY environment variable is required');
    }
  }

  /**
   * Create a payment request
   */
  async createPayment(request: YocoPaymentRequest): Promise<YocoPaymentResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/checkouts`,
        {
          amount: request.amount,
          currency: request.currency,
          description: request.description,
          metadata: request.metadata,
          redirectUrl: request.redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        id: response.data.id,
        status: response.data.status,
        amount: response.data.amount,
        currency: response.data.currency,
        description: response.data.description,
        redirectUrl: response.data.redirectUrl,
        metadata: response.data.metadata
      };
    } catch (error) {
      console.error('Yoco payment creation error:', error);
      throw new Error('Failed to create payment request');
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<YocoPaymentResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/checkouts/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return {
        id: response.data.id,
        status: response.data.status,
        amount: response.data.amount,
        currency: response.data.currency,
        description: response.data.description,
        redirectUrl: response.data.redirectUrl,
        metadata: response.data.metadata
      };
    } catch (error) {
      console.error('Yoco payment status error:', error);
      throw new Error('Failed to get payment status');
    }
  }

  /**
   * Get charge details
   */
  async getCharge(chargeId: string): Promise<YocoChargeResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/charges/${chargeId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return {
        id: response.data.id,
        status: response.data.status,
        amount: response.data.amount,
        currency: response.data.currency,
        description: response.data.description,
        metadata: response.data.metadata,
        createdDate: response.data.createdDate
      };
    } catch (error) {
      console.error('Yoco charge retrieval error:', error);
      throw new Error('Failed to get charge details');
    }
  }

  /**
   * Process webhook from Yoco
   */
  async processWebhook(payload: any, signature: string): Promise<boolean> {
    try {
      // Verify webhook signature (implement signature verification)
      // This is a simplified version - in production, implement proper signature verification

      const event = payload;

      if (event.type === 'checkout.completed') {
        // Payment was successful
        const paymentId = event.data.id;
        const chargeId = event.data.charge;

        // Update payment status in database
        // This would typically trigger credit allocation

        return true;
      }

      return false;
    } catch (error) {
      console.error('Yoco webhook processing error:', error);
      return false;
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(chargeId: string, amount?: number): Promise<any> {
    try {
      const refundData: any = {};
      if (amount) {
        refundData.amount = amount;
      }

      const response = await axios.post(
        `${this.baseUrl}/charges/${chargeId}/refunds`,
        refundData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Yoco refund error:', error);
      throw new Error('Failed to process refund');
    }
  }

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(payload: string, signature: string): boolean {
    // Implement webhook signature validation
    // This should use HMAC-SHA256 with your webhook secret
    return true; // Placeholder - implement proper validation
  }
}

// Export singleton instance
export const yocoService = new YocoService();