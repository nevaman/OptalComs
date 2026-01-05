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
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { Button } from '../../components/ui/Button';

type OpportunityType = 'job' | 'contest' | 'grant';
type OpportunityStatus = 'draft' | 'open' | 'closed';

interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  slug: string;
  description: string;
  status: OpportunityStatus;
  is_featured: boolean;
  deadline: string | null;
  location: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

const typeConfig = {
  job: { label: 'Job', icon: Briefcase, color: 'bg-blue-100 text-blue-700' },
  contest: { label: 'Contest', icon: Trophy, color: 'bg-amber-100 text-amber-700' },
  grant: { label: 'Grant', icon: Coins, color: 'bg-emerald-100 text-emerald-700' },
};

const statusConfig = {
  draft: { label: 'Draft', icon: EyeOff, color: 'text-neutral-mid bg-neutral-light' },
  open: { label: 'Open', icon: CheckCircle, color: 'text-green-700 bg-green-100' },
  closed: { label: 'Closed', icon: XCircle, color: 'text-red-700 bg-red-100' },
};

export function OpportunitiesDashboard() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<OpportunityType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | 'all'>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOpportunities(data);
    }
    setIsLoading(false);
  }

  async function deleteOpportunity(id: string) {
    if (!confirm('Are you sure you want to delete this opportunity? This cannot be undone.')) return;

    const { error } = await supabase.from('opportunities').delete().eq('id', id);
    if (!error) {
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
    }
    setActiveMenu(null);
  }

  async function toggleFeatured(id: string, currentValue: boolean) {
    const { error } = await supabase
      .from('opportunities')
      .update({ is_featured: !currentValue })
      .eq('id', id);

    if (!error) {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? { ...o, is_featured: !currentValue } : o))
      );
    }
    setActiveMenu(null);
  }

  async function toggleStatus(id: string, currentStatus: OpportunityStatus) {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    const { error } = await supabase
      .from('opportunities')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    }
    setActiveMenu(null);
  }

  const filtered = opportunities.filter((o) => {
    const matchesSearch = searchQuery === '' ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || o.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const counts = {
    all: opportunities.length,
    job: opportunities.filter((o) => o.type === 'job').length,
    contest: opportunities.filter((o) => o.type === 'contest').length,
    grant: opportunities.filter((o) => o.type === 'grant').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Opportunities</h1>
          <p className="text-neutral-mid mt-1">Manage jobs, contests, and grants</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Button variant="primary" onClick={() => setActiveMenu(activeMenu === 'add' ? null : 'add')}>
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
            {activeMenu === 'add' && (
              <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-neutral-light py-1 z-20">
                <button
                  onClick={() => navigate('/admin/opportunities/job/new')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-light/50 flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  New Job Listing
                </button>
                <button
                  onClick={() => navigate('/admin/opportunities/contest/new')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-light/50 flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-amber-600" />
                  New Contest
                </button>
                <button
                  onClick={() => navigate('/admin/opportunities/grant/new')}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-light/50 flex items-center gap-2"
                >
                  <Coins className="w-4 h-4 text-emerald-600" />
                  New Grant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['all', 'job', 'contest', 'grant'] as const).map((type) => {
          const isActive = typeFilter === type;
          const config = type === 'all' ? null : typeConfig[type];
          const Icon = config?.icon || Briefcase;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`p-4 rounded-lg border transition-all text-left ${
                isActive
                  ? 'border-orange bg-orange/5 shadow-sm'
                  : 'border-neutral-light bg-surface hover:border-neutral-mid'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {config ? (
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-neutral-light">
                    <Briefcase className="w-4 h-4 text-neutral-mid" />
                  </div>
                )}
                <span className="text-2xl font-display font-bold">{counts[type]}</span>
              </div>
              <p className="text-sm text-neutral-mid capitalize">{type === 'all' ? 'All Types' : `${type}s`}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-surface rounded-lg border border-neutral-light">
        <div className="p-4 border-b border-neutral-light flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-mid" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'draft', 'open', 'closed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === status
                    ? 'bg-primary text-surface'
                    : 'bg-neutral-light/50 text-neutral-mid hover:bg-neutral-light'
                }`}
              >
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-mid">Loading opportunities...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="divide-y divide-neutral-light">
            {filtered.map((opportunity) => {
              const config = typeConfig[opportunity.type];
              const Icon = config.icon;
              const status = statusConfig[opportunity.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={opportunity.id}
                  className="p-4 hover:bg-neutral-light/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          to={`/admin/opportunities/${opportunity.type}/${opportunity.id}`}
                          className="font-medium hover:text-orange transition-colors truncate"
                        >
                          {opportunity.title}
                        </Link>
                        {opportunity.is_featured && (
                          <Star className="w-4 h-4 text-orange fill-orange flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-mid">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                        {opportunity.location && (
                          <span>{opportunity.location}</span>
                        )}
                        {opportunity.deadline && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(opportunity.deadline), 'MMM d, yyyy')}
                          </span>
                        )}
                        <span>Created {format(new Date(opportunity.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>

                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setActiveMenu(activeMenu === opportunity.id ? null : opportunity.id)}
                        className="p-2 text-neutral-mid hover:text-primary hover:bg-neutral-light/50 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {activeMenu === opportunity.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-surface rounded-lg shadow-lg border border-neutral-light py-1 z-10">
                          <Link
                            to={`/admin/opportunities/${opportunity.type}/${opportunity.id}`}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-light/50 flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Link>
                          <button
                            onClick={() => toggleFeatured(opportunity.id, opportunity.is_featured)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-light/50 flex items-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            {opportunity.is_featured ? 'Remove Featured' : 'Mark Featured'}
                          </button>
                          {opportunity.status !== 'draft' && (
                            <button
                              onClick={() => toggleStatus(opportunity.id, opportunity.status)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-light/50 flex items-center gap-2"
                            >
                              {opportunity.status === 'open' ? (
                                <>
                                  <EyeOff className="w-4 h-4" />
                                  Close
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4" />
                                  Reopen
                                </>
                              )}
                            </button>
                          )}
                          <hr className="my-1 border-neutral-light" />
                          <button
                            onClick={() => deleteOpportunity(opportunity.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-neutral-light/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-neutral-mid" />
            </div>
            <p className="text-neutral-mid font-medium">No opportunities found</p>
            <p className="text-sm text-neutral-mid mt-1">
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first opportunity to get started'}
            </p>
          </div>
        )}
      </div>

      {activeMenu && activeMenu !== 'add' && (
        <div className="fixed inset-0 z-0" onClick={() => setActiveMenu(null)} />
      )}
    </div>
  );
}
