import { useState, useRef, forwardRef, useEffect } from 'react';
import {
  ArrowRight,
  Clock,
  DollarSign,
  Shield,
  Users,
  CheckCircle2,
  GraduationCap,
  Star,
  Palette,
  Code,
  Video,
  Megaphone,
  PenTool,
  Box,
  Camera,
  Sparkles,
  Check,
} from 'lucide-react';

export interface TalentOffering {
  id: string;
  title: string;
  description: string;
  icon: string;
  skills: string[];
  tools: string[];
  order: number;
  is_active: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  price_suffix: string;
  features: string[];
  is_popular: boolean;
  cta_text: string;
  order: number;
  is_active: boolean;
}

export interface HeroContent {
  badge_text: string;
  headline: string;
  headline_accent: string;
  subheadline: string;
  cta_primary: string;
  cta_secondary: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  order: number;
}

export interface VettingStep {
  id: string;
  stage: string;
  percentage: number;
  description: string;
  order: number;
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  order: number;
}

const mockHeroContent: HeroContent = {
  badge_text: 'Trusted by 50+ growing companies',
  headline: 'Easiest way to hire',
  headline_accent: 'elite creative talent.',
  subheadline: 'Optal helps growing companies hire top 3% designers and developers that are rigorously vetted and managed end-to-end to be the ready-to-use resource your team needs.',
  cta_primary: 'Start Hiring',
  cta_secondary: 'See How It Works',
};

const mockTalentOfferings: TalentOffering[] = [
  {
    id: '1',
    title: 'Graphic Designers',
    description: 'Expert visual designers who create stunning brand assets, marketing materials, and digital graphics.',
    icon: 'palette',
    skills: ['Brand Design', 'Print Design', 'Digital Graphics', 'Layout Design'],
    tools: ['Figma', 'Photoshop', 'Illustrator', 'InDesign'],
    order: 1,
    is_active: true,
  },
  {
    id: '2',
    title: 'UI/UX Designers',
    description: 'User-centered designers who craft intuitive interfaces and seamless digital experiences.',
    icon: 'pen-tool',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    tools: ['Figma', 'Sketch', 'Adobe XD', 'Framer'],
    order: 2,
    is_active: true,
  },
  {
    id: '3',
    title: 'Motion Designers',
    description: 'Creative animators who bring brands to life through captivating motion graphics and animations.',
    icon: 'sparkles',
    skills: ['2D Animation', '3D Animation', 'Motion Graphics', 'Visual Effects'],
    tools: ['After Effects', 'Cinema 4D', 'Blender', 'Premiere Pro'],
    order: 3,
    is_active: true,
  },
  {
    id: '4',
    title: 'Video Editors',
    description: 'Skilled editors who transform raw footage into polished, engaging video content.',
    icon: 'video',
    skills: ['Video Editing', 'Color Grading', 'Sound Design', 'Storytelling'],
    tools: ['Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'After Effects'],
    order: 4,
    is_active: true,
  },
  {
    id: '5',
    title: 'Frontend Developers',
    description: 'Technical experts who build responsive, performant, and accessible web interfaces.',
    icon: 'code',
    skills: ['React', 'TypeScript', 'CSS/Tailwind', 'Performance'],
    tools: ['VS Code', 'Git', 'Figma', 'Chrome DevTools'],
    order: 5,
    is_active: true,
  },
  {
    id: '6',
    title: 'Full Stack Developers',
    description: 'Versatile engineers who handle both frontend and backend development with expertise.',
    icon: 'box',
    skills: ['Frontend', 'Backend', 'Databases', 'DevOps'],
    tools: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    order: 6,
    is_active: true,
  },
];

const mockPricingTiers: PricingTier[] = [
  {
    id: '1',
    name: 'Starter',
    description: 'Perfect for small teams getting started with offshore talent.',
    price: 2000,
    price_suffix: '/month',
    features: [
      'Part-time dedicated talent (20 hrs/week)',
      'Pre-vetted professionals',
      'Basic project management',
      'Weekly check-ins',
      'Email support',
    ],
    is_popular: false,
    cta_text: 'Get Started',
    order: 1,
    is_active: true,
  },
  {
    id: '2',
    name: 'Professional',
    description: 'Full-time embedded talent for growing teams.',
    price: 3500,
    price_suffix: '/month',
    features: [
      'Full-time dedicated talent (40 hrs/week)',
      'Top 3% pre-vetted professionals',
      'Dedicated account manager',
      'Performance tracking & reporting',
      'Slack/Teams integration',
      'Priority support',
    ],
    is_popular: true,
    cta_text: 'Start Hiring',
    order: 2,
    is_active: true,
  },
  {
    id: '3',
    name: 'Enterprise',
    description: 'Custom solutions for scaling organizations.',
    price: 0,
    price_suffix: '',
    features: [
      'Multiple dedicated team members',
      'Custom vetting requirements',
      'Dedicated success team',
      'Custom integrations',
      'SLA guarantees',
      'Quarterly business reviews',
      'Volume discounts',
    ],
    is_popular: false,
    cta_text: 'Contact Sales',
    order: 3,
    is_active: true,
  },
];

const mockStats: Stat[] = [
  { id: '1', value: '3%', label: 'Acceptance rate for Optal talent', order: 1 },
  { id: '2', value: '70%', label: 'Average savings on salaries', order: 2 },
  { id: '3', value: '14d', label: 'Avg time to placement', order: 3 },
];

const mockVettingSteps: VettingStep[] = [
  { id: '1', stage: 'Initial Screening', percentage: 40, description: 'Portfolio & experience review', order: 1 },
  { id: '2', stage: 'Soft Skills & English', percentage: 18, description: 'Communication assessment', order: 2 },
  { id: '3', stage: 'Technical Interviews', percentage: 10, description: 'Domain expertise evaluation', order: 3 },
  { id: '4', stage: 'Real-world Projects', percentage: 5, description: 'Practical skill demonstration', order: 4 },
  { id: '5', stage: 'Final Interviews', percentage: 3, description: 'Culture & fit assessment', order: 5 },
];

const mockProcessSteps: ProcessStep[] = [
  {
    id: '1',
    number: '01',
    title: 'Discovery Call',
    description: 'We work to understand your hiring goals and identify where your team needs the most support. Together we outline a plan for embedded talent, placement timeline, and your needs for a perfect fit.',
    order: 1,
  },
  {
    id: '2',
    number: '02',
    title: 'Training & Selection',
    description: 'Optal selects and shares the perfect fit from our pool of pre-vetted candidates. We then begin their training process to ensure they are ready to embed with your team seamlessly.',
    order: 2,
  },
  {
    id: '3',
    number: '03',
    title: 'Kickoff & Placement',
    description: 'We introduce you to your talent, ensure everyone is set up for success, and kick off the engagement. Your Account Manager will check in frequently during the first 60 days.',
    order: 3,
  },
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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'palette': Palette,
  'pen-tool': PenTool,
  'sparkles': Sparkles,
  'video': Video,
  'code': Code,
  'box': Box,
  'camera': Camera,
  'megaphone': Megaphone,
};

export function TalentPage() {
  const [heroContent] = useState<HeroContent>(mockHeroContent);
  const [talentOfferings] = useState<TalentOffering[]>(mockTalentOfferings);
  const [pricingTiers] = useState<PricingTier[]>(mockPricingTiers);
  const [stats] = useState<Stat[]>(mockStats);
  const [vettingSteps] = useState<VettingStep[]>(mockVettingSteps);
  const [processSteps] = useState<ProcessStep[]>(mockProcessSteps);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    teamSize: '',
    budget: '',
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

  const activeOfferings = talentOfferings.filter(o => o.is_active).sort((a, b) => a.order - b.order);
  const activePricingTiers = pricingTiers.filter(p => p.is_active).sort((a, b) => a.order - b.order);
  const activeStats = stats.sort((a, b) => a.order - b.order);
  const activeVettingSteps = vettingSteps.sort((a, b) => a.order - b.order);
  const activeProcessSteps = processSteps.sort((a, b) => a.order - b.order);

  return (
    <div className="overflow-hidden">
      <HeroSection content={heroContent} onCtaClick={scrollToForm} />
      <TalentOfferingsSection offerings={activeOfferings} />
      <AdvantagesSection />
      <StatsSection stats={activeStats} />
      <VettingSection steps={activeVettingSteps} />
      <ProcessSection steps={activeProcessSteps} />
      <PricingSection tiers={activePricingTiers} onCtaClick={scrollToForm} />
      <FormSection
        ref={formRef}
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
        onSubmit={handleSubmit}
        offerings={activeOfferings}
      />
    </div>
  );
}

function HeroSection({ content, onCtaClick }: { content: HeroContent; onCtaClick: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-light/30 via-transparent to-orange/5" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-orange/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container-grid relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange/10 rounded-full mb-8">
            <Star className="w-4 h-4 text-orange" />
            <span className="text-sm font-medium text-orange">{content.badge_text}</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-8">
            {content.headline}
            <br />
            <span className="text-orange">{content.headline_accent}</span>
          </h1>

          <p className="text-xl md:text-2xl text-neutral-mid leading-relaxed max-w-2xl mb-12">
            {content.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onCtaClick}
              className="group inline-flex items-center justify-center gap-3 bg-primary text-surface px-8 py-4 font-medium text-lg transition-all duration-300 hover:bg-neutral-dark"
            >
              {content.cta_primary}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-neutral-light font-medium text-lg transition-all duration-300 hover:border-primary hover:bg-primary/5"
            >
              {content.cta_secondary}
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

function TalentOfferingsSection({ offerings }: { offerings: TalentOffering[] }) {
  return (
    <section className="section-padding bg-primary text-surface">
      <div className="container-grid">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            World-class talent,<br />ready to embed.
          </h2>
          <p className="text-xl text-surface/70 max-w-2xl mx-auto">
            From designers to developers, we have pre-vetted professionals ready to join your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((offering) => {
            const IconComponent = iconMap[offering.icon] || Palette;
            return (
              <div
                key={offering.id}
                className="group p-8 bg-surface/5 border border-surface/10 rounded-lg transition-all duration-300 hover:bg-surface/10 hover:border-surface/20"
              >
                <div className="w-14 h-14 bg-orange/20 rounded-xl flex items-center justify-center mb-6">
                  <IconComponent className="w-7 h-7 text-orange" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{offering.title}</h3>
                <p className="text-surface/70 text-sm leading-relaxed mb-6">{offering.description}</p>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-surface/50 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {offering.skills.map((skill, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-surface/10 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-surface/50 mb-2">Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {offering.tools.map((tool, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-orange/10 text-orange rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <section className="py-20 bg-neutral-light/30">
      <div className="container-grid">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center p-8">
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

function VettingSection({ steps }: { steps: VettingStep[] }) {
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
            {steps.map((step, index) => (
              <div key={step.id} className="relative mb-6 last:mb-0">
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

function ProcessSection({ steps }: { steps: ProcessStep[] }) {
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
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="mb-6">
                <span className="text-7xl font-display font-bold text-neutral-light">{step.number}</span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">{step.title}</h3>
              <p className="text-neutral-mid text-lg leading-relaxed">{step.description}</p>

              {index < steps.length - 1 && (
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

function PricingSection({ tiers, onCtaClick }: { tiers: PricingTier[]; onCtaClick: () => void }) {
  return (
    <section id="pricing" className="section-padding bg-neutral-light/30">
      <div className="container-grid">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Simple, transparent pricing.
          </h2>
          <p className="text-xl text-neutral-mid max-w-2xl mx-auto">
            No hidden fees. No long-term contracts. Just exceptional talent at competitive rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-surface border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                tier.is_popular ? 'border-orange shadow-lg scale-105' : 'border-neutral-light'
              }`}
            >
              {tier.is_popular && (
                <div className="absolute top-0 left-0 right-0 bg-orange text-surface text-xs font-bold uppercase tracking-wider text-center py-2">
                  Most Popular
                </div>
              )}

              <div className={`p-8 ${tier.is_popular ? 'pt-12' : ''}`}>
                <h3 className="text-2xl font-display font-bold mb-2">{tier.name}</h3>
                <p className="text-neutral-mid text-sm mb-6">{tier.description}</p>

                <div className="mb-8">
                  {tier.price > 0 ? (
                    <>
                      <span className="text-5xl font-display font-bold">${tier.price.toLocaleString()}</span>
                      <span className="text-neutral-mid">{tier.price_suffix}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-display font-bold">Custom Pricing</span>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onCtaClick}
                  className={`w-full py-4 font-medium transition-all duration-300 ${
                    tier.is_popular
                      ? 'bg-orange text-surface hover:bg-orange/90'
                      : 'bg-primary text-surface hover:bg-neutral-dark'
                  }`}
                >
                  {tier.cta_text}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-mid">
            All plans include payroll management, compliance handling, and dedicated support.
          </p>
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
    budget: string;
    message: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    company: string;
    role: string;
    teamSize: string;
    budget: string;
    message: string;
  }>>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
  offerings: TalentOffering[];
}

const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(
  ({ formData, setFormData, isSubmitting, isSubmitted, onSubmit, offerings }, ref) => {
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
                      {offerings.map((offering) => (
                        <option key={offering.id} value={offering.title}>
                          {offering.title}
                        </option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Budget</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="input-field border border-neutral-light rounded px-4 bg-surface"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-2000">Under $2,000/month</option>
                      <option value="2000-3500">$2,000 - $3,500/month</option>
                      <option value="3500-5000">$3,500 - $5,000/month</option>
                      <option value="5000-10000">$5,000 - $10,000/month</option>
                      <option value="10000+">$10,000+/month</option>
                    </select>
                  </div>
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
  }
);

FormSection.displayName = 'FormSection';
