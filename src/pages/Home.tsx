import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { supabase, Project } from '../lib/supabase';
import { ProjectCard } from '../components/ui/ProjectCard';
import { Button } from '../components/ui/Button';
import { useContactSettings } from '../contexts/ContactSettingsContext';

const capabilities = [
  'Brand Identity',
  'Web Design',
  'Digital Products',
  'Print & Packaging',
  'Creative Strategy',
];

const clients = [
  'Ethiopian Airlines',
  'Ethio Telecom',
  'Dashen Bank',
  'Awash Bank',
  'UNICEF Ethiopia',
  'Hilton Addis',
];

const testimonials = [
  {
    quote: 'Optal transformed our brand presence completely. Their attention to detail and understanding of our market was exceptional.',
    author: 'Sara Bekele',
    role: 'Marketing Director, TechStart Ethiopia',
  },
  {
    quote: 'Working with the team was a seamless experience. They delivered beyond expectations within tight timelines.',
    author: 'Michael Chen',
    role: 'CEO, Global Trade Partners',
  },
];

export function Home() {
  const { settings } = useContactSettings();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(6);

      if (data) {
        setProjects(data);
      }
      setIsLoading(false);
    }

    fetchProjects();
  }, []);

  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.15}px)`,
  };

  return (
    <>
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.03]"
            style={{
              background: 'radial-gradient(circle, rgb(var(--color-orange)) 0%, transparent 70%)',
              ...parallaxStyle,
            }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.02]"
            style={{
              background: 'radial-gradient(circle, rgb(var(--color-black)) 0%, transparent 70%)',
              transform: `translateY(${-scrollY * 0.1}px)`,
            }}
          />
        </div>

        <div className="container-grid w-full relative z-10 py-32 md:py-40">
          <div className="grid-12 items-center">
            <div className="col-span-4 md:col-span-6 lg:col-span-7">
              <div className="overflow-hidden">
                <p
                  className="caption mb-6 opacity-0 animate-slide-up"
                  style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
                >
                  Design Studio
                </p>
              </div>

              <div className="overflow-hidden">
                <h1
                  className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-semibold tracking-tightest leading-[1.02] opacity-0 animate-slide-up"
                  style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
                >
                  We build brands
                  <br />
                  <span className="text-neutral-mid">that stand out</span>
                </h1>
              </div>

              <div className="overflow-hidden">
                <p
                  className="text-lg md:text-xl text-neutral-mid mt-8 max-w-md leading-relaxed opacity-0 animate-slide-up"
                  style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
                >
                  Ethiopian creatives, global clients. Crafting distinctive identities and digital experiences.
                </p>
              </div>

              <div
                className="flex flex-wrap gap-4 mt-10 opacity-0 animate-slide-up"
                style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
              >
                <Button href="/work" variant="primary" icon>
                  View Work
                </Button>
                <Button href="/services" variant="secondary">
                  How We Work
                </Button>
              </div>
            </div>

            <div className="col-span-4 md:col-span-2 lg:col-span-4 lg:col-start-9 hidden md:block">
              <div
                className="relative opacity-0 animate-scale-in"
                style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
              >
                <div className="aspect-[3/4] bg-neutral-light overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Creative workspace"
                    className="w-full h-full object-cover"
                    style={{ transform: `translateY(${scrollY * 0.08}px) scale(1.1)` }}
                  />
                </div>

                <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 w-28 h-28 md:w-32 md:h-32 bg-orange flex flex-col items-center justify-center shadow-glow">
                  <span className="font-display text-surface text-4xl md:text-5xl font-semibold leading-none">10+</span>
                  <span className="text-surface/80 text-[10px] uppercase tracking-wider mt-1">Years</span>
                </div>

                <div className="absolute -top-4 -right-4 w-20 h-20 border border-neutral-light" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-neutral-mid">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-neutral-light to-transparent overflow-hidden">
            <div className="w-full h-4 bg-neutral-mid animate-pulse" style={{ animation: 'scrollPulse 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      <section className="section-padding relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-light to-transparent" />

        <div className="container-grid">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div className="max-w-lg">
              <p className="caption mb-4">Selected Work</p>
              <h2 className="text-balance">Projects that define brands</h2>
            </div>

            <Link
              to="/work"
              className="group inline-flex items-center gap-3 text-[13px] font-medium text-primary"
            >
              <span className="relative">
                View all work
                <span className="absolute left-0 -bottom-px w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </span>
              <span className="relative w-5 h-5 flex items-center justify-center rounded-full border border-primary overflow-hidden">
                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-[150%]" />
                <ArrowRight className="w-3 h-3 absolute -translate-x-[150%] transition-transform duration-300 group-hover:translate-x-0" />
              </span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-neutral-light" />
                  <div className="mt-5 h-6 bg-neutral-light w-3/4" />
                  <div className="mt-2 h-4 bg-neutral-light w-1/2" />
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-mid">Projects coming soon.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20 overflow-hidden">
        <div className="marquee">
          <div className="marquee-content">
            {[...capabilities, ...capabilities].map((capability, index) => (
              <span
                key={index}
                className="text-2xl md:text-3xl lg:text-4xl font-display text-neutral-light whitespace-nowrap"
              >
                {capability}
                <span className="inline-block w-3 h-3 rounded-full bg-orange/30 mx-8 align-middle" />
              </span>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {[...capabilities, ...capabilities].map((capability, index) => (
              <span
                key={index}
                className="text-2xl md:text-3xl lg:text-4xl font-display text-neutral-light whitespace-nowrap"
              >
                {capability}
                <span className="inline-block w-3 h-3 rounded-full bg-orange/30 mx-8 align-middle" />
              </span>
            ))}
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
          <div className="grid-12">
            <div className="col-span-4 md:col-span-4">
              <p className="caption text-surface/40 mb-4">What Clients Say</p>
              <h2 className="text-3xl md:text-4xl text-surface">
                Results that speak for themselves
              </h2>
            </div>

            <div className="col-span-4 md:col-span-4 lg:col-span-7 lg:col-start-6 mt-12 md:mt-0">
              <div className="space-y-16">
                {testimonials.map((testimonial, index) => (
                  <blockquote key={index} className="relative pl-8 border-l-2 border-orange">
                    <p className="text-xl md:text-2xl text-surface/90 italic font-display leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <footer className="mt-6 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-surface">{testimonial.author.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface">{testimonial.author}</p>
                        <p className="text-sm text-surface/50">{testimonial.role}</p>
                      </div>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-grid">
          <div className="relative py-12">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-light to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-light to-transparent" />

            <p className="caption text-center mb-10">Trusted By</p>
            <div className="flex flex-wrap gap-x-16 gap-y-8 justify-center items-center">
              {clients.map((client, index) => (
                <span
                  key={client}
                  className="text-sm md:text-base font-medium text-neutral-mid/70 hover:text-primary transition-colors duration-300 cursor-default"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-grid">
          <div className="relative">
            <div className="grid-12 items-center">
              <div className="col-span-4 md:col-span-5 lg:col-span-6">
                <p className="caption mb-4">Start a Project</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl">Ready to stand out?</h2>
                <p className="text-lg text-neutral-mid mt-6 max-w-md leading-relaxed">
                  Let's discuss your project and explore how we can help your brand make an impact.
                </p>
                <Button href="/contact" variant="primary" icon className="mt-10">
                  Start a Project
                </Button>
              </div>

              <div className="col-span-4 md:col-span-3 lg:col-span-4 lg:col-start-9 mt-12 md:mt-0">
                <div className="space-y-4">
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
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-5 border border-neutral-light hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300"
                  >
                    <span className="font-medium">LinkedIn</span>
                    <span className="relative w-8 h-8 flex items-center justify-center rounded-full border border-neutral-light group-hover:border-primary/30 overflow-hidden transition-colors duration-300">
                      <ArrowUpRight className="w-4 h-4 text-neutral-mid group-hover:text-primary transition-all duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
                      <ArrowUpRight className="w-4 h-4 text-primary absolute -translate-x-[150%] translate-y-[150%] transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
