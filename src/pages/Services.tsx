import { ArrowRight, Check, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';

const services = [
  {
    id: 1,
    title: 'Brand Identity Systems',
    description:
      'Comprehensive visual identity design that captures your essence and resonates with your audience.',
    includes: [
      'Logo design and variations',
      'Color palette and typography',
      'Brand guidelines document',
      'Stationery design',
      'Brand asset library',
    ],
    audience: 'Startups, established businesses, organizations undergoing rebrand',
    timeline: '4-8 weeks',
  },
  {
    id: 2,
    title: 'Web Design & Development',
    description:
      'Custom websites that combine editorial design sensibility with modern web technologies.',
    includes: [
      'UX research and strategy',
      'Responsive web design',
      'Frontend development',
      'CMS integration',
      'Performance optimization',
    ],
    audience: 'Businesses needing a digital presence that stands out',
    timeline: '6-12 weeks',
  },
  {
    id: 3,
    title: 'Campaign & Content Design',
    description:
      'Visual content and campaign materials that tell your story across digital and print channels.',
    includes: [
      'Social media graphics',
      'Digital advertising',
      'Email design',
      'Presentation design',
      'Marketing collateral',
    ],
    audience: 'Marketing teams, product launches, event promotions',
    timeline: '2-4 weeks per campaign',
  },
  {
    id: 4,
    title: 'Print & Packaging',
    description:
      'Tactile design experiences from business cards to product packaging that make lasting impressions.',
    includes: [
      'Packaging design',
      'Publication design',
      'Print collateral',
      'Signage and environmental',
      'Production management',
    ],
    audience: 'Product brands, publishers, retail businesses',
    timeline: '4-8 weeks',
  },
  {
    id: 5,
    title: 'Strategy & Creative Direction',
    description:
      'Strategic guidance and creative leadership to align your brand with business objectives.',
    includes: [
      'Brand strategy workshops',
      'Competitive analysis',
      'Positioning and messaging',
      'Creative direction',
      'Brand architecture',
    ],
    audience: 'Organizations seeking strategic clarity and creative leadership',
    timeline: '2-6 weeks',
  },
];

const engagementModels = [
  {
    title: 'Project-Based',
    description:
      'Fixed-scope engagements with clear deliverables and timelines. Ideal for specific projects with defined outcomes.',
    features: ['Clear scope and pricing', 'Dedicated project timeline', 'Milestone-based delivery'],
  },
  {
    title: 'Design Partnership',
    description:
      'Ongoing monthly retainer for consistent design support. Perfect for teams needing regular creative work.',
    features: ['Flexible monthly hours', 'Priority scheduling', 'Consistent brand stewardship'],
  },
  {
    title: 'Sprint Engagement',
    description:
      'Intensive 1-2 week focused work sessions. Great for rapid prototyping or time-sensitive projects.',
    features: ['Compressed timeline', 'Daily collaboration', 'Fast iteration cycles'],
  },
];

export function Services() {
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
                  Services
                </p>
              </div>
              <div className="overflow-hidden">
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl opacity-0 animate-slide-up"
                  style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
                >
                  Design services for
                  <br />
                  <span className="text-neutral-mid">ambitious brands</span>
                </h1>
              </div>
              <div className="overflow-hidden">
                <p
                  className="text-lg md:text-xl text-neutral-mid mt-8 max-w-lg leading-relaxed opacity-0 animate-slide-up"
                  style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
                >
                  From brand foundations to digital experiences, we offer comprehensive design
                  services tailored to your goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28 lg:pb-36">
        <div className="container-grid">
          <div className="space-y-0">
            {services.map((service, index) => (
              <article
                key={service.id}
                className="group grid-12 items-start py-14 md:py-20 border-t border-neutral-light first:border-t-0 relative"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-light to-transparent" />

                <div className="col-span-4 md:col-span-1 lg:col-span-1 mb-6 md:mb-0">
                  <span className="inline-flex items-center gap-3 text-[11px] font-mono text-neutral-mid">
                    <span className="w-6 h-px bg-neutral-light" />
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="col-span-4 md:col-span-4 lg:col-span-5">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-display tracking-tight group-hover:text-neutral-mid transition-colors duration-300">
                    {service.title}
                  </h2>
                  <p className="text-neutral-mid mt-5 leading-relaxed">{service.description}</p>

                  <div className="mt-10">
                    <h4 className="text-[11px] uppercase tracking-[0.2em] text-neutral-mid font-medium mb-5">
                      What's Included
                    </h4>
                    <ul className="space-y-3">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start gap-4 text-sm">
                          <span className="w-5 h-5 rounded-full border border-orange/30 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-orange" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="col-span-4 md:col-span-3 lg:col-span-4 lg:col-start-8 mt-10 md:mt-0">
                  <div className="bg-surface border border-neutral-light/80 p-7 md:p-8 space-y-7 transition-all duration-300 hover:border-primary/20 hover:shadow-soft">
                    <div>
                      <h4 className="text-[11px] uppercase tracking-[0.2em] text-neutral-mid font-medium mb-3">
                        Best For
                      </h4>
                      <p className="text-sm leading-relaxed">{service.audience}</p>
                    </div>

                    <div>
                      <h4 className="text-[11px] uppercase tracking-[0.2em] text-neutral-mid font-medium mb-3">
                        Typical Timeline
                      </h4>
                      <p className="text-sm font-medium">{service.timeline}</p>
                    </div>

                    <Button href="/contact" variant="accent" icon className="w-full justify-center">
                      Request a Quote
                    </Button>
                  </div>
                </div>
              </article>
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
          <SectionHeading
            label="How We Work"
            title="Engagement models"
            description="Choose the working relationship that fits your needs and project scope."
            dark
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {engagementModels.map((model, index) => (
              <article
                key={model.title}
                className="group relative border border-surface/10 p-8 md:p-10 hover:border-surface/25 transition-all duration-500"
              >
                <div className="absolute top-8 right-8 text-[11px] font-mono text-surface/30">
                  0{index + 1}
                </div>

                <h3 className="font-display text-xl md:text-2xl mb-5 pr-8">{model.title}</h3>
                <p className="text-surface/60 text-sm leading-relaxed mb-8">{model.description}</p>

                <ul className="space-y-4">
                  {model.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-4 text-sm text-surface/80">
                      <span className="w-5 h-5 rounded-full border border-orange/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-orange" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl">Let's discuss your project</h2>
              <p className="text-neutral-mid mt-6 text-lg leading-relaxed max-w-md">
                Ready to start? We'd love to hear about your project and explore how we can help.
              </p>
              <Button href="/contact" variant="primary" icon className="mt-10">
                Get in Touch
              </Button>
            </div>

            <div className="col-span-4 md:col-span-2 lg:col-span-4 lg:col-start-9 mt-12 md:mt-0">
              <a
                href="mailto:hello@optal.co"
                className="group flex items-center justify-between p-5 border border-neutral-light hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300"
              >
                <span className="font-medium">hello@optal.co</span>
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
