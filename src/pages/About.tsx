import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Eye, CheckCircle2, Users, Briefcase, TrendingUp, HeartHandshake } from 'lucide-react';
import BlurText from '@/src/components/BlurText';
import ChromaGrid from '@/src/components/ChromaGrid';
import { useModal } from '@/src/context/ModalContext';

const features = [
  {
    title: 'Client-Centered Approach',
    description: 'We prioritize your needs and offer customized solutions that align with your goals.',
    icon: Users,
    details: [
      'Personalized financial roadmaps.',
      'Regular portfolio reviews.',
      'Goal-based investment strategies.',
      'Dedicated relationship management.'
    ],
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Transparency & Trust',
    description: 'We maintain complete clarity in every process, ensuring you are informed and confident in your decisions.',
    icon: Shield,
    details: [
      'Clear fee structures with no hidden costs.',
      'Unbiased product recommendations.',
      'Regular performance reporting.',
      'Ethical advisory practices.'
    ],
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Professional Expertise',
    description: 'Our experienced team brings industry knowledge and financial insight to help you make smart choices.',
    icon: Briefcase,
    details: [
      'Certified financial planners.',
      'Deep market research capabilities.',
      'Decades of cumulative experience.',
      'Continuous professional development.'
    ],
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Long-Term Relationships',
    description: "We don't just offer services — we build lasting partnerships based on reliability and performance.",
    icon: HeartHandshake,
    details: [
      'Generational wealth planning.',
      'Consistent support through market cycles.',
      'Proactive financial adjustments.',
      'Trust-based advisory model.'
    ],
    color: 'bg-indigo-50 text-indigo-600'
  }
];

const offerings = [
  'Financial consulting and advisory services',
  'Loan assistance and funding solutions',
  'Investment guidance',
  'Risk management support',
  'Business financial solutions'
];

const commitments = [
  {
    title: 'Ethical Standards',
    description: 'Upholding the highest ethical standards in every transaction.',
    details: [
      'Full compliance with regulatory norms.',
      'Integrity in all client interactions.',
      'Confidentiality of client data.',
      'Honest disclosure of risks.'
    ]
  },
  {
    title: 'Honest Guidance',
    description: 'Providing accurate and honest financial guidance tailored to you.',
    details: [
      'Evidence-based recommendations.',
      'Realistic return expectations.',
      'Clear communication of terms.',
      'Focus on long-term value.'
    ]
  },
  {
    title: 'Efficient Service',
    description: 'Ensuring smooth and efficient service delivery for all clients.',
    details: [
      'Streamlined documentation processes.',
      'Quick response to queries.',
      'Digital-first service approach.',
      'Seamless transaction execution.'
    ]
  },
  {
    title: 'Continuous Support',
    description: 'Supporting clients at every step of their financial journey.',
    details: [
      'Ongoing market updates.',
      'Periodic strategy re-evaluations.',
      'Assistance during life transitions.',
      'Always accessible advisory team.'
    ]
  }
];

export default function About() {
  const { openConsultationModal } = useModal();
  return (
    <main className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
              >
                <Users className="w-3 h-3" />
                About BHP Finance
              </motion.div>
              <BlurText
                text="Welcome to BHP Finance"
                centered={false}
                className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6 text-lg text-slate-600 leading-relaxed"
              >
                <p>
                  At <span className="font-bold text-slate-900">BHP Finance</span>, we believe financial security is not just about money — it's about confidence, stability, and peace of mind. Our mission is to provide reliable, transparent, and customer-focused financial solutions that empower individuals, families, and businesses to achieve their goals.
                </p>
                <p>
                  Founded with a vision to simplify finance, BHP Finance has grown into a trusted name built on integrity, professionalism, and long-term relationships. We understand that every client's financial journey is unique, and we are committed to offering personalized guidance and tailored solutions that truly make a difference.
                </p>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="hidden lg:block relative"
            >
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1000&h=1000" 
                  alt="About BHP Finance" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-10 -right-10 bg-primary p-10 rounded-full shadow-2xl animate-pulse" />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mission & Vision */}
          <div className="space-y-8">
            <ChromaGrid 
              cols="grid-cols-1"
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
              items={[
                {
                  title: 'Our Mission',
                  description: 'To deliver accessible, ethical, and innovative financial services that help our clients grow, protect, and secure their financial future.',
                  icon: Target,
                  borderColor: '#3B82F6',
                  gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                },
                {
                  title: 'Our Vision',
                  description: 'To become a leading financial services provider known for trust, excellence, and customer satisfaction, while continuously adapting.',
                  icon: Eye,
                  borderColor: '#6366F1',
                  gradient: 'linear-gradient(145deg, #6366F1, #000)'
                }
              ]}
            />
          </div>

          {/* What We Offer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-slate-900 p-10 rounded-[2.5rem] shadow-2xl flex flex-col justify-between"
          >
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-slate-900" />
                What We Offer
              </h2>
              <p className="text-slate-800 mb-8">
                At BHP Finance, we provide a wide range of financial solutions designed to meet diverse needs, including:
              </p>
              <ul className="space-y-4">
                {offerings.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-slate-900 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-slate-800 group-hover:text-slate-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-12 text-sm text-slate-700 italic">
              Our team works closely with clients to understand their requirements and provide practical, result-driven strategies.
            </p>
          </motion.div>
        </div>

        {/* Why Choose Us */}
        <section className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Why Choose BHP Finance?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We combine expertise with a personal touch to ensure your financial success.</p>
          </div>
          <ChromaGrid 
            cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
            items={features.map(feature => ({
              title: feature.title,
              description: feature.description,
              icon: feature.icon,
              details: feature.details,
              borderColor: feature.color.includes('blue') ? '#3B82F6' : feature.color.includes('emerald') ? '#10B981' : feature.color.includes('amber') ? '#F59E0B' : '#6366F1',
              gradient: `linear-gradient(145deg, ${feature.color.includes('blue') ? '#3B82F6' : feature.color.includes('emerald') ? '#10B981' : feature.color.includes('amber') ? '#F59E0B' : '#6366F1'}, #000)`
            }))}
          />
        </section>

        {/* Commitment */}
        <section className="mt-24 bg-white p-12 rounded-[3rem] border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Commitment</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Your growth is our priority, and your success defines our achievement. At BHP Finance, we are committed to:
              </p>
              <ChromaGrid 
                cols="grid-cols-1 sm:grid-cols-2"
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
                items={commitments.map(item => ({
                  title: item.title,
                  description: item.description,
                  details: item.details,
                  borderColor: '#3B82F6',
                  gradient: 'linear-gradient(145deg, #3B82F6, #000)'
                }))}
              />
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[2.5rem] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800&h=800" 
                  alt="Commitment" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary p-8 rounded-3xl shadow-2xl max-w-xs">
                <p className="text-slate-900 font-bold text-lg leading-tight">
                  "Your Partner in Financial Growth and Security."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 text-center pb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Let's Build Your Financial Future Together</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-10 text-lg">
            Whether you are planning for personal milestones, expanding your business, or seeking financial stability, BHP Finance is here to guide you every step of the way.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openConsultationModal('Investment Planning')}
            className="bg-primary text-slate-900 px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30"
          >
            Get Started Now
          </motion.button>
        </section>
      </div>
    </main>
  );
}
