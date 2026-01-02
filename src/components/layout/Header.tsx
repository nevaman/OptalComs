import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/talent', label: 'Talent' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const location = useLocation();
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavHover = (index: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    setActiveIndex(index);
    if (indicatorRef.current && navRef.current) {
      const link = e.currentTarget;
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      indicatorRef.current.style.width = `${linkRect.width}px`;
      indicatorRef.current.style.left = `${linkRect.left - navRect.left}px`;
      indicatorRef.current.style.opacity = '1';
    }
  };

  const handleNavLeave = () => {
    setActiveIndex(null);
    if (indicatorRef.current) {
      indicatorRef.current.style.opacity = '0';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-expo ${
        isScrolled
          ? 'py-3 bg-surface/90 backdrop-blur-xl border-b border-neutral-light/50'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container-grid">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="group relative font-display text-lg md:text-xl font-semibold tracking-tight"
          >
            <span className="relative z-10">Optal</span>
            <span className="relative z-10 text-neutral-mid transition-colors duration-300 group-hover:text-primary">
              {' '}Communications
            </span>
          </Link>

          <nav
            ref={navRef}
            className="hidden md:flex items-center gap-1 relative"
            onMouseLeave={handleNavLeave}
          >
            <div
              ref={indicatorRef}
              className="absolute bottom-0 h-px bg-primary transition-all duration-300 ease-out-expo opacity-0"
              style={{ left: 0, width: 0 }}
            />
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onMouseEnter={(e) => handleNavHover(index, e)}
                  className={`relative px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-primary'
                      : activeIndex === index
                      ? 'text-primary'
                      : 'text-neutral-mid hover:text-primary'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 text-[13px] font-medium text-primary hover:text-orange transition-colors duration-300"
            >
              <span>Start a Project</span>
              <span className="relative w-5 h-5 flex items-center justify-center rounded-full border border-current overflow-hidden">
                <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
                <ArrowUpRight className="w-3 h-3 absolute -translate-x-[150%] translate-y-[150%] transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
              </span>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center -mr-2"
            aria-label="Toggle menu"
          >
            <span className="sr-only">Menu</span>
            <div className="relative w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-px w-full bg-primary transition-all duration-300 ease-out-expo origin-center ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-[7.5px]' : ''
                }`}
              />
              <span
                className={`block h-px w-full bg-primary transition-all duration-300 ease-out-expo ${
                  isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block h-px w-full bg-primary transition-all duration-300 ease-out-expo origin-center ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 top-0 bg-surface z-40 transition-all duration-500 ease-out-expo ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-5">
            <Link
              to="/"
              className="font-display text-lg font-semibold tracking-tight"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Optal<span className="text-neutral-mid"> Communications</span>
            </Link>
          </div>

          <nav className="flex-1 flex flex-col justify-center px-5 -mt-16">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`group py-4 border-b border-neutral-light/50 transition-all duration-500 ease-out-expo ${
                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: isMobileMenuOpen ? `${index * 50 + 100}ms` : '0ms' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center justify-between">
                    <span
                      className={`font-display text-3xl md:text-4xl font-semibold transition-colors duration-300 ${
                        isActive ? 'text-primary' : 'text-neutral-mid group-hover:text-primary'
                      }`}
                    >
                      {link.label}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-mid">
                      0{index + 1}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div
            className={`px-5 pb-8 transition-all duration-500 ease-out-expo ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? '400ms' : '0ms' }}
          >
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center gap-3 text-orange font-medium"
            >
              Start a Project
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <p className="mt-6 text-sm text-neutral-mid">
              hello@optal.co
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
