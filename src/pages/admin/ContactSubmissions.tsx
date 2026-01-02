import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Mail, MailOpen, Archive, Clock, Building, DollarSign, Briefcase } from 'lucide-react';
import { supabase, ContactSubmission } from '../../lib/supabase';

export function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setSubmissions(data);
    }
    setIsLoading(false);
  }

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === 'unread') return !sub.is_read;
    if (filter === 'archived') return sub.is_archived;
    return !sub.is_archived;
  });

  async function markAsRead(submission: ContactSubmission) {
    if (submission.is_read) return;

    const { error } = await supabase
      .from('contact_submissions')
      .update({ is_read: true })
      .eq('id', submission.id);

    if (!error) {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submission.id ? { ...s, is_read: true } : s))
      );
    }
  }

  async function toggleArchive(submission: ContactSubmission) {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ is_archived: !submission.is_archived })
      .eq('id', submission.id);

    if (!error) {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submission.id ? { ...s, is_archived: !s.is_archived } : s
        )
      );
      if (selectedSubmission?.id === submission.id) {
        setSelectedSubmission({ ...submission, is_archived: !submission.is_archived });
      }
    }
  }

  function handleSelectSubmission(submission: ContactSubmission) {
    setSelectedSubmission(submission);
    markAsRead(submission);
  }

  const unreadCount = submissions.filter((s) => !s.is_read && !s.is_archived).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">Contact Submissions</h1>
        <p className="text-neutral-mid mt-1">
          {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-surface rounded border border-neutral-light">
          <div className="p-4 border-b border-neutral-light">
            <div className="flex gap-2">
              {(['all', 'unread', 'archived'] as const).map((f) => (
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
          ) : filteredSubmissions.length > 0 ? (
            <div className="divide-y divide-neutral-light max-h-[600px] overflow-y-auto">
              {filteredSubmissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => handleSelectSubmission(submission)}
                  className={`w-full text-left p-4 hover:bg-neutral-light/30 transition-colors ${
                    selectedSubmission?.id === submission.id ? 'bg-neutral-light/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                        submission.is_read ? 'bg-neutral-light' : 'bg-orange'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate ${submission.is_read ? '' : 'font-semibold'}`}>
                          {submission.name}
                        </p>
                        <span className="text-xs text-neutral-mid shrink-0">
                          {format(new Date(submission.created_at), 'MMM d')}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-mid truncate">{submission.email}</p>
                      <p className="text-xs text-neutral-mid truncate mt-1">
                        {submission.message.slice(0, 50)}...
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-neutral-mid">No submissions</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-surface rounded border border-neutral-light">
          {selectedSubmission ? (
            <div>
              <div className="p-4 border-b border-neutral-light flex items-center justify-between">
                <div>
                  <h2 className="font-display font-semibold">{selectedSubmission.name}</h2>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="text-sm text-orange hover:opacity-80"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>
                <button
                  onClick={() => toggleArchive(selectedSubmission)}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    selectedSubmission.is_archived
                      ? 'bg-neutral-light text-neutral-mid'
                      : 'bg-neutral-light/50 text-neutral-mid hover:bg-neutral-light'
                  }`}
                >
                  <Archive className="w-4 h-4" />
                  {selectedSubmission.is_archived ? 'Unarchive' : 'Archive'}
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {selectedSubmission.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4 text-neutral-mid" />
                      <span>{selectedSubmission.company}</span>
                    </div>
                  )}
                  {selectedSubmission.budget_range && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-neutral-mid" />
                      <span>{selectedSubmission.budget_range}</span>
                    </div>
                  )}
                  {selectedSubmission.project_type && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-neutral-mid" />
                      <span>{selectedSubmission.project_type}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-neutral-mid" />
                    <span>{format(new Date(selectedSubmission.created_at), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                </div>

                <div className="bg-neutral-light/30 p-6 rounded">
                  <h3 className="text-xs uppercase tracking-wider text-neutral-mid font-medium mb-4">
                    Message
                  </h3>
                  <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <a
                    href={`mailto:${selectedSubmission.email}?subject=Re: Your inquiry to Optal Communications`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-surface rounded text-sm font-medium hover:bg-neutral-dark transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <MailOpen className="w-12 h-12 text-neutral-light mx-auto mb-4" />
                <p className="text-neutral-mid">Select a submission to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
