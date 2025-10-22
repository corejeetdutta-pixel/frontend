import { FileText, Sparkles, UserCheck, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Post Your Role',
      description: 'Submit job requirements in minutes',
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      number: '2',
      title: 'AI Matches Candidates',
      description: 'Smart algorithms find perfect fits',
      icon: Sparkles,
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
    },
    {
      number: '3',
      title: 'Receive Shortlist',
      description: 'Get pre-screened top candidates',
      icon: UserCheck,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <section className="md:pl-24 md:pr-24 py-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">How It Works</h2>
          <p className="text-xs text-gray-600">
            Simple, fast, and effective hiring process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                <div
                  className={`${step.bgColor} rounded-xl p-4 h-full border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center shadow-md`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-700">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
