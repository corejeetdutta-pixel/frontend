import { Search, Users, Zap, ArrowRight, Check, Play } from 'lucide-react';
import React from 'react';

export default function Hero({ onPostRoleClick }) {
  const features = [
    { text: 'AI-powered candidate matching', icon: <Search className="w-5 h-5 text-blue-600" /> },
    { text: 'Expert human review', icon: <Users className="w-5 h-5 text-blue-600" /> },
    { text: '3x faster hiring', icon: <Zap className="w-5 h-5 text-blue-600" /> },
  ];


  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <span className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-full mb-6">
              Trusted by 500+ companies
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Revolutionize Your Hiring with <span className="text-blue-600">AI for Superior Results</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The AI-powered recruitment platform that delivers pre-vetted candidates in days, not weeks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <button
                onClick={onPostRoleClick}
                className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <span>Post Your First Role</span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

            </div>

          </div>

          {/* Right content - Dashboard Preview */}
          <div className="relative
            before:absolute before:-inset-4 before:bg-gradient-to-br before:from-blue-50 before:to-blue-100 before:rounded-2xl before:opacity-70 before:-z-10
            after:absolute after:-inset-6 after:bg-gradient-to-br after:from-blue-100 after:to-blue-50 after:rounded-3xl after:opacity-50 after:-z-20
          ">
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              {/* Dashboard header */}
              <div className="p-4 border-b border-gray-100 bg-white">
                <div className="flex items-center">
                  <div className="flex space-x-1.5 mr-3">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-sm font-medium text-gray-500">Candidate Dashboard</div>
                </div>
              </div>
              
              {/* Dashboard content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Matching Candidates</h3>
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">12 New Matches</span>
                </div>

                {/* Candidate cards */}
                <div className="space-y-4">
                  {['Perfect Match', 'Strong Fit', 'Good Fit'].map((matchType, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow duration-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">Senior Frontend Developer</h4>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-500">{index + 3} new candidates</p>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              matchType === 'Perfect Match' 
                                ? 'bg-green-100 text-green-800' 
                                : matchType === 'Strong Fit'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {matchType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating element */}
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature list */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="group p-6 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-200">
                {feature.icon}
              </div>
              <p className="text-gray-700 font-medium">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


