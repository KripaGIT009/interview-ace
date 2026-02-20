import { useState, useEffect } from 'react';
import axios from '@/lib/api';
import useToast from '@/hooks/useToast';

interface Subscription {
  tier: string;
  status: string;
  currentPeriodEnd: string | null;
}

const tiers = [
  {
    name: 'FREE',
    price: 0,
    features: [
      '5 practice questions per day',
      'Basic code feedback',
      'Community support',
      'Progress tracking'
    ]
  },
  {
    name: 'PRO',
    price: 29,
    features: [
      'Unlimited practice questions',
      'Advanced AI feedback with GPT-4',
      'Voice recording & transcription',
      'Detailed performance analytics',
      'Priority support',
      'Custom difficulty levels'
    ],
    popular: true
  },
  {
    name: 'ENTERPRISE',
    price: 99,
    features: [
      'Everything in Pro',
      'Company-specific questions',
      'Mock interview scheduling',
      'Personalized learning path',
      '1-on-1 mentorship sessions',
      'Team management dashboard',
      'API access'
    ]
  }
];

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingTier, setProcessingTier] = useState<string | null>(null);
  const { showToast, showConfirm } = useToast();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await axios.get('/payments/subscription');
      setSubscription(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      showToast('Failed to load subscription details. Please try again.', 'error');
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier: string) => {
    if (tier === 'FREE') return;
    
    setProcessingTier(tier);
    try {
      const response = await axios.post('/payments/checkout', {
        tier,
        successUrl: `${window.location.origin}/subscription?success=true`,
        cancelUrl: `${window.location.origin}/subscription?canceled=true`
      });

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      showToast('Failed to start checkout. Please try again.', 'error');
      setProcessingTier(null);
    }
  };

  const handleCancel = async () => {
    const shouldCancel = await showConfirm({
      title: 'Cancel subscription',
      message: 'Are you sure you want to cancel your subscription?',
      confirmLabel: 'Cancel subscription',
      cancelLabel: 'Keep subscription'
    });

    if (!shouldCancel) return;

    try {
      await axios.post('/payments/cancel');
      showToast('Subscription canceled successfully.', 'success');
      await fetchSubscription();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      showToast('Failed to cancel subscription. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">Upgrade your interview preparation with advanced AI features</p>
          {subscription && (
            <div className="mt-4">
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                Current Plan: {subscription.tier}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                tier.popular ? 'ring-2 ring-indigo-600 transform scale-105' : ''
              }`}
            >
              {tier.popular && (
                <div className="bg-indigo-600 text-white text-center py-2 font-semibold">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h2>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                {subscription?.tier === tier.name ? (
                  <div>
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                    {tier.name !== 'FREE' && (
                      <button
                        onClick={handleCancel}
                        className="w-full mt-3 px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(tier.name)}
                    disabled={processingTier === tier.name || tier.name === 'FREE'}
                    className={`w-full px-6 py-3 rounded-lg font-medium transition ${
                      tier.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {processingTier === tier.name ? 'Processing...' : tier.name === 'FREE' ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards through Stripe, including Visa, Mastercard, and American Express.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Is there a free trial?</h3>
              <p className="text-gray-600">The FREE plan is available permanently with limited features. You can upgrade to PRO or ENTERPRISE at any time.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 14-day money-back guarantee for all paid plans. Contact support for assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
