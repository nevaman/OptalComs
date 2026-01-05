import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useContactSettings } from '../contexts/ContactSettingsContext';

const principles = [
  {
    title: 'Work-First',
    description:
      'We let the work speak. Every project is an opportunity to solve real problems and create lasting value.',
  },
  {
    title: 'Clarity Over Complexity',
    description:
      'Great design simplifies. We cut through noise to deliver solutions that communicate clearly.',
  },
  {
    title: 'Cultural Context',
    description:
      'Based in Ethiopia with global reach, we bring unique perspectives that bridge local authenticity with international standards.',
  },
  {
    title: 'Craft Matters',
    description:
      'Details make the difference. We obsess over typography, spacing, and finish to deliver polished work.',
  },
  {
    title: 'Partnership Approach',
    description:
      'We work with clients, not for them. Collaboration and open communication drive the best outcomes.',
  },
];

const process = [
  {
    step: '01',
    title: 'Discovery',
    description:
      'We start by understanding your business, goals, audience, and competitive landscape through research and conversation.',
  },
  {
    step: '02',
    title: 'Strategy',
    description:
      'Based on our findings, we develop a strategic foundation that will guide all creative decisions.',
  },
  {
    step: '03',
    title: 'Design',
    description:
      'We explore creative directions, refine concepts, and develop the visual system that brings your brand to life.',
  },
  {
    step: '04',
    title: 'Delivery',
    description:
      'Final assets, guidelines, and implementation support ensure your brand launches successfully.',
  },
];

const stats = [
  { value: '50+', label: 'Projects Completed' },
  { value: '10+', label: 'Years Experience' },
  { value: '25+', label: 'Happy Clients' },
  { value: '4', label: 'Countries Served' },
];

export function About() {
  const { settings } = useContactSettings();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <section className="section-padding relative">
        <div className="container-grid">
          <div className="grid-12">
            <div className="col-span-4 md:col-span-6 lg:col-span-8">
              <div className="overflow-hidden">
                <p
                  className="caption mb-6 opacity-0 animate-slide-up"
                  style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
                >
                  About Us
                </p>
              </div>
              <div className="overflow-hidden">
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl opacity-0 animate-slide-up"
                  style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
                >
                  Ethiopian creatives
                  <br />
                  <span className="text-neutral-mid">building brands for the world</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="grid-12 mt-16 md:mt-24">
            <div className="col-span-4 md:col-span-4 lg:col-span-5">
              <div className="relative aspect-[4/5] bg-neutral-light overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Our studio"
                  className="w-full h-full object-cover"
                  style={{ transform: `translateY(${scrollY * 0.05}px) scale(1.1)` }}
                />
                <div className="absolute inset-0 border border-neutral-light/50" />
              </div>
            </div>

            <div className="col-span-4 md:col-span-4 lg:col-span-5 lg:col-start-7 mt-10 md:mt-0 flex flex-col justify-center">
              <div className="prose-editorial">
                <p>
                  Optal Communications is a design studio based in Addis Ababa, Ethiopia. We
                  specialize in brand identity, digital products, and creative campaigns for
                  businesses that want to make a meaningful impact.
                </p>
                <p>
                  Founded on the belief that great design transcends borders, we combine local
                  cultural richness with international design standards to create work that resonates
                  globally while remaining authentic.
                </p>
                <p>
                  Our name "Optal" derives from "optimal" - reflecting our commitment to delivering
                  the best possible solutions for each unique challenge. We're selective about the
                  projects we take on, ensuring we can give each client our full attention and
                  creative energy.
                </p>
              </div>

              <Link
                to="/team"
                className="group inline-flex items-center gap-3 text-[13px] font-medium text-primary mt-10"
              >
                <span className="relative">
                  Meet the team
                  <span className="absolute left-0 -bottom-px w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                </span>
                <span className="relative w-5 h-5 flex items-center justify-center rounded-full border border-primary overflow-hidden">
                  <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-[150%]" />
                  <ArrowRight className="w-3 h-3 absolute -translate-x-[150%] transition-transform duration-300 group-hover:translate-x-0" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-grid">
          <div className="relative py-12">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-light to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-light to-transparent" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center group">
                  <p className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-neutral-mid">
                    {stat.value}
                  </p>
                  <p className="text-sm text-neutral-mid mt-3">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-grid">
          <div className="grid-12">
            <div className="col-span-4 md:col-span-3 lg:col-span-4">
              <p className="caption mb-4">Our Principles</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl">What guides our work</h2>
            </div>

            <div className="col-span-4 md:col-span-5 lg:col-span-7 lg:col-start-6 mt-10 md:mt-0">
              <div className="space-y-0">
                {principles.map((principle, index) => (
                  <article
                    key={principle.title}
                    className="group py-8 border-t border-neutral-light first:border-0 first:pt-0"
                  >
                    <div className="flex items-start gap-6 md:gap-8">
                      <span className="inline-flex items-center gap-3 text-[11px] font-mono text-neutral-mid shrink-0 pt-1">
                        <span className="w-6 h-px bg-neutral-light" />
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight group-hover:text-neutral-mid transition-colors duration-300">
                          {principle.title}
                        </h3>
                        <p className="text-neutral-mid mt-3 leading-relaxed">{principle.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container-grid relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <p className="caption text-surface/40 mb-4">How We Work</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-surface max-w-xl mx-auto">
              A proven process for exceptional results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {process.map((item, index) => (
              <article key={item.step} className="group relative">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[11px] font-mono text-orange">{item.step}</span>
                  <span className="flex-1 h-px bg-surface/10 group-hover:bg-surface/20 transition-colors duration-300" />
                </div>
                <h3 className="font-display text-xl md:text-2xl mb-4">{item.title}</h3>
                <p className="text-surface/60 text-sm leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-grid">
          <div className="grid-12 items-center">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <p className="caption mb-4">Start a Project</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl">Ready to work together?</h2>
              <p className="text-neutral-mid mt-6 text-lg leading-relaxed max-w-md">
                We'd love to hear about your project and explore how we can help bring your vision
                to life.
              </p>
              <Button href="/contact" variant="primary" icon className="mt-10">
                Start a Conversation
              </Button>
            </div>

            <div className="col-span-4 md:col-span-2 lg:col-span-4 lg:col-start-9 mt-12 md:mt-0">
              <a
                href={`mailto:${settings.email}`}
                className="group flex items-center justify-between p-5 border border-neutral-light hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300"
              >
                <span className="font-medium">{settings.email}</span>
                <span className="relative w-8 h-8 flex items-center justify-center rounded-full border border-neutral-light group-hover:border-primary/30 overflow-hidden transition-colors duration-300">
                  <ArrowUpRight className="w-4 h-4 text-neutral-mid group-hover:text-primary transition-all duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
                  <ArrowUpRight className="w-4 h-4 text-primary absolute -translate-x-[150%] translate-y-[150%] transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
