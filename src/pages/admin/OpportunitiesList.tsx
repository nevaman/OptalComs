import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreHorizontal, Briefcase, Trophy, Clock, CheckCircle, XCircle, Coins } from 'lucide-react';
import { supabase, Opportunity } from '../../lib/supabase';
import { format } from 'date-fns';
import { Button } from '../../components/ui/Button';

export function OpportunitiesList() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'job' | 'contest' | 'grant'>('all');

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

  const filteredOpportunities = opportunities.filter((op) => {
    const matchesSearch = op.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || op.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Opportunities</h1>
          <p className="text-neutral-mid mt-1">Manage careers and contests</p>
        </div>
        <Button onClick={() => navigate('/admin/opportunities/new')} variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Opportunity
        </Button>
      </div>

      <div className="bg-surface rounded border border-neutral-light overflow-hidden">
        <div className="p-4 border-b border-neutral-light flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-mid" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'job', 'contest', 'grant'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  typeFilter === t
                    ? 'bg-primary text-surface'
                    : 'bg-neutral-light text-neutral-mid hover:bg-neutral-light/80'
                }`}
              >
                {t === 'all' ? 'All' : t === 'job' ? 'Jobs' : t === 'contest' ? 'Contests' : 'Grants'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-mid">Loading opportunities...</p>
          </div>
        ) : filteredOpportunities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-neutral-light/30">
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Deadline</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-light">
                {filteredOpportunities.map((op) => (
                  <tr key={op.id} className="hover:bg-neutral-light/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{op.title}</div>
                      <div className="text-xs text-neutral-mid truncate max-w-[200px]">{op.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
                        op.type === 'job'
                          ? 'bg-blue-100 text-blue-700'
                          : op.type === 'contest'
                            ? 'bg-orange/10 text-orange'
                            : 'bg-green-100 text-green-700'
                      }`}>
                        {op.type === 'job' && <Briefcase className="w-3 h-3" />}
                        {op.type === 'contest' && <Trophy className="w-3 h-3" />}
                        {op.type === 'grant' && <Coins className="w-3 h-3" />}
                        {op.type === 'job' ? 'Career' : op.type === 'contest' ? 'Contest' : 'Grant'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(op.status)}
                        <span className="capitalize">{op.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-mid">
                      {op.deadline ? format(new Date(op.deadline), 'MMM d, yyyy') : 'No deadline'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/opportunities/${op.id}`}
                          className="p-2 text-neutral-mid hover:text-primary transition-colors"
                        >
                          Edit
                        </Link>
                        <button className="p-2 text-neutral-mid hover:text-red-500 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-neutral-light mx-auto mb-4" />
            <p className="text-neutral-mid">No opportunities found</p>
          </div>
        )}
      </div>
    </div>
  );
}
