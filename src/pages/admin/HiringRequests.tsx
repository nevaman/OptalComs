import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Building2,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  ChevronDown,
  X,
  Archive,
  Trash2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { format } from 'date-fns';
import { supabase, type HiringRequest } from '../../lib/supabase';

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: Clock },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700', icon: Mail },
  in_progress: { label: 'In Progress', color: 'bg-orange/10 text-orange', icon: Users },
  closed: { label: 'Closed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  archived: { label: 'Archived', color: 'bg-neutral-light text-neutral-mid', icon: Archive },
};

const budgetLabels: Record<string, string> = {
  'under-2000': 'Under $2,000/mo',
  '2000-3500': '$2,000 - $3,500/mo',
  '3500-5000': '$3,500 - $5,000/mo',
  '5000-10000': '$5,000 - $10,000/mo',
  '10000+': '$10,000+/mo',
};

export function HiringRequests() {
  const [requests, setRequests] = useState<HiringRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<HiringRequest | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('hiring_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data);
      if (selectedRequest) {
        const updatedSelection = data.find((req) => req.id === selectedRequest.id);
        if (updatedSelection) setSelectedRequest(updatedSelection);
      }
    }
    setIsLoading(false);
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchQuery === '' ||
      [request.name, request.company, request.email, request.role]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id: string, status: HiringRequest['status']) => {
    const { data, error } = await supabase
      .from('hiring_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setRequests(prev => prev.map(r => r.id === id ? data : r));
      if (selectedRequest?.id === id) {
        setSelectedRequest(data);
      }
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    const { data, error } = await supabase
      .from('hiring_requests')
      .update({ notes })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setRequests(prev => prev.map(r => r.id === id ? data : r));
      if (selectedRequest?.id === id) {
        setSelectedRequest(data);
      }
    }
  };

  const deleteRequest = async (id: string) => {
    if (confirm('Are you sure you want to delete this hiring request?')) {
      const { error } = await supabase.from('hiring_requests').delete().eq('id', id);
      if (!error) {
        setRequests(prev => prev.filter(r => r.id !== id));
        if (selectedRequest?.id === id) {
          setSelectedRequest(null);
        }
      }
    }
  };

  const statusCounts = {
    all: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    contacted: requests.filter(r => r.status === 'contacted').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    closed: requests.filter(r => r.status === 'closed').length,
    archived: requests.filter(r => r.status === 'archived').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Hiring Requests</h1>
          <p className="text-neutral-mid mt-1">Manage inquiries from companies looking to hire talent</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-mid">
            {statusCounts.new} new request{statusCounts.new !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-mid" />
          <input
            type="text"
            placeholder="Search by name, company, email, or role..."
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
      </div>

      <div className={`flex gap-2 flex-wrap ${showFilters ? 'block' : 'hidden md:flex'}`}>
        {(['all', 'new', 'contacted', 'in_progress', 'closed', 'archived'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              statusFilter === status
                ? 'bg-primary text-surface'
                : 'bg-neutral-light/50 text-neutral-mid hover:bg-neutral-light'
            }`}
          >
            {status === 'all' ? 'All' : statusConfig[status].label} ({statusCounts[status]})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-surface rounded border border-neutral-light overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center animate-pulse text-neutral-mid">Loading requests...</div>
            ) : filteredRequests.length > 0 ? (
              <div className="divide-y divide-neutral-light">
                {[...filteredRequests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((request) => {
                  const StatusIcon = statusConfig[request.status].icon;
                  return (
                    <div
                      key={request.id}
                      onClick={() => setSelectedRequest(request)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-neutral-light/30 ${
                        selectedRequest?.id === request.id ? 'bg-orange/5 border-l-2 border-l-orange' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{request.name}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[request.status].color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[request.status].label}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-mid mb-2">
                            {request.company || 'Unknown company'} • Looking for {request.role || 'Role not provided'}
                          </p>
                          <p className="text-sm text-neutral-mid line-clamp-2">{request.message || 'No message provided'}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-neutral-mid">
                            {format(new Date(request.created_at), 'MMM d, yyyy')}
                          </p>
                          <p className="text-xs text-neutral-mid mt-1">
                            {format(new Date(request.created_at), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-neutral-light mx-auto mb-4" />
                <p className="text-neutral-mid">No hiring requests found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedRequest ? (
            <RequestDetail
              request={selectedRequest}
              onUpdateStatus={updateStatus}
              onUpdateNotes={updateNotes}
              onDelete={deleteRequest}
              onClose={() => setSelectedRequest(null)}
            />
          ) : (
            <div className="bg-surface rounded border border-neutral-light p-8 text-center">
              <Eye className="w-12 h-12 text-neutral-light mx-auto mb-4" />
              <p className="text-neutral-mid">Select a request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RequestDetail({
  request,
  onUpdateStatus,
  onUpdateNotes,
  onDelete,
  onClose,
}: {
  request: HiringRequest;
  onUpdateStatus: (id: string, status: HiringRequest['status']) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState(request.notes || '');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const StatusIcon = statusConfig[request.status].icon;

  const handleNotesBlur = () => {
    if (notes !== request.notes) {
      onUpdateNotes(request.id, notes);
    }
  };

  return (
    <div className="bg-surface rounded border border-neutral-light overflow-hidden sticky top-24">
      <div className="p-4 border-b border-neutral-light flex items-center justify-between">
        <h3 className="font-display font-bold">Request Details</h3>
        <button onClick={onClose} className="p-1 text-neutral-mid hover:text-primary lg:hidden">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h4 className="font-medium text-lg">{request.name}</h4>
          <p className="text-sm text-neutral-mid">{request.company || 'Company not provided'}</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`w-full inline-flex items-center justify-between gap-2 px-3 py-2 rounded text-sm font-medium ${statusConfig[request.status].color}`}
          >
            <span className="inline-flex items-center gap-2">
              <StatusIcon className="w-4 h-4" />
              {statusConfig[request.status].label}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showStatusDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-neutral-light rounded shadow-lg z-10">
              {(['new', 'contacted', 'in_progress', 'closed', 'archived'] as const).map((status) => {
                const Icon = statusConfig[status].icon;
                return (
                  <button
                    key={status}
                    onClick={() => {
                      onUpdateStatus(request.id, status);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-neutral-light/50 ${
                      request.status === status ? 'bg-neutral-light/30' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {statusConfig[status].label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-neutral-mid" />
            <a href={`mailto:${request.email}`} className="text-orange hover:underline">
              {request.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-neutral-mid" />
            <span>{request.company || 'Company not provided'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-neutral-mid" />
            <span>{request.team_size ? `${request.team_size} employees` : 'Team size not provided'}</span>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-4 h-4 text-neutral-mid" />
            <span>{budgetLabels[request.budget] || request.budget || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-neutral-mid" />
            <span>{format(new Date(request.created_at), 'MMM d, yyyy h:mm a')}</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-mid uppercase tracking-wider mb-2">Role Requested</p>
          <span className="inline-block px-3 py-1 bg-orange/10 text-orange rounded-full text-sm font-medium">
            {request.role || 'Not specified'}
          </span>
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-mid uppercase tracking-wider mb-2">Message</p>
          <p className="text-sm bg-neutral-light/30 p-3 rounded">{request.message || 'No message provided'}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-mid uppercase tracking-wider mb-2">Internal Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none text-sm resize-none"
            placeholder="Add internal notes about this request..."
          />
        </div>

        <div className="flex gap-2 pt-4 border-t border-neutral-light">
          <a
            href={`mailto:${request.email}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange text-surface rounded text-sm font-medium hover:bg-orange/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Send Email
          </a>
          <button
            onClick={() => onDelete(request.id)}
            className="p-2 text-neutral-mid hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Delete request"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
