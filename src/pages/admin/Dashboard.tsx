import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, FileText, Mail, ArrowRight, Eye, EyeOff, Clock } from 'lucide-react';
import { supabase, Project, TeamMember, Insight, ContactSubmission } from '../../lib/supabase';
import { format } from 'date-fns';

type Stats = {
  projects: { total: number; published: number };
  team: { total: number; visible: number };
  insights: { total: number; published: number };
  submissions: { total: number; unread: number };
};

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: { total: 0, published: 0 },
    team: { total: 0, visible: 0 },
    insights: { total: 0, published: 0 },
    submissions: { total: 0, unread: 0 },
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [projectsRes, teamRes, insightsRes, submissionsRes] = await Promise.all([
        supabase.from('projects').select('id, is_published'),
        supabase.from('team_members').select('id, is_visible'),
        supabase.from('insights').select('id, is_published'),
        supabase.from('contact_submissions').select('id, is_read'),
      ]);

      const projects = projectsRes.data || [];
      const team = teamRes.data || [];
      const insights = insightsRes.data || [];
      const submissions = submissionsRes.data || [];

      setStats({
        projects: {
          total: projects.length,
          published: projects.filter((p) => p.is_published).length,
        },
        team: {
          total: team.length,
          visible: team.filter((t) => t.is_visible).length,
        },
        insights: {
          total: insights.length,
          published: insights.filter((i) => i.is_published).length,
        },
        submissions: {
          total: submissions.length,
          unread: submissions.filter((s) => !s.is_read).length,
        },
      });

      const { data: recent } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (recent) {
        setRecentProjects(recent);
      }

      const { data: recentSubs } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentSubs) {
        setRecentSubmissions(recentSubs);
      }

      setIsLoading(false);
    }

    fetchData();
  }, []);

  const statCards = [
    {
      label: 'Projects',
      total: stats.projects.total,
      sub: `${stats.projects.published} published`,
      icon: Briefcase,
      href: '/admin/projects',
      color: 'bg-orange/10 text-orange',
    },
    {
      label: 'Team Members',
      total: stats.team.total,
      sub: `${stats.team.visible} visible`,
      icon: Users,
      href: '/admin/team',
      color: 'bg-green-500/10 text-green-600',
    },
    {
      label: 'Insights',
      total: stats.insights.total,
      sub: `${stats.insights.published} published`,
      icon: FileText,
      href: '/admin/insights',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Submissions',
      total: stats.submissions.total,
      sub: `${stats.submissions.unread} unread`,
      icon: Mail,
      href: '/admin/submissions',
      color: 'bg-amber-500/10 text-amber-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 bg-neutral-light w-48 mb-2 animate-pulse" />
          <div className="h-5 bg-neutral-light w-72 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface p-6 rounded border border-neutral-light animate-pulse">
              <div className="h-10 bg-neutral-light w-10 rounded mb-4" />
              <div className="h-8 bg-neutral-light w-16 mb-2" />
              <div className="h-4 bg-neutral-light w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-semibold">Dashboard</h1>
        <p className="text-neutral-mid mt-1">Welcome to the Optal Communications CMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.href}
              className="bg-surface p-6 rounded border border-neutral-light hover:border-primary/20 transition-colors group"
            >
              <div className={`w-10 h-10 rounded flex items-center justify-center ${card.color} mb-4`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-display font-semibold">{card.total}</p>
              <p className="text-sm text-neutral-mid mt-1">{card.label}</p>
              <p className="text-xs text-neutral-mid/70 mt-1">{card.sub}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded border border-neutral-light">
          <div className="flex items-center justify-between p-4 border-b border-neutral-light">
            <h2 className="font-display font-semibold">Recent Projects</h2>
            <Link
              to="/admin/projects"
              className="text-sm text-orange hover:opacity-80 inline-flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-light">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/admin/projects/${project.id}`}
                  className="flex items-center justify-between p-4 hover:bg-neutral-light/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {project.is_published ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-neutral-mid" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{project.title}</p>
                      <p className="text-xs text-neutral-mid">{project.industry || 'No industry'}</p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-mid">
                    {format(new Date(project.updated_at), 'MMM d')}
                  </span>
                </Link>
              ))
            ) : (
              <p className="p-4 text-sm text-neutral-mid">No projects yet</p>
            )}
          </div>
        </div>

        <div className="bg-surface rounded border border-neutral-light">
          <div className="flex items-center justify-between p-4 border-b border-neutral-light">
            <h2 className="font-display font-semibold">Recent Submissions</h2>
            <Link
              to="/admin/submissions"
              className="text-sm text-orange hover:opacity-80 inline-flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-light">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        sub.is_read ? 'bg-neutral-light' : 'bg-orange'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-sm">{sub.name}</p>
                      <p className="text-xs text-neutral-mid">{sub.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-mid flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(sub.created_at), 'MMM d')}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-neutral-mid">No submissions yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/projects/new"
          className="bg-surface p-6 rounded border border-neutral-light hover:border-orange transition-colors group"
        >
          <Briefcase className="w-6 h-6 text-orange mb-3" />
          <h3 className="font-display font-semibold">New Project</h3>
          <p className="text-sm text-neutral-mid mt-1">Add a new portfolio project</p>
        </Link>
        <Link
          to="/admin/team/new"
          className="bg-surface p-6 rounded border border-neutral-light hover:border-orange transition-colors group"
        >
          <Users className="w-6 h-6 text-orange mb-3" />
          <h3 className="font-display font-semibold">New Team Member</h3>
          <p className="text-sm text-neutral-mid mt-1">Add a team member profile</p>
        </Link>
        <Link
          to="/admin/insights/new"
          className="bg-surface p-6 rounded border border-neutral-light hover:border-orange transition-colors group"
        >
          <FileText className="w-6 h-6 text-orange mb-3" />
          <h3 className="font-display font-semibold">New Insight</h3>
          <p className="text-sm text-neutral-mid mt-1">Write a new blog post</p>
        </Link>
      </div>
    </div>
  );
}
