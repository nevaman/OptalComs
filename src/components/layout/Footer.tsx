import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useContactSettings } from '../../contexts/ContactSettingsContext';

const footerLinks = {
  studio: [
    { href: '/work', label: 'Work' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/team', label: 'Team' },
    { href: '/insights', label: 'Insights' },
    { href: '/contact', label: 'Contact' },
  ],
  social: [
    { href: 'https://linkedin.com', label: 'LinkedIn' },
    { href: 'https://twitter.com', label: 'Twitter' },
    { href: 'https://instagram.com', label: 'Instagram' },
    { href: 'https://behance.net', label: 'Behance' },
  ],
};

export function Footer() {
  const { settings } = useContactSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-primary text-surface overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-grid relative">
        <div className="pt-20 md:pt-28 lg:pt-36 pb-12">
          <div className="grid-12">
            <div className="col-span-4 md:col-span-8 lg:col-span-6 mb-16 md:mb-0">
              <Link
                to="/"
                className="group inline-block font-display text-2xl md:text-3xl font-semibold tracking-tight mb-8"
              >
                <span className="inline-block transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">
                  Optal
                </span>
                <span className="inline-block text-surface/50 transition-all duration-500 ease-out-expo group-hover:text-surface group-hover:-translate-y-1" style={{ transitionDelay: '50ms' }}>
                  {' '}Communications
                </span>
              </Link>

              <p className="text-surface/60 text-sm leading-relaxed max-w-xs mb-10">
                Ethiopian creatives serving global clients. We craft distinctive brand identities and digital experiences that resonate.
              </p>

              <a
                href={`mailto:${settings.email}`}
                className="group inline-flex items-center gap-3 text-lg md:text-xl font-display text-surface hover:text-orange transition-colors duration-300"
              >
                <span>{settings.email}</span>
                <span className="relative w-6 h-6 flex items-center justify-center rounded-full border border-surface/30 group-hover:border-orange transition-colors duration-300 overflow-hidden">
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
                  <ArrowUpRight className="w-3.5 h-3.5 absolute -translate-x-[150%] translate-y-[150%] transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                </span>
              </a>
            </div>

            <div className="col-span-2 md:col-span-2 lg:col-span-2 lg:col-start-8">
              <h4 className="text-[11px] uppercase tracking-[0.2em] text-surface/40 font-sans font-medium mb-6">
                Studio
              </h4>
              <ul className="space-y-3">
                {footerLinks.studio.map((link, index) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="group inline-flex items-center text-sm text-surface/70 hover:text-surface transition-colors duration-300"
                    >
                      <span className="relative overflow-hidden">
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                          {link.label}
                        </span>
                        <span className="absolute left-0 top-full inline-block transition-transform duration-300 group-hover:-translate-y-full text-orange">
                          {link.label}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-2 lg:col-span-2">
              <h4 className="text-[11px] uppercase tracking-[0.2em] text-surface/40 font-sans font-medium mb-6">
                Follow
              </h4>
              <ul className="space-y-3">
                {footerLinks.social.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm text-surface/70 hover:text-surface transition-colors duration-300"
                    >
                      <span className="relative overflow-hidden">
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                          {link.label}
                        </span>
                        <span className="absolute left-0 top-full inline-block transition-transform duration-300 group-hover:-translate-y-full text-orange">
                          {link.label}
                        </span>
                      </span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-4 md:col-span-4 lg:col-span-2 mt-10 md:mt-0">
              <h4 className="text-[11px] uppercase tracking-[0.2em] text-surface/40 font-sans font-medium mb-6">
                Location
              </h4>
              <address className="not-italic text-sm text-surface/70 leading-relaxed">
                {settings.location}
                <br />
                <span className="text-surface/50">Serving clients worldwide</span>
              </address>
              <p className="text-sm text-surface/70 mt-4">
                {settings.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="relative py-8">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface/10 to-transparent" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-xs text-surface/40">
              &copy; {currentYear} Optal Communications. All rights reserved.
            </p>

            <div className="flex items-center gap-8">
              <Link
                to="/privacy"
                className="group text-xs text-surface/40 hover:text-surface/70 transition-colors duration-300"
              >
                <span className="relative">
                  Privacy Policy
                  <span className="absolute left-0 -bottom-px w-0 h-px bg-surface/50 transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
              <Link
                to="/terms"
                className="group text-xs text-surface/40 hover:text-surface/70 transition-colors duration-300"
              >
                <span className="relative">
                  Terms of Service
                  <span className="absolute left-0 -bottom-px w-0 h-px bg-surface/50 transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
