import React, { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';
import { supabase, Opportunity } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';

type ApplicationModalProps = {
  opportunity: Opportunity;
  onClose: () => void;
};

export function ApplicationModal({ opportunity, onClose }: ApplicationModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    portfolioLink: '',
    githubLink: '',
    resumeUrl: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from('applications').insert([
      {
        opportunity_id: opportunity.id,
        user_id: user?.id || null,
        full_name: formData.fullName,
        email: formData.email,
        portfolio_link: formData.portfolioLink,
        github_link: formData.githubLink,
        resume_url: formData.resumeUrl,
        message: formData.message,
        status: 'pending',
      },
    ]);

    if (error) {
      alert('Error submitting application: ' + error.message);
    } else {
      setIsSuccess(true);
    }
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
        <div className="bg-surface w-full max-w-md p-8 rounded-lg shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Application Sent!</h2>
          <p className="text-neutral-mid mb-8">
            Thank you for applying for the {opportunity.title} {opportunity.type}. Our team will review your application and get back to you soon.
          </p>
          <Button onClick={onClose} variant="primary" className="w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface w-full max-w-2xl my-8 rounded-lg shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-mid hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="mb-8">
            <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 ${
              opportunity.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-orange/10 text-orange'
            }`}>
              {opportunity.type === 'job' ? 'Career Application' : 'Contest Entry'}
            </span>
            <h2 className="text-2xl font-display font-bold">{opportunity.title}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
              />
              <Input
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Portfolio Link"
                type="url"
                value={formData.portfolioLink}
                onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                placeholder="https://behance.net/..."
              />
              <Input
                label={opportunity.type === 'contest' ? 'Submission/Github Link' : 'LinkedIn/Github Link'}
                type="url"
                value={formData.githubLink}
                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>

            <Input
              label="Resume/CV URL"
              type="url"
              value={formData.resumeUrl}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
            />

            <Textarea
              label="Cover Letter / Message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us why you're a great fit..."
            />

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

