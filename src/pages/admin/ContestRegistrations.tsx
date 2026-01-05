import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Mail,
  ExternalLink,
  User,
  Calendar,
  MapPin,
  Globe,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  MoreHorizontal,
  Trophy,
  Copy,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../../components/ui/Button';
import { Application, Opportunity, supabase } from '../../lib/supabase';

type ContestRegistration = (Application & { opportunities: Opportunity | null });

const experienceLevels: Record<string, string> = {
  student: 'Student',
  junior: 'Junior (0-2 years)',
  mid: 'Mid-level (2-5 years)',
  senior: 'Senior (5+ years)',
  lead: 'Lead / Director',
};

const howHeardOptions: Record<string, string> = {
  social_media: 'Social Media',
  search: 'Search Engine',
  friend: 'Friend / Colleague',
  newsletter: 'Newsletter',
  website: 'Our Website',
  other: 'Other',
};

export function ContestRegistrations() {
  const [searchParams] = useSearchParams();
  const contestIdFilter = searchParams.get('contest');

  const [registrations, setRegistrations] = useState<ContestRegistration[]>([]);
  const [contests, setContests] = useState<{ id: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [contestFilter, setContestFilter] = useState<string>(contestIdFilter || 'all');
  const [selectedRegistration, setSelectedRegistration] = useState<ContestRegistration | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*, opportunities(*)')
      .eq('submission_type', 'contest')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setRegistrations((data as any) || []);
      const contestOptions = Array.from(
        new Map(
          (data || [])
            .map((app: any) => app.opportunities)
            .filter(Boolean)
            .map((op: Opportunity) => [op.id, { id: op.id, title: op.title }])
        ).values()
      );
      setContests(contestOptions as { id: string; title: string }[]);
    }
    setIsLoading(false);
  }

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      searchQuery === '' ||
      reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.registration_code || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    const matchesContest = contestFilter === 'all' || reg.opportunity_id === contestFilter;
    return matchesSearch && matchesStatus && matchesContest;
  });

  const updateStatus = async (id: string, status: ContestRegistration['status']) => {
    await supabase.from('applications').update({ status }).eq('id', id);
    setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Country', 'Occupation', 'Experience', 'Portfolio', 'Registration Code', 'Contest', 'Status', 'Registered At'];
    const rows = filteredRegistrations.map((reg) => [
      reg.full_name,
      reg.email,
      reg.phone,
      reg.country,
      reg.occupation,
      experienceLevels[reg.experience || ''] || reg.experience || '',
      reg.portfolio_link,
      reg.registration_code || '',
      reg.opportunities?.title || '',
      reg.status,
      format(new Date(reg.created_at), 'yyyy-MM-dd HH:mm'),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contest-registrations-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const getStatusBadge = (status: ContestRegistration['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
    }
  };

  const stats = {
    total: registrations.filter((r) => contestFilter === 'all' || r.opportunity_id === contestFilter).length,
    pending: registrations.filter((r) => (contestFilter === 'all' || r.opportunity_id === contestFilter) && r.status === 'pending').length,
    approved: registrations.filter((r) => (contestFilter === 'all' || r.opportunity_id === contestFilter) && r.status === 'approved').length,
    rejected: registrations.filter((r) => (contestFilter === 'all' || r.opportunity_id === contestFilter) && r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Contest Registrations</h1>
          <p className="text-neutral-mid mt-1">
            View and manage contest participant registrations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded border border-neutral-light">
          <p className="text-sm text-neutral-mid">Total Registrations</p>
          <p className="text-2xl font-display font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-surface p-4 rounded border border-neutral-light">
          <p className="text-sm text-neutral-mid">Pending</p>
          <p className="text-2xl font-display font-bold text-blue-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-surface p-4 rounded border border-neutral-light">
          <p className="text-sm text-neutral-mid">Approved</p>
          <p className="text-2xl font-display font-bold text-green-600 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-surface p-4 rounded border border-neutral-light">
          <p className="text-sm text-neutral-mid">Rejected</p>
          <p className="text-2xl font-display font-bold text-red-600 mt-1">{stats.rejected}</p>
        </div>
      </div>

      <div className="bg-surface rounded border border-neutral-light overflow-hidden">
        <div className="p-4 border-b border-neutral-light space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-mid" />
              <input
                type="text"
                placeholder="Search by name, email, or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-light rounded focus:border-orange focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-light rounded hover:bg-neutral-light/30 transition-colors md:hidden"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <div className={`flex flex-col md:flex-row gap-2 ${showFilters ? 'block' : 'hidden md:flex'}`}>
              <select
                value={contestFilter}
                onChange={(e) => setContestFilter(e.target.value)}
                className="px-3 py-2.5 border border-neutral-light rounded focus:border-orange focus:outline-none bg-surface"
              >
                <option value="all">All Contests</option>
                {contests.map((contest) => (
                  <option key={contest.id} value={contest.id}>
                    {contest.title}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 border border-neutral-light rounded focus:border-orange focus:outline-none bg-surface"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200">
            Failed to load registrations: {error}
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-neutral-mid">Loading registrations...</p>
          </div>
        ) : filteredRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-neutral-light/30">
                  <th className="px-4 py-3 font-semibold">Participant</th>
                  <th className="px-4 py-3 font-semibold">Code</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Contest</th>
                  <th className="px-4 py-3 font-semibold hidden lg:table-cell">Country</th>
                  <th className="px-4 py-3 font-semibold hidden lg:table-cell">Experience</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-light">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-neutral-light/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-orange" />
                        </div>
                        <div>
                          <p className="font-medium">{reg.full_name}</p>
                          <p className="text-xs text-neutral-mid">{reg.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <code className="text-xs font-mono bg-neutral-light/50 px-2 py-1 rounded">
                          {reg.registration_code || '—'}
                        </code>
                        <button
                          onClick={() => reg.registration_code && copyCode(reg.registration_code)}
                          className="p-1 text-neutral-mid hover:text-orange transition-colors"
                          title="Copy code"
                          >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-neutral-mid">{reg.opportunities?.title || 'Unknown contest'}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-sm text-neutral-mid">
                        <MapPin className="w-3 h-3" />
                        {reg.country || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-neutral-mid">
                        {experienceLevels[reg.experience || ''] || reg.experience || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(reg.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setSelectedRegistration(reg)}
                          className="p-2 text-neutral-mid hover:text-primary hover:bg-neutral-light/50 rounded transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                          <button className="p-2 text-neutral-mid hover:text-primary hover:bg-neutral-light/50 rounded transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-neutral-light rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <button
                              onClick={() => updateStatus(reg.id, 'pending')}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-light/30 transition-colors flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4 text-blue-600" />
                              Mark Pending
                            </button>
                            <button
                              onClick={() => updateStatus(reg.id, 'approved')}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-light/30 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              Mark Approved
                            </button>
                            <button
                              onClick={() => updateStatus(reg.id, 'rejected')}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-light/30 transition-colors flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4 text-red-600" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Trophy className="w-12 h-12 text-neutral-light mx-auto mb-4" />
            <p className="text-neutral-mid">No registrations found</p>
          </div>
        )}
      </div>

      {selectedRegistration && (
        <RegistrationDetailModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          onUpdateStatus={(status) => {
            updateStatus(selectedRegistration.id, status);
            setSelectedRegistration({ ...selectedRegistration, status });
          }}
        />
      )}
    </div>
  );
}

function RegistrationDetailModal({
  registration,
  onClose,
  onUpdateStatus,
}: {
  registration: ContestRegistration;
  onClose: () => void;
  onUpdateStatus: (status: ContestRegistration['status']) => void;
}) {
  const copyCode = () => {
    if (registration.registration_code) {
      navigator.clipboard.writeText(registration.registration_code);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold">Registration Details</h2>
          <button onClick={onClose} className="p-2 text-neutral-mid hover:text-primary">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-orange" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold">{registration.full_name}</h3>
              <p className="text-neutral-mid">{registration.opportunities?.title || 'Contest registration'}</p>
            </div>
          </div>

          {registration.registration_code && (
            <div className="p-4 bg-neutral-light/30 rounded-lg">
              <p className="text-xs text-neutral-mid mb-1">Registration Code</p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono font-bold">{registration.registration_code}</code>
                <button
                  onClick={copyCode}
                  className="p-1 text-neutral-mid hover:text-orange transition-colors"
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-mid mb-1">Email</p>
              <a
                href={`mailto:${registration.email}`}
                className="text-sm text-orange hover:underline flex items-center gap-1"
              >
                <Mail className="w-3 h-3" />
                {registration.email}
              </a>
            </div>
            <div>
              <p className="text-xs text-neutral-mid mb-1">Country</p>
              <p className="text-sm flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-mid" />
                {registration.country || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-mid mb-1">Portfolio</p>
              {registration.portfolio_link ? (
                <a
                  href={registration.portfolio_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange hover:underline flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  {registration.portfolio_link}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-sm text-neutral-mid">—</p>
              )}
            </div>
            <div>
              <p className="text-xs text-neutral-mid mb-1">Registered</p>
              <p className="text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3 text-neutral-mid" />
                {format(new Date(registration.created_at), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-neutral-mid mb-1">How they heard about us</p>
            <p className="text-sm">{howHeardOptions[registration.how_heard || ''] || registration.how_heard || '-'}</p>
          </div>

          <div className="border-t border-neutral-light pt-4">
            <p className="text-xs text-neutral-mid mb-3">Update Status</p>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateStatus('pending')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded border transition-colors ${
                  registration.status === 'pending'
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'border-neutral-light hover:bg-neutral-light/30'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => onUpdateStatus('approved')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded border transition-colors ${
                  registration.status === 'approved'
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'border-neutral-light hover:bg-neutral-light/30'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => onUpdateStatus('rejected')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded border transition-colors ${
                  registration.status === 'rejected'
                    ? 'bg-red-100 border-red-300 text-red-700'
                    : 'border-neutral-light hover:bg-neutral-light/30'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
