import { useState, useRef, forwardRef } from 'react';
import {
  ArrowRight,
  Clock,
  DollarSign,
  Shield,
  Users,
  Zap,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  UserCheck,
  FileCheck,
  Award,
  Star
} from 'lucide-react';

const talentCategories = [
  { title: 'Graphic Designers', tools: ['Figma', 'Photoshop', 'Illustrator', 'After Effects'] },
  { title: 'Motion Designers', tools: ['After Effects', 'Premiere', 'Cinema 4D', 'Blender'] },
  { title: 'UI/UX Designers', tools: ['Figma', 'Sketch', 'Adobe XD', 'Framer'] },
  { title: 'Frontend Developers', tools: ['React', 'Vue', 'TypeScript', 'Tailwind'] },
  { title: 'Backend Developers', tools: ['Node.js', 'Python', 'PostgreSQL', 'AWS'] },
  { title: 'Full Stack Developers', tools: ['React', 'Node.js', 'MongoDB', 'Docker'] },
  { title: 'Video Editors', tools: ['Premiere', 'Final Cut Pro', 'DaVinci', 'After Effects'] },
  { title: 'Brand Designers', tools: ['Illustrator', 'InDesign', 'Photoshop', 'Figma'] },
  { title: '3D Artists', tools: ['Blender', 'Cinema 4D', 'Maya', 'ZBrush'] },
  { title: 'Social Media Managers', tools: ['Hootsuite', 'Buffer', 'Canva', 'Analytics'] },
];

const advantages = [
  {
    icon: Clock,
    title: 'Hire within days.',
    description: 'We maintain a bench of pre-vetted creative and technical talent ready to be trained and placed within 14 days.',
  },
  {
    icon: DollarSign,
    title: 'Save 60-70% on costs.',
    description: 'Hiring the best global talent unlocks cost savings of 70% on average when compared to US-based equivalents.',
  },
  {
    icon: GraduationCap,
    title: 'Expertly trained.',
    description: 'Every team member you hire is rigorously trained to deliver work of the highest quality while following your process.',
  },
  {
    icon: Shield,
    title: 'Fully managed.',
    description: 'We handle performance management, communication, payroll, benefits, and compliance so you can focus on growth.',
  },
];

const stats = [
  { value: '3%', label: 'Acceptance rate for Optal talent' },
  { value: '70%', label: 'Average savings on salaries' },
  { value: '14d', label: 'Avg time to placement' },
];

const vettingSteps = [
  { stage: 'Initial Screening', percentage: 40, description: 'Portfolio & experience review' },
  { stage: 'Soft Skills & English', percentage: 18, description: 'Communication assessment' },
  { stage: 'Technical Interviews', percentage: 10, description: 'Domain expertise evaluation' },
  { stage: 'Real-world Projects', percentage: 5, description: 'Practical skill demonstration' },
  { stage: 'Final Interviews', percentage: 3, description: 'Culture & fit assessment' },
];

const processSteps = [
  {
    number: '01',
    title: 'Discovery Call',
    description: 'We work to understand your hiring goals and identify where your team needs the most support. Together we outline a plan for embedded talent, placement timeline, and your needs for a perfect fit.',
  },
  {
    number: '02',
    title: 'Training & Selection',
    description: 'Optal selects and shares the perfect fit from our pool of pre-vetted candidates. We then begin their training process to ensure they are ready to embed with your team seamlessly.',
  },
  {
    number: '03',
    title: 'Kickoff & Placement',
    description: 'We introduce you to your talent, ensure everyone is set up for success, and kick off the engagement. Your Account Manager will check in frequently during the first 60 days.',
  },
];

const pricingFeatures = [
  'Save 60-70% on salaries',
  'Managed end-to-end',
  'Hire fast, usually within 2 weeks',
  'Zero headaches with payroll & compliance',
  'Dedicated account manager',
  'Performance monitoring & feedback',
];

export function TalentPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    teamSize: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="overflow-hidden">
      <HeroSection onCtaClick={scrollToForm} />
      <MarqueeSection />
      <AdvantagesSection />
      <StatsSection />
      <VettingSection />
      <ProcessSection />
      <PricingSection onCtaClick={scrollToForm} />
      <FormSection
        ref={formRef}
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function HeroSection({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-light/30 via-transparent to-orange/5" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-orange/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container-grid relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange/10 rounded-full mb-8">
            <Star className="w-4 h-4 text-orange" />
            <span className="text-sm font-medium text-orange">Trusted by 50+ growing companies</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-8">
            Easiest way to hire
            <br />
            <span className="text-orange">elite creative talent.</span>
          </h1>

          <p className="text-xl md:text-2xl text-neutral-mid leading-relaxed max-w-2xl mb-12">
            Optal helps growing companies hire top 3% designers and developers that are rigorously vetted
            and managed end-to-end to be the ready-to-use resource your team needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onCtaClick}
              className="group inline-flex items-center justify-center gap-3 bg-primary text-surface px-8 py-4 font-medium text-lg transition-all duration-300 hover:bg-neutral-dark"
            >
              Start Hiring
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-neutral-light font-medium text-lg transition-all duration-300 hover:border-primary hover:bg-primary/5"
            >
              See How It Works
            </a>
          </div>
        </div>

        <div className="mt-20 lg:mt-0 lg:absolute lg:right-12 lg:top-1/2 lg:-translate-y-1/2">
          <div className="relative">
            <div className="bg-surface border border-neutral-light p-6 shadow-2xl max-w-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange" />
                </div>
                <div>
                  <p className="font-medium">Your Optal Team</p>
                  <p className="text-sm text-neutral-mid">Ready to place talent</p>
                </div>
              </div>
              <div className="bg-neutral-light/30 rounded p-4">
                <p className="text-sm text-neutral-mid mb-2">New Match Available</p>
                <p className="font-medium">We have found the perfect Senior UI Designer for your team!</p>
              </div>
              <div className="mt-4 flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-mid to-primary border-2 border-surface"
                  />
                ))}
                <div className="w-8 h-8 rounded-full bg-orange/10 border-2 border-surface flex items-center justify-center text-xs font-medium text-orange">
                  +12
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-primary text-surface px-4 py-2 text-sm font-medium">
              14-day placement
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarqueeSection() {
  return (
    <section className="py-16 bg-primary text-surface overflow-hidden">
      <p className="text-center text-sm font-medium uppercase tracking-widest text-surface/60 mb-10">
        Fully managed creative & technical talent for ambitious teams
      </p>

      <div className="marquee mb-8">
        <div className="marquee-content">
          {[...talentCategories, ...talentCategories].map((category, index) => (
            <div key={index} className="flex items-center gap-6 px-8 py-4 bg-surface/5 border border-surface/10 rounded-lg whitespace-nowrap">
              <span className="font-display font-semibold text-lg">{category.title}</span>
              <div className="flex gap-2">
                {category.tools.map((tool, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-surface/10 rounded">{tool}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="marquee" style={{ animationDirection: 'reverse' }}>
        <div className="marquee-content" style={{ animationDirection: 'reverse' }}>
          {[...talentCategories.slice().reverse(), ...talentCategories.slice().reverse()].map((category, index) => (
            <div key={index} className="flex items-center gap-6 px-8 py-4 bg-surface/5 border border-surface/10 rounded-lg whitespace-nowrap">
              <span className="font-display font-semibold text-lg">{category.title}</span>
              <div className="flex gap-2">
                {category.tools.map((tool, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-surface/10 rounded">{tool}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdvantagesSection() {
  return (
    <section className="section-padding">
      <div className="container-grid">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Optal gives you every<br />hiring advantage.
          </h2>
          <p className="text-xl text-neutral-mid max-w-2xl mx-auto">
            Stop wasting months on hiring. Get pre-vetted, trained talent that integrates seamlessly with your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="group p-8 bg-surface border border-neutral-light transition-all duration-500 hover:border-orange/30 hover:shadow-xl"
            >
              <div className="w-14 h-14 bg-orange/10 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-orange/20">
                <advantage.icon className="w-7 h-7 text-orange" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">{advantage.title}</h3>
              <p className="text-neutral-mid text-lg leading-relaxed">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-20 bg-neutral-light/30">
      <div className="container-grid">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-8">
              <div className="text-6xl md:text-7xl font-display font-bold text-orange mb-4">
                {stat.value}
              </div>
              <p className="text-lg text-neutral-mid">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VettingSection() {
  return (
    <section className="section-padding bg-primary text-surface">
      <div className="container-grid">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Optal hires the top 3% of<br />global creative talent.
          </h2>
          <p className="text-xl text-surface/70 max-w-2xl mx-auto">
            Our rigorous vetting process ensures you only work with exceptional professionals.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {vettingSteps.map((step, index) => (
              <div key={index} className="relative mb-6 last:mb-0">
                <div className="flex items-center gap-6">
                  <div className="w-24 text-right">
                    <span className="text-3xl font-display font-bold text-orange">{step.percentage}%</span>
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-12 bg-surface/10 rounded relative overflow-hidden"
                      style={{ width: `${step.percentage * 2.5}%`, minWidth: '200px' }}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-orange/80 to-orange/40"
                        style={{ width: '100%' }}
                      />
                      <div className="absolute inset-0 flex items-center px-4">
                        <span className="font-medium text-sm whitespace-nowrap">{step.stage}</span>
                      </div>
                    </div>
                    <p className="text-sm text-surface/50 mt-2">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 pt-8 border-t border-surface/10">
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-orange mb-2">15+</div>
              <p className="text-sm text-surface/60">Hours avg. candidate<br />spends interviewing</p>
            </div>
            <div className="w-px h-16 bg-surface/20" />
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-orange mb-2">5</div>
              <p className="text-sm text-surface/60">Stage vetting<br />process</p>
            </div>
            <div className="w-px h-16 bg-surface/20" />
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-orange mb-2">97%</div>
              <p className="text-sm text-surface/60">Client satisfaction<br />rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="container-grid">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">How it works</h2>
          <p className="text-xl text-neutral-mid max-w-2xl mx-auto">
            Scale your creative team, scale your business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <div key={index} className="relative">
              <div className="mb-6">
                <span className="text-7xl font-display font-bold text-neutral-light">{step.number}</span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">{step.title}</h3>
              <p className="text-neutral-mid text-lg leading-relaxed">{step.description}</p>

              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-4 w-8">
                  <ArrowRight className="w-8 h-8 text-neutral-light" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="section-padding bg-neutral-light/30">
      <div className="container-grid">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Simple, transparent pricing.
            </h2>
            <p className="text-xl text-neutral-mid">
              No hidden fees. No long-term contracts. Just exceptional talent.
            </p>
          </div>

          <div className="bg-surface border border-neutral-light p-8 md:p-12 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">Optal Embedded Talent</h3>
                <p className="text-neutral-mid">Full-time dedicated talent for your team</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-mid mb-1">Starting from</div>
                <div className="text-4xl font-display font-bold">$2,500</div>
                <div className="text-neutral-mid">per month</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {pricingFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange flex-shrink-0" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onCtaClick}
              className="w-full group inline-flex items-center justify-center gap-3 bg-primary text-surface px-8 py-5 font-medium text-lg transition-all duration-300 hover:bg-neutral-dark"
            >
              Start Hiring Today
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FormSectionProps {
  formData: {
    name: string;
    email: string;
    company: string;
    role: string;
    teamSize: string;
    message: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    company: string;
    role: string;
    teamSize: string;
    message: string;
  }>>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(({ formData, setFormData, isSubmitting, isSubmitted, onSubmit }, ref) => {
  return (
    <section ref={ref} id="hire-form" className="section-padding">
      <div className="container-grid">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Start hiring with Optal today.
            </h2>
            <p className="text-xl text-neutral-mid">
              Our team is ready to place your perfect hire. Quick, easy, and affordable.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-surface border border-neutral-light p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">Thank you for your interest!</h3>
              <p className="text-neutral-mid text-lg">
                Our team will review your request and get back to you within 24 hours to schedule a discovery call.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="bg-surface border border-neutral-light p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field border border-neutral-light rounded px-4"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field border border-neutral-light rounded px-4"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input-field border border-neutral-light rounded px-4"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role You're Hiring For *</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input-field border border-neutral-light rounded px-4 bg-surface"
                  >
                    <option value="">Select a role</option>
                    <option value="graphic-designer">Graphic Designer</option>
                    <option value="ui-ux-designer">UI/UX Designer</option>
                    <option value="motion-designer">Motion Designer</option>
                    <option value="video-editor">Video Editor</option>
                    <option value="brand-designer">Brand Designer</option>
                    <option value="frontend-developer">Frontend Developer</option>
                    <option value="backend-developer">Backend Developer</option>
                    <option value="fullstack-developer">Full Stack Developer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Current Team Size</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="input-field border border-neutral-light rounded px-4 bg-surface"
                >
                  <option value="">Select team size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">Tell us about your hiring needs</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="input-field border border-neutral-light rounded px-4 resize-none"
                  placeholder="Describe the role, skills needed, or any specific requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group inline-flex items-center justify-center gap-3 bg-orange text-surface px-8 py-5 font-medium text-lg transition-all duration-300 hover:bg-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Hiring Request
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-neutral-mid mt-6">
                By submitting, you agree to our terms and privacy policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
});

FormSection.displayName = 'FormSection';
