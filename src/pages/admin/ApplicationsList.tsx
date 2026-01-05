import { useEffect, useState } from 'react';
import { supabase, JobApplication, Career } from '../../lib/supabase';
import { format } from 'date-fns';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Github, 
  Globe, 
  FileText,
  UserCheck,
  UserX,
  Eye
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

// Extended type for join
type JobApplicationWithCareer = JobApplication & { careers: Career };

export function ApplicationsList() {
  const [applications, setApplications] = useState<JobApplicationWithCareer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedApplication, setSelectedApplication] = useState<JobApplicationWithCareer | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, careers(*)')
      .order('applied_at', { ascending: false });

    if (!error && data) {
      setApplications(data as any);
    }
    setIsLoading(false);
  }

  const handleUpdateStatus = async (application: JobApplicationWithCareer, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('job_applications')
      .update({ status: newStatus })
      .eq('id', application.id);

    if (error) {
      alert('Error updating application: ' + error.message);
      return;
    }

    if (newStatus === 'approved') {
      // If approved, create a talent profile? 
      // Note: original code did this. I'll keep it but adapt fields.
      // Need user_id? job_applications doesn't have user_id in my schema, only email.
      // So I can't easily link to a user unless I lookup by email or invite them.
      // I'll skip creating talent profile automatically for now or just log it.
      // Or if I assume they are users, I need user_id. 
      // The requirement didn't specify auto-creating talent profiles, but "Full Control... Approve Applications".
      // I'll just update status.
    }

    setApplications((prev) =>
      prev.map((app) => (app.id === application.id ? { ...app, status: newStatus } : app))
    );
    
    if (selectedApplication?.id === application.id) {
      setSelectedApplication({ ...selectedApplication, status: newStatus });
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Job Applications</h1>
          <p className="text-neutral-mid mt-1">Review and manage job applications</p>
        </div>
        <div className="flex gap-2">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                filter === f
                  ? 'bg-primary text-surface'
                  : 'bg-neutral-light text-neutral-mid hover:bg-neutral-light/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-surface rounded border border-neutral-light overflow-hidden">
          <div className="divide-y divide-neutral-light overflow-y-auto max-h-[600px]">
            {isLoading ? (
              <div className="p-8 text-center animate-pulse">Loading...</div>
            ) : filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApplication(app)}
                  className={`w-full text-left p-4 hover:bg-neutral-light/30 transition-colors ${
                    selectedApplication?.id === app.id ? 'bg-neutral-light/50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold truncate">{app.name}</p>
                    {app.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                    {app.status === 'approved' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {app.status === 'rejected' && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <p className="text-xs text-neutral-mid truncate mb-2">{app.careers?.title}</p>
                  <p className="text-[10px] text-neutral-mid">
                    {format(new Date(app.applied_at), 'MMM d, h:mm a')}
                  </p>
                </button>
              ))
            ) : (
              <div className="p-12 text-center text-neutral-mid">No applications found</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface rounded border border-neutral-light p-8">
          {selectedApplication ? (
            <div className="space-y-8">
              <div className="flex justify-between items-start border-b border-neutral-light pb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold">{selectedApplication.name}</h2>
                  <p className="text-neutral-mid">{selectedApplication.email}</p>
                  <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-neutral-light rounded text-xs font-medium">
                    Career: {selectedApplication.careers?.title}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                    selectedApplication.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    selectedApplication.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedApplication.status}
                  </span>
                  <p className="text-[10px] text-neutral-mid">
                    Applied {format(new Date(selectedApplication.applied_at), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-mid mb-4">Contact & Links</h3>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="text-neutral-mid">Phone:</span> {selectedApplication.phone || 'N/A'}
                      </div>
                      {selectedApplication.portfolio_url && (
                        <a href={selectedApplication.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-primary hover:text-orange transition-colors">
                          <Globe className="w-4 h-4" /> Portfolio Website
                        </a>
                      )}
                      {selectedApplication.resume_url && (
                        <a href={selectedApplication.resume_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-primary hover:text-orange transition-colors">
                          <FileText className="w-4 h-4" /> Resume / CV
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-mid mb-4">Cover Letter</h3>
                  <div className="bg-neutral-light/20 p-4 rounded text-sm text-neutral-dark whitespace-pre-wrap italic">
                    "{selectedApplication.cover_letter || 'No cover letter provided.'}"
                  </div>
                </div>
              </div>

              {selectedApplication.status === 'pending' && (
                <div className="flex gap-4 pt-8 border-t border-neutral-light">
                  <Button 
                    onClick={() => handleUpdateStatus(selectedApplication, 'approved')}
                    variant="primary" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <UserCheck className="w-4 h-4 mr-2" /> Approve Application
                  </Button>
                  <Button 
                    onClick={() => handleUpdateStatus(selectedApplication, 'rejected')}
                    variant="secondary" 
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <UserX className="w-4 h-4 mr-2" /> Reject Application
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-mid">
              <Eye className="w-12 h-12 mb-4 opacity-20" />
              <p>Select an application to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

