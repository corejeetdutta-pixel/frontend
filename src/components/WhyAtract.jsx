import { BrainCircuit, UserCheck, Search, Check, ArrowRight, Users, ShieldCheck } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

const aiMatchingImg = 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
const humanExpertiseImg = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80';
const processImg = 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const WhyAtract = ({ onGetStarted }) => {
  const features = [
    {
      title: 'AI-Powered Intelligence',
      description: 'Advanced algorithms analyze thousands of data points to identify the perfect candidates for your specific requirements.',
      icon: <BrainCircuit className="w-6 h-6" />,
      image: aiMatchingImg,
      stats: [
        { value: '3x', label: 'Faster Hiring' },
        { value: '95%', label: 'Success Rate' },
      ]
    },
    {
      title: 'Human Expertise',
      description: 'Our seasoned recruitment specialists provide the human insight needed to evaluate cultural fit and soft skills.',
      icon: <UserCheck className="w-6 h-6" />,
      image: humanExpertiseImg,
      stats: [
        { value: '10+', label: 'Years Experience' },
        { value: '500+', label: 'Companies Served' },
      ]
    }
  ];

  const processSteps = [
    { title: 'Smart Sourcing', description: 'Our AI scans multiple platforms to identify top talent', icon: <Search className="w-5 h-5" /> },
    { title: 'Intelligent Screening', description: 'Automated assessments to shortlist qualified candidates', icon: <ShieldCheck className="w-5 h-5" /> },
    { title: 'Expert Evaluation', description: 'In-depth interviews by recruitment specialists', icon: <Users className="w-5 h-5" /> },
    { title: 'Perfect Match', description: 'Presenting candidates that truly fit your needs', icon: <Check className="w-5 h-5" /> },
  ];

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-20 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-full mb-6 border border-blue-100">
            The Future of Recruitment
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Intelligent Hiring Powered by <span className="text-blue-600">AI and Expert Insight</span>
          </h2>
          <p className="text-xl text-gray-600">
            Combining cutting-edge artificial intelligence with deep human expertise to transform your hiring process and deliver exceptional talent.
          </p>
        </motion.div>

        {/* Features */}
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 mb-24`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="w-full md:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-auto object-cover rounded-2xl transform transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-blue-100">{feature.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg">
                <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <div className="flex space-x-6">
                  {feature.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Process Section */}
        <motion.div
          className="relative bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 md:p-12 shadow-xl border border-blue-100 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>

          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Seamless Hiring Process</h3>
            <p className="text-gray-600">
              A perfect blend of technology and human expertise to deliver exceptional recruitment results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="h-full bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {step.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                  <div className="mt-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="relative rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={processImg} 
              alt="Hiring Process"
              className="w-full h-auto object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Ready to Transform Your Hiring?</h3>
                <p className="text-blue-100 mb-6 max-w-lg">Experience the power of AI-driven recruitment combined with human expertise.</p>
                <button
                  onClick={onGetStarted} // scroll to ChoosePortal
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyAtract;
