import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { UserCheck, UserX, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase, AdminRequest } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function AccessRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [denialReason, setDenialReason] = useState('');
  const [showDenialForm, setShowDenialForm] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const { data } = await supabase
      .from('admin_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setRequests(data);
    }
    setIsLoading(false);
  }

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  async function handleApprove(request: AdminRequest) {
    setIsProcessing(true);

    const { error: updateError } = await supabase
      .from('admin_requests')
      .update({
        status: 'approved',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', request.id);

    if (updateError) {
      alert('Error approving request: ' + updateError.message);
      setIsProcessing(false);
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', request.user_id);

    if (profileError) {
      alert('Error updating user role: ' + profileError.message);
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? { ...r, status: 'approved', reviewed_by: user?.id || null, reviewed_at: new Date().toISOString() }
          : r
      )
    );

    setSelectedRequest(null);
    setIsProcessing(false);
  }

  async function handleDeny(request: AdminRequest) {
    if (!denialReason.trim()) {
      alert('Please provide a reason for denial');
      return;
    }

    setIsProcessing(true);

    const { error } = await supabase
      .from('admin_requests')
      .update({
        status: 'denied',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        denial_reason: denialReason,
      })
      .eq('id', request.id);

    if (error) {
      alert('Error denying request: ' + error.message);
      setIsProcessing(false);
      return;
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? {
              ...r,
              status: 'denied',
              reviewed_by: user?.id || null,
              reviewed_at: new Date().toISOString(),
              denial_reason: denialReason,
            }
          : r
      )
    );

    setSelectedRequest(null);
    setShowDenialForm(false);
    setDenialReason('');
    setIsProcessing(false);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'denied':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
            <XCircle className="w-3 h-3" />
            Denied
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Access Requests</h1>
        <p className="text-neutral-mid mt-1">
          {pendingCount > 0
            ? `${pendingCount} pending request${pendingCount > 1 ? 's' : ''}`
            : 'No pending requests'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-surface rounded border border-neutral-light">
          <div className="p-4 border-b border-neutral-light">
            <div className="flex gap-2 flex-wrap">
              {(['pending', 'approved', 'denied', 'all'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    filter === f
                      ? 'bg-primary text-surface'
                      : 'bg-neutral-light/50 text-neutral-mid hover:bg-neutral-light'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === 'pending' && pendingCount > 0 && (
                    <span className="ml-1 bg-orange text-surface text-[10px] px-1.5 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-neutral-light rounded animate-pulse" />
              ))}
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="divide-y divide-neutral-light max-h-[600px] overflow-y-auto">
              {filteredRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowDenialForm(false);
                    setDenialReason('');
                  }}
                  className={`w-full text-left p-4 hover:bg-neutral-light/30 transition-colors ${
                    selectedRequest?.id === request.id ? 'bg-neutral-light/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{request.name}</p>
                      <p className="text-xs text-neutral-mid truncate">{request.email}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-xs text-neutral-mid mt-2">
                    {format(new Date(request.created_at), 'MMM d, yyyy')}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-neutral-mid">No requests found</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-surface rounded border border-neutral-light">
          {selectedRequest ? (
            <div>
              <div className="p-4 border-b border-neutral-light flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold">{selectedRequest.name}</h2>
                  <a
                    href={`mailto:${selectedRequest.email}`}
                    className="text-sm text-orange hover:opacity-80"
                  >
                    {selectedRequest.email}
                  </a>
                </div>
                {getStatusBadge(selectedRequest.status)}
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-neutral-mid font-medium mb-2">
                    Request Date
                  </h3>
                  <p>{format(new Date(selectedRequest.created_at), 'MMMM d, yyyy h:mm a')}</p>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider text-neutral-mid font-medium mb-2">
                    Reason for Access
                  </h3>
                  <div className="bg-neutral-light/30 p-4 rounded">
                    <p className="whitespace-pre-wrap">{selectedRequest.reason}</p>
                  </div>
                </div>

                {selectedRequest.status === 'denied' && selectedRequest.denial_reason && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-neutral-mid font-medium mb-2">
                      Denial Reason
                    </h3>
                    <div className="bg-red-50 border border-red-100 p-4 rounded">
                      <p className="text-red-700">{selectedRequest.denial_reason}</p>
                    </div>
                  </div>
                )}

                {selectedRequest.reviewed_at && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-neutral-mid font-medium mb-2">
                      Reviewed
                    </h3>
                    <p className="text-sm text-neutral-mid">
                      {format(new Date(selectedRequest.reviewed_at), 'MMMM d, yyyy h:mm a')}
                    </p>
                  </div>
                )}

                {selectedRequest.status === 'pending' && (
                  <>
                    {showDenialForm ? (
                      <div className="space-y-4 pt-4 border-t border-neutral-light">
                        <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded text-sm">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          Please provide a reason for denying this request.
                        </div>
                        <Textarea
                          label="Denial Reason"
                          value={denialReason}
                          onChange={(e) => setDenialReason(e.target.value)}
                          placeholder="Explain why this request is being denied..."
                          rows={3}
                        />
                        <div className="flex gap-3">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setShowDenialForm(false);
                              setDenialReason('');
                            }}
                          >
                            Cancel
                          </Button>
                          <button
                            onClick={() => handleDeny(selectedRequest)}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            <UserX className="w-4 h-4" />
                            Confirm Denial
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3 pt-4 border-t border-neutral-light">
                        <button
                          onClick={() => handleApprove(selectedRequest)}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <UserCheck className="w-4 h-4" />
                          Approve Request
                        </button>
                        <button
                          onClick={() => setShowDenialForm(true)}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          <UserX className="w-4 h-4" />
                          Deny Request
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <UserCheck className="w-12 h-12 text-neutral-light mx-auto mb-4" />
                <p className="text-neutral-mid">Select a request to review</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
