import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section id="contact" className="relative py-28 px-6 md:px-12 bg-gradient-to-b from-[#0A0A0A] via-[#141414] to-[#F0EEE8] text-[#E8E6E0] overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-12 text-center">
        
        {/* Centered Large Two-Line Display Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tight text-[#E8E6E0] uppercase leading-[0.9]">
            LET'S MAKE <br />
            <span className="text-white/40">IT HAPPEN</span>
          </h2>
        </motion.div>

        {/* Centered Glass Form Card (Elevated Glass Recipe - Section 3.5) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pt-4 flex justify-center"
        >
          <GlassCard
            variant="elevated"
            className="w-full max-w-xl p-8 sm:p-10 text-left space-y-6 border-white/15"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-display font-bold text-white">
                Have a project in mind?
              </h3>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#888888]">
                DIRECT INQUIRY
              </span>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-display font-bold text-white">
                  Message Sent Successfully
                </h4>
                <p className="text-xs font-mono text-[#888888] max-w-sm mx-auto">
                  Thank you for reaching out. I've received your details and will reply within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="text-xs font-mono uppercase text-emerald-400 hover:underline pt-2 inline-block cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Your Name */}
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-xs font-mono uppercase text-[#888888] block">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-[#0A0A0A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-[#555555] focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* Your Email Address */}
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-xs font-mono uppercase text-[#888888] block">
                    Your Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sarah@enterprise.com"
                    className="w-full bg-[#0A0A0A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-[#555555] focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* Tell me about your business or project */}
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-xs font-mono uppercase text-[#888888] block">
                    Tell me about your business or project
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Project scope, timeline, stack preferences, or core goals..."
                    className="w-full bg-[#0A0A0A]/80 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-[#555555] focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                </div>

                {/* Full-Width Light Pill Button: Get a Quote */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-full bg-[#F0EEE8] hover:bg-white text-[#111111] font-mono text-sm uppercase font-bold tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Sending Inquiry...</span>
                  ) : (
                    <>
                      <span>Get a Quote</span>
                      <ArrowUpRight className="w-4 h-4 text-[#111111]" />
                    </>
                  )}
                </button>

              </form>
            )}
          </GlassCard>
        </motion.div>

      </div>
    </section>
  );
};
