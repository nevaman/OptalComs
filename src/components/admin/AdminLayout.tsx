import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Mail,
  ChevronRight,
  UserCheck,
  Trophy,
  ClipboardList,
  Star,
  Sliders,
  Inbox,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/insights', label: 'Insights', icon: FileText },
  { href: '/admin/opportunities', label: 'Opportunities', icon: Trophy },
  { href: '/admin/registrations', label: 'Contest Entries', icon: Users },
  { href: '/admin/applications', label: 'Applications', icon: ClipboardList },
  { href: '/admin/talent', label: 'Talent Network', icon: Star },
  { href: '/admin/talent-settings', label: 'Talent Page', icon: Sliders },
  { href: '/admin/hiring-requests', label: 'Hiring Requests', icon: Inbox },
  { href: '/admin/submissions', label: 'Submissions', icon: Mail },
  { href: '/admin/access-requests', label: 'Access Requests', icon: UserCheck },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-neutral-light/30">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform duration-200 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-surface/10">
            <Link to="/" className="font-display text-lg text-surface font-semibold">
              Optal CMS
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${
                    active
                      ? 'bg-surface/10 text-surface'
                      : 'text-surface/60 hover:text-surface hover:bg-surface/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-surface/10">
            <div className="px-4 py-3 mb-2">
              <p className="text-xs text-surface/50 mb-1">Signed in as</p>
              <p className="text-sm text-surface truncate">{profile?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded text-sm text-surface/60 hover:text-surface hover:bg-surface/5 w-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-primary/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-surface border-b border-neutral-light">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-neutral-mid hover:text-primary"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Breadcrumb />

            <Link
              to="/"
              target="_blank"
              className="text-sm text-neutral-mid hover:text-primary transition-colors"
            >
              View Site
            </Link>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Breadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  if (paths.length <= 1) return <div />;

  const breadcrumbs = paths.map((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/');
    const label = path.charAt(0).toUpperCase() + path.slice(1);
    const isLast = index === paths.length - 1;

    return (
      <span key={href} className="flex items-center">
        {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-neutral-light" />}
        {isLast ? (
          <span className="text-sm text-primary">{label}</span>
        ) : (
          <Link to={href} className="text-sm text-neutral-mid hover:text-primary transition-colors">
            {label}
          </Link>
        )}
      </span>
    );
  });

  return <div className="hidden md:flex items-center">{breadcrumbs}</div>;
}
