export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // Monthly price in ZAR
  credits: number;
  features: string[];
  limits: {
    descriptions: number; // -1 for unlimited
    templates: number; // -1 for unlimited
    images: number; // -1 for unlimited
  };
  popular?: boolean;
  description: string;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 5,
    description: 'Perfect for trying out PropertyPro',
    features: [
      '5 AI-generated descriptions',
      'Basic property templates',
      'Community support',
      'Standard features'
    ],
    limits: {
      descriptions: 5,
      templates: 2,
      images: 10
    }
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 299, // R299/month
    credits: 100,
    description: 'Great for individual agents',
    features: [
      '100 AI-generated descriptions',
      'Premium templates access',
      'Email support',
      'Advanced AI features',
      'Basic analytics'
    ],
    limits: {
      descriptions: 100,
      templates: 10,
      images: 50
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 799, // R799/month
    credits: 500,
    description: 'Ideal for growing agencies',
    features: [
      '500 AI-generated descriptions',
      'Unlimited premium templates',
      'Priority support',
      'Property24 integration',
      'Advanced analytics',
      'Custom branding',
      'Team collaboration'
    ],
    limits: {
      descriptions: 500,
      templates: 50,
      images: 200
    },
    popular: true
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 1999, // R1999/month
    credits: 2000,
    description: 'For large real estate businesses',
    features: [
      'Unlimited AI descriptions',
      'White-label solution',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
      'Advanced reporting',
      'Multi-agency support',
      'Custom training'
    ],
    limits: {
      descriptions: -1, // Unlimited
      templates: -1, // Unlimited
      images: -1 // Unlimited
    }
  }
};

export const CREDIT_PACKAGES = [
  {
    id: 'credit_50',
    name: '50 Credits',
    credits: 50,
    price: 99, // R99
    description: 'Perfect for occasional use'
  },
  {
    id: 'credit_200',
    name: '200 Credits',
    credits: 200,
    price: 349, // R349
    description: 'Great value for regular users',
    popular: true
  },
  {
    id: 'credit_500',
    name: '500 Credits',
    credits: 500,
    price: 799, // R799
    description: 'Best for power users'
  },
  {
    id: 'credit_1000',
    name: '1000 Credits',
    credits: 1000,
    price: 1499, // R1499
    description: 'Maximum value package'
  }
];

export function getPlanById(planId: string): SubscriptionPlan | null {
  return SUBSCRIPTION_PLANS[planId] || null;
}

export function getCreditPackageById(packageId: string) {
  return CREDIT_PACKAGES.find(pkg => pkg.id === packageId);
}

export function calculateCreditsNeeded(
  descriptions: number = 0,
  templates: number = 0,
  images: number = 0
): number {
  // Each description costs 1 credit
  // Each template costs 2 credits
  // Each image costs 0.5 credits
  return descriptions + (templates * 2) + Math.ceil(images * 0.5);
}

export function canUserPerformAction(
  userCredits: number,
  action: 'description' | 'template' | 'image',
  planLimits?: SubscriptionPlan['limits']
): boolean {
  // Check plan limits first
  if (planLimits) {
    switch (action) {
      case 'description':
        if (planLimits.descriptions !== -1 && planLimits.descriptions <= 0) return false;
        break;
      case 'template':
        if (planLimits.templates !== -1 && planLimits.templates <= 0) return false;
        break;
      case 'image':
        if (planLimits.images !== -1 && planLimits.images <= 0) return false;
        break;
    }
  }

  // Check credits
  const creditCost = action === 'template' ? 2 : action === 'image' ? 1 : 1;
  return userCredits >= creditCost;
}

export function deductCredits(
  userCredits: number,
  action: 'description' | 'template' | 'image'
): number {
  const creditCost = action === 'template' ? 2 : action === 'image' ? 1 : 1;
  return Math.max(0, userCredits - creditCost);
}