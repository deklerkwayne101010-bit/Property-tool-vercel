'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  required?: boolean;
}

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [userPreferences, setUserPreferences] = useState({
    role: '',
    experience: '',
    goals: [] as string[],
    notifications: true,
    marketingEmails: false
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user has already completed onboarding
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted === 'true') {
      router.push('/dashboard');
      return;
    }

    // Load any saved progress
    const savedProgress = localStorage.getItem('onboardingProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCompletedSteps(new Set(progress.completedSteps));
      setUserPreferences(progress.preferences);
      setCurrentStep(progress.currentStep);
    }
  }, [router]);

  const saveProgress = () => {
    const progress = {
      currentStep,
      completedSteps: Array.from(completedSteps),
      preferences: userPreferences
    };
    localStorage.setItem('onboardingProgress', JSON.stringify(progress));
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    localStorage.removeItem('onboardingProgress');
    router.push('/dashboard');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      saveProgress();
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      saveProgress();
    }
  };

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to PropertyPro! 🎉',
      description: 'Your complete property marketing solution',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">🏠</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to PropertyPro!</h2>
            <p className="text-gray-600 mb-6">
              We're excited to help you enhance your property marketing workflow with AI-powered tools,
              web scraping, and professional templates tailored for the South African market.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 text-xl mb-2">🕷️</div>
                <div className="font-medium text-blue-900">Smart Scraping</div>
                <div className="text-sm text-blue-700">Extract data from property websites automatically</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-purple-600 text-xl mb-2">🎨</div>
                <div className="font-medium text-purple-900">Template Editor</div>
                <div className="text-sm text-purple-700">Create stunning marketing materials</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-green-600 text-xl mb-2">🤖</div>
                <div className="font-medium text-green-900">AI Generation</div>
                <div className="text-sm text-green-700">Generate compelling property descriptions</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'role',
      title: 'Tell us about yourself',
      description: 'Help us customize your experience',
      required: true,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What is your role in property?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Estate Agent',
                'Property Developer',
                'Property Manager',
                'Real Estate Investor',
                'Marketing Professional',
                'Property Photographer',
                'Other'
              ].map((role) => (
                <button
                  key={role}
                  onClick={() => setUserPreferences(prev => ({ ...prev, role }))}
                  className={`p-3 text-left border rounded-lg hover:border-blue-500 transition-colors ${
                    userPreferences.role === role
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How experienced are you with property marketing?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'beginner', label: 'Beginner', desc: 'New to property marketing' },
                { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
                { value: 'expert', label: 'Expert', desc: 'Very experienced' }
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => setUserPreferences(prev => ({ ...prev, experience: level.value }))}
                  className={`p-4 text-left border rounded-lg hover:border-blue-500 transition-colors ${
                    userPreferences.experience === level.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm text-gray-600">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'What are your goals?',
      description: 'Help us prioritize features for you',
      required: true,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What would you like to achieve with PropertyPro? (Select all that apply)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Generate property descriptions faster',
                'Create professional marketing materials',
                'Extract data from property websites',
                'Manage client relationships better',
                'Automate repetitive marketing tasks',
                'Improve SEO for property listings',
                'Create social media content',
                'Track marketing campaign performance'
              ].map((goal) => {
                const isSelected = userPreferences.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => {
                      setUserPreferences(prev => ({
                        ...prev,
                        goals: isSelected
                          ? prev.goals.filter(g => g !== goal)
                          : [...prev.goals, goal]
                      }));
                    }}
                    className={`p-3 text-left border rounded-lg hover:border-blue-500 transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 border-2 rounded mr-3 ${
                        isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                      </div>
                      <span className="text-sm">{goal}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'preferences',
      title: 'Customize your experience',
      description: 'Set your preferences for notifications and communication',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Email Notifications</div>
                <div className="text-sm text-gray-600">Receive updates about your account and new features</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPreferences.notifications}
                  onChange={(e) => setUserPreferences(prev => ({
                    ...prev,
                    notifications: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Marketing Emails</div>
                <div className="text-sm text-gray-600">Receive tips, tutorials, and promotional content</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPreferences.marketingEmails}
                  onChange={(e) => setUserPreferences(prev => ({
                    ...prev,
                    marketingEmails: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-blue-600 text-xl mr-3">💡</div>
              <div>
                <div className="font-medium text-blue-900 mb-1">Pro Tip</div>
                <div className="text-sm text-blue-700">
                  You can change these preferences anytime in your account settings.
                  We respect your privacy and will never spam you with unwanted emails.
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'getting-started',
      title: 'Getting Started Guide',
      description: 'Your first steps with PropertyPro',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">You're all set!</h3>
            <p className="text-gray-600">
              Here's how to make the most of PropertyPro in your first few days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">1️⃣</span>
                  <span className="font-medium text-gray-900">Explore the Dashboard</span>
                </div>
                <p className="text-sm text-gray-600">
                  Get familiar with your main dashboard and quick action buttons.
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">2️⃣</span>
                  <span className="font-medium text-gray-900">Try Web Scraping</span>
                </div>
                <p className="text-sm text-gray-600">
                  Scrape property data from websites to see how it works.
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">3️⃣</span>
                  <span className="font-medium text-gray-900">Create Your First Template</span>
                </div>
                <p className="text-sm text-gray-600">
                  Use our template editor to create a custom marketing template.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">4️⃣</span>
                  <span className="font-medium text-gray-900">Generate AI Descriptions</span>
                </div>
                <p className="text-sm text-gray-600">
                  Try our AI-powered property description generator.
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">5️⃣</span>
                  <span className="font-medium text-gray-900">Explore Templates</span>
                </div>
                <p className="text-sm text-gray-600">
                  Browse our library of pre-made South African property templates.
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">6️⃣</span>
                  <span className="font-medium text-gray-900">Connect with Support</span>
                </div>
                <p className="text-sm text-gray-600">
                  Have questions? Our support team is here to help.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 text-center">
            <h4 className="font-semibold text-gray-900 mb-2">Ready to start your property marketing journey?</h4>
            <p className="text-gray-600 mb-4">
              Click "Complete Setup" to access your personalized PropertyPro dashboard.
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h1>
            <p className="text-gray-600">
              {currentStepData.description}
            </p>
          </div>

          <div className="mb-8">
            {currentStepData.content}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="flex space-x-3">
              {currentStep < steps.length - 1 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    markStepComplete(currentStepData.id);
                    nextStep();
                  }}
                >
                  Skip for now
                </Button>
              )}

              <Button
                onClick={() => {
                  markStepComplete(currentStepData.id);
                  nextStep();
                }}
                disabled={
                  currentStepData.required &&
                  ((currentStepData.id === 'role' && !userPreferences.role) ||
                   (currentStepData.id === 'goals' && userPreferences.goals.length === 0))
                }
              >
                {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Step Indicators */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full ${
                  index < currentStep
                    ? 'bg-blue-600'
                    : index === currentStep
                    ? 'bg-blue-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}