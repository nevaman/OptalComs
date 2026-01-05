import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Briefcase, Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase, Career, Contest } from '../../lib/supabase';
import { format } from 'date-fns';
import { Button } from '../../components/ui/Button';

export function OpportunitiesList() {
  const navigate = useNavigate();
  const [careers, setCareers] = useState<Career[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'careers' | 'contests'>('careers');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    
    const { data: careersData } = await supabase
      .from('careers')
      .select('*')
      .order('created_at', { ascending: false });
      
    const { data: contestsData } = await supabase
      .from('contests')
      .select('*')
      .order('created_at', { ascending: false });

    if (careersData) setCareers(careersData);
    if (contestsData) setContests(contestsData);
    
    setIsLoading(false);
  }

  const filteredCareers = careers.filter((c) => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContests = contests.filter((c) => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    // Determine status logic if not explicit field
    return <Clock className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Opportunities</h1>
          <p className="text-neutral-mid mt-1">Manage careers and contests</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin/careers/new')} variant="secondary">
            <Plus className="w-4 h-4 mr-2" />
            Add Career
          </Button>
          <Button onClick={() => navigate('/admin/contests/new')} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Contest
          </Button>
        </div>
      </div>

      <div className="bg-surface rounded border border-neutral-light overflow-hidden">
        <div className="p-4 border-b border-neutral-light flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-mid" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('careers')}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                activeTab === 'careers'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-neutral-light text-neutral-mid hover:bg-neutral-light/80'
              }`}
            >
              Careers ({filteredCareers.length})
            </button>
            <button
              onClick={() => setActiveTab('contests')}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                activeTab === 'contests'
                  ? 'bg-orange/10 text-orange'
                  : 'bg-neutral-light text-neutral-mid hover:bg-neutral-light/80'
              }`}
            >
              Contests ({filteredContests.length})
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center animate-pulse">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-neutral-light/30">
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">
                    {activeTab === 'careers' ? 'Company' : 'Category'}
                  </th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Posted/Start</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-light">
                {activeTab === 'careers' ? (
                  filteredCareers.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-light/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{item.title}</td>
                      <td className="px-6 py-4">{item.company}</td>
                      <td className="px-6 py-4">
                        {item.is_internal ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Internal</span>
                        ) : (
                          <span className="px-2 py-1 bg-neutral-light text-neutral-mid text-xs rounded">External</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-neutral-mid">
                        {format(new Date(item.posted_at), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/careers/${item.id}`}
                          className="text-primary hover:text-orange font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredContests.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-light/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{item.title}</td>
                      <td className="px-6 py-4 capitalize">{item.category}</td>
                      <td className="px-6 py-4 capitalize">{item.status}</td>
                      <td className="px-6 py-4 text-neutral-mid">
                        {format(new Date(item.start_date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/contests/${item.id}`}
                          className="text-primary hover:text-orange font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
                {((activeTab === 'careers' && filteredCareers.length === 0) || 
                  (activeTab === 'contests' && filteredContests.length === 0)) && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-mid">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
