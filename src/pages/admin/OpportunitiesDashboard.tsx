import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Briefcase,
  Trophy,
  Coins,
  MoreVertical,
  Edit2,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Users,
} from 'lucide-react';
import { supabase, Career, Contest, Grant } from '../../lib/supabase';
import { format } from 'date-fns';
import { Button } from '../../components/ui/Button';

type TabType = 'careers' | 'contests' | 'grants';

export function OpportunitiesDashboard() {
  const navigate = useNavigate();
  const [careers, setCareers] = useState<Career[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('careers');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);

    const [careersRes, contestsRes, grantsRes] = await Promise.all([
      supabase.from('careers').select('*').order('created_at', { ascending: false }),
      supabase.from('contests').select('*').order('created_at', { ascending: false }),
      supabase.from('grants').select('*').order('created_at', { ascending: false }),
    ]);

    if (careersRes.data) setCareers(careersRes.data);
    if (contestsRes.data) setContests(contestsRes.data);
    if (grantsRes.data) setGrants(grantsRes.data);

    setIsLoading(false);
  }

  async function deleteCareer(id: string) {
    if (!confirm('Delete this job listing?')) return;
    await supabase.from('careers').delete().eq('id', id);
    setCareers((prev) => prev.filter((c) => c.id !== id));
    setActiveMenu(null);
  }

  async function deleteContest(id: string) {
    if (!confirm('Delete this contest?')) return;
    await supabase.from('contests').delete().eq('id', id);
    setContests((prev) => prev.filter((c) => c.id !== id));
    setActiveMenu(null);
  }

  async function deleteGrant(id: string) {
    if (!confirm('Delete this grant?')) return;
    await supabase.from('grants').delete().eq('id', id);
    setGrants((prev) => prev.filter((g) => g.id !== id));
    setActiveMenu(null);
  }

  async function toggleFeatured(type: TabType, id: string, current: boolean) {
    const table = type === 'careers' ? 'careers' : type === 'contests' ? 'contests' : 'grants';
    await supabase.from(table).update({ is_featured: !current }).eq('id', id);

    if (type === 'careers') {
      setCareers((prev) => prev.map((c) => (c.id === id ? { ...c, is_featured: !current } : c)));
    } else if (type === 'contests') {
      setContests((prev) => prev.map((c) => (c.id === id ? { ...c, is_featured: !current } : c)));
    } else {
      setGrants((prev) => prev.map((g) => (g.id === id ? { ...g, is_featured: !current } : g)));
    }
    setActiveMenu(null);
  }

  const filteredCareers = careers.filter(
    (c) =>
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContests = contests.filter(
    (c) => searchQuery === '' || c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGrants = grants.filter(
    (g) =>
      searchQuery === '' ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'careers' as TabType, label: 'Careers', icon: Briefcase, count: careers.length, color: 'bg-blue-100 text-blue-700' },
    { id: 'contests' as TabType, label: 'Contests', icon: Trophy, count: contests.length, color: 'bg-amber-100 text-amber-700' },
    { id: 'grants' as TabType, label: 'Grants', icon: Coins, count: grants.length, color: 'bg-emerald-100 text-emerald-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Opportunities</h1>
          <p className="text-neutral-mid mt-1">Manage careers, contests, and grants</p>
        </div>
        <div className="relative">
          <Button onClick={() => setActiveMenu(activeMenu === 'add' ? null : 'add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
          {activeMenu === 'add' && (
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-neutral-light py-1 z-20">
              <button
                onClick={() => navigate('/admin/careers/new')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-light/50 flex items-center gap-3"
              >
                <Briefcase className="w-4 h-4 text-blue-600" />
                New Job Listing
              </button>
              <button
                onClick={() => navigate('/admin/contests/new')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-light/50 flex items-center gap-3"
              >
                <Trophy className="w-4 h-4 text-amber-600" />
                New Contest
              </button>
              <button
                onClick={() => navigate('/admin/grants/new')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-light/50 flex items-center gap-3"
              >
                <Coins className="w-4 h-4 text-emerald-600" />
                New Grant
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-lg border transition-all text-left ${
                isActive
                  ? 'border-orange bg-orange/5 shadow-sm'
                  : 'border-neutral-light bg-surface hover:border-neutral-mid'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tab.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-display font-bold">{tab.count}</span>
              </div>
              <p className="text-sm font-medium">{tab.label}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-surface rounded-lg border border-neutral-light">
        <div className="p-4 border-b border-neutral-light">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-mid" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-mid">Loading...</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-light">
            {activeTab === 'careers' &&
              (filteredCareers.length > 0 ? (
                filteredCareers.map((career) => (
                  <div key={career.id} className="p-4 hover:bg-neutral-light/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-blue-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/careers/${career.id}`}
                            className="font-medium hover:text-orange transition-colors"
                          >
                            {career.title}
                          </Link>
                          {career.is_featured && <Star className="w-4 h-4 text-orange fill-orange" />}
                          {career.is_internal && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                              Internal
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-mid">
                          {career.company} &middot; {career.location} &middot; {career.type}
                        </p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === career.id ? null : career.id)}
                          className="p-2 text-neutral-mid hover:text-primary rounded-lg hover:bg-neutral-light/50"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenu === career.id && (
                          <DropdownMenu
                            onEdit={() => navigate(`/admin/careers/${career.id}`)}
                            onToggleFeatured={() => toggleFeatured('careers', career.id, career.is_featured)}
                            onDelete={() => deleteCareer(career.id)}
                            isFeatured={career.is_featured}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState type="careers" />
              ))}

            {activeTab === 'contests' &&
              (filteredContests.length > 0 ? (
                filteredContests.map((contest) => (
                  <div key={contest.id} className="p-4 hover:bg-neutral-light/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/contests/${contest.id}`}
                            className="font-medium hover:text-orange transition-colors"
                          >
                            {contest.title}
                          </Link>
                          {contest.is_featured && <Star className="w-4 h-4 text-orange fill-orange" />}
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded ${
                              contest.status === 'open'
                                ? 'bg-green-100 text-green-700'
                                : contest.status === 'upcoming'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-neutral-light text-neutral-mid'
                            }`}
                          >
                            {contest.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-mid">
                          {contest.category} &middot;{' '}
                          {contest.entry_count > 0 ? `${contest.entry_count} entries` : 'No entries yet'} &middot;{' '}
                          {contest.end_date && `Ends ${format(new Date(contest.end_date), 'MMM d, yyyy')}`}
                        </p>
                      </div>
                      <Link
                        to={`/admin/registrations?contest=${contest.id}`}
                        className="p-2 text-neutral-mid hover:text-primary rounded-lg hover:bg-neutral-light/50"
                        title="View registrations"
                      >
                        <Users className="w-4 h-4" />
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === contest.id ? null : contest.id)}
                          className="p-2 text-neutral-mid hover:text-primary rounded-lg hover:bg-neutral-light/50"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenu === contest.id && (
                          <DropdownMenu
                            onEdit={() => navigate(`/admin/contests/${contest.id}`)}
                            onToggleFeatured={() => toggleFeatured('contests', contest.id, contest.is_featured)}
                            onDelete={() => deleteContest(contest.id)}
                            isFeatured={contest.is_featured}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState type="contests" />
              ))}

            {activeTab === 'grants' &&
              (filteredGrants.length > 0 ? (
                filteredGrants.map((grant) => (
                  <div key={grant.id} className="p-4 hover:bg-neutral-light/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Coins className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/grants/${grant.id}`}
                            className="font-medium hover:text-orange transition-colors"
                          >
                            {grant.title}
                          </Link>
                          {grant.is_featured && <Star className="w-4 h-4 text-orange fill-orange" />}
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded ${
                              grant.status === 'open'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-neutral-light text-neutral-mid'
                            }`}
                          >
                            {grant.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-mid">
                          {grant.organization} &middot; ${grant.amount_min.toLocaleString()} - $
                          {grant.amount_max.toLocaleString()}
                        </p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === grant.id ? null : grant.id)}
                          className="p-2 text-neutral-mid hover:text-primary rounded-lg hover:bg-neutral-light/50"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenu === grant.id && (
                          <DropdownMenu
                            onEdit={() => navigate(`/admin/grants/${grant.id}`)}
                            onToggleFeatured={() => toggleFeatured('grants', grant.id, grant.is_featured)}
                            onDelete={() => deleteGrant(grant.id)}
                            isFeatured={grant.is_featured}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState type="grants" />
              ))}
          </div>
        )}
      </div>

      {activeMenu && activeMenu !== 'add' && (
        <div className="fixed inset-0 z-0" onClick={() => setActiveMenu(null)} />
      )}
    </div>
  );
}

function DropdownMenu({
  onEdit,
  onToggleFeatured,
  onDelete,
  isFeatured,
}: {
  onEdit: () => void;
  onToggleFeatured: () => void;
  onDelete: () => void;
  isFeatured: boolean;
}) {
  return (
    <div className="absolute right-0 mt-1 w-44 bg-surface rounded-lg shadow-lg border border-neutral-light py-1 z-10">
      <button
        onClick={onEdit}
        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-light/50 flex items-center gap-2"
      >
        <Edit2 className="w-4 h-4" />
        Edit
      </button>
      <button
        onClick={onToggleFeatured}
        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-light/50 flex items-center gap-2"
      >
        <Star className="w-4 h-4" />
        {isFeatured ? 'Remove Featured' : 'Mark Featured'}
      </button>
      <hr className="my-1 border-neutral-light" />
      <button
        onClick={onDelete}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
}

function EmptyState({ type }: { type: string }) {
  return (
    <div className="p-12 text-center">
      <div className="w-16 h-16 bg-neutral-light/50 rounded-full flex items-center justify-center mx-auto mb-4">
        {type === 'careers' && <Briefcase className="w-8 h-8 text-neutral-mid" />}
        {type === 'contests' && <Trophy className="w-8 h-8 text-neutral-mid" />}
        {type === 'grants' && <Coins className="w-8 h-8 text-neutral-mid" />}
      </div>
      <p className="text-neutral-mid font-medium">No {type} found</p>
      <p className="text-sm text-neutral-mid mt-1">Create your first one to get started</p>
    </div>
  );
}
