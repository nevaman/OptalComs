import { useState, useEffect } from 'react';
import {
  Coins,
  Calendar,
  Clock,
  Building2,
  Globe,
  ArrowRight,
  ExternalLink,
  X,
  CheckCircle2,
  DollarSign,
  Users,
  FileText,
  Target,
  Lightbulb,
} from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { supabase } from '../../lib/supabase';

export interface Grant {
  id: string;
  title: string;
  organization: string;
  organization_logo?: string;
  amount_min: number;
  amount_max: number;
  description: string;
  focus_areas: string[];
  eligibility: string[];
  requirements: string[];
  application_process: string[];
  deadline: string;
  status: 'open' | 'closing_soon' | 'closed';
  external_link?: string;
  is_featured: boolean;
  category: 'creative' | 'technology' | 'social_impact' | 'research' | 'general';
  funding_type: 'grant' | 'fellowship' | 'residency' | 'sponsorship';
  posted_at: string;
}

const categoryLabels = {
  creative: 'Creative & Arts',
  technology: 'Technology',
  social_impact: 'Social Impact',
  research: 'Research',
  general: 'General',
};

const fundingTypeLabels = {
  grant: 'Grant',
  fellowship: 'Fellowship',
  residency: 'Residency',
  sponsorship: 'Sponsorship',
};

const statusBadges = {
  open: { label: 'Open', color: 'bg-green-100 text-green-700' },
  closing_soon: { label: 'Closing Soon', color: 'bg-orange/10 text-orange' },
  closed: { label: 'Closed', color: 'bg-neutral-light text-neutral-mid' },
};

export function GrantsTab() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGrants() {
      try {
        const { data } = await supabase
          .from('grants')
          .select('*')
          .order('deadline', { ascending: true });
        
        if (data) setGrants(data);
      } catch (error) {
        console.error('Error fetching grants:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGrants();
  }, []);

  const filteredGrants = grants.filter((grant) => {
    const matchesCategory = categoryFilter === 'all' || grant.category === categoryFilter;
    const matchesType = typeFilter === 'all' || grant.funding_type === typeFilter;
    return matchesCategory && matchesType;
  });

  const openGrants = filteredGrants.filter((g) => g.status !== 'closed');
  const closedGrants = filteredGrants.filter((g) => g.status === 'closed');

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-orange/10 to-primary/5 rounded-lg p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-orange" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl mb-2">Fund Your Creative Vision</h3>
            <p className="text-neutral-mid">
              We curate funding opportunities from foundations, organizations, and programs that support creative professionals.
              Whether you're looking for project grants, fellowships, or residencies, find the right opportunity to bring your ideas to life.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-mid mb-2 uppercase tracking-wider">Category</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-orange text-surface'
                  : 'bg-neutral-light/50 text-neutral-mid hover:bg-neutral-light'
              }`}
            >
              All
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setCategoryFilter(key)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  categoryFilter === key
                    ? 'bg-orange text-surface'
                    : 'bg-neutral-light/50 text-neutral-mid hover:bg-neutral-light'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-mid mb-2 uppercase tracking-wider">Type</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                typeFilter === 'all'
                  ? 'bg-primary text-surface'
                  : 'bg-neutral-light/50 text-neutral-mid hover:bg-neutral-light'
              }`}
            >
              All Types
            </button>
            {Object.entries(fundingTypeLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  typeFilter === key
                    ? 'bg-primary text-surface'
                    : 'bg-neutral-light/50 text-neutral-mid hover:bg-neutral-light'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {openGrants.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-display font-bold">Open Opportunities</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {openGrants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} onSelect={() => setSelectedGrant(grant)} />
            ))}
          </div>
        </div>
      )}

      {closedGrants.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-display font-bold text-neutral-mid">Past Opportunities</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-60">
            {closedGrants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} onSelect={() => setSelectedGrant(grant)} />
            ))}
          </div>
        </div>
      )}

      {filteredGrants.length === 0 && (
        <div className="text-center py-16 bg-neutral-light/20 rounded-lg">
          <Coins className="w-12 h-12 text-neutral-light mx-auto mb-4" />
          <p className="text-neutral-mid text-lg">No grants match your criteria.</p>
          <p className="text-neutral-mid text-sm mt-2">Try adjusting your filters.</p>
        </div>
      )}

      {selectedGrant && (
        <GrantDetailModal
          grant={selectedGrant}
          onClose={() => setSelectedGrant(null)}
          onApply={() => setShowApplicationForm(true)}
        />
      )}

      {showApplicationForm && selectedGrant && (
        <GrantApplicationModal
          grant={selectedGrant}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedGrant(null);
          }}
        />
      )}
    </div>
  );
}

function GrantCard({
  grant,
  onSelect,
}: {
  grant: Grant;
  onSelect: () => void;
}) {
  const isClosingSoon = grant.status === 'closing_soon';
  const isClosed = grant.status === 'closed';
  const daysLeft = !isClosed ? formatDistanceToNow(new Date(grant.deadline), { addSuffix: true }) : null;

  const formatAmount = (min: number, max: number) => {
    if (min === max) return `$${min.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  return (
    <div
      onClick={onSelect}
      className={`p-6 bg-surface border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${
        grant.is_featured && !isClosed
          ? 'border-orange/30 hover:border-orange'
          : 'border-neutral-light hover:border-primary'
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {grant.organization_logo ? (
            <img
              src={grant.organization_logo}
              alt={grant.organization}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-orange" />
            </div>
          )}
          <div>
            <h4 className="font-display font-bold">{grant.title}</h4>
            <p className="text-sm text-neutral-mid">{grant.organization}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded ${statusBadges[grant.status].color}`}>
          {statusBadges[grant.status].label}
        </span>
      </div>

      <p className="text-neutral-mid text-sm mb-4 line-clamp-2">{grant.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {grant.focus_areas.slice(0, 3).map((area, i) => (
          <span key={i} className="px-2 py-1 bg-neutral-light/50 text-xs rounded">
            {area}
          </span>
        ))}
        {grant.focus_areas.length > 3 && (
          <span className="text-xs text-neutral-mid self-center">+{grant.focus_areas.length - 3} more</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-light">
        <div>
          <p className="text-xs text-neutral-mid">Funding Amount</p>
          <p className="font-display font-bold text-orange">{formatAmount(grant.amount_min, grant.amount_max)}</p>
        </div>
        <div className="text-right">
          {!isClosed && daysLeft && (
            <p className={`text-xs ${isClosingSoon ? 'text-orange font-medium' : 'text-neutral-mid'}`}>
              Deadline {daysLeft}
            </p>
          )}
          <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
            Learn More <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

function GrantDetailModal({
  grant,
  onClose,
  onApply,
}: {
  grant: Grant;
  onClose: () => void;
  onApply: () => void;
}) {
  const formatAmount = (min: number, max: number) => {
    if (min === max) return `$${min.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const isClosed = grant.status === 'closed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-display font-bold">{grant.title}</h2>
          <button onClick={onClose} className="p-2 text-neutral-mid hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            {grant.organization_logo ? (
              <img
                src={grant.organization_logo}
                alt={grant.organization}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-orange/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-orange" />
              </div>
            )}
            <div>
              <h3 className="font-display font-bold text-lg">{grant.organization}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-sm text-neutral-mid capitalize">{fundingTypeLabels[grant.funding_type]}</span>
                <span className="text-sm text-neutral-mid">|</span>
                <span className="text-sm text-neutral-mid">{categoryLabels[grant.category]}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-orange/5 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange mb-2" />
              <p className="text-xs text-neutral-mid">Funding Amount</p>
              <p className="text-xl font-display font-bold text-orange">
                {formatAmount(grant.amount_min, grant.amount_max)}
              </p>
            </div>
            <div className="p-4 bg-neutral-light/30 rounded-lg">
              <Calendar className="w-6 h-6 text-primary mb-2" />
              <p className="text-xs text-neutral-mid">Deadline</p>
              <p className="font-display font-bold">
                {format(new Date(grant.deadline), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold mb-3">About This Opportunity</h4>
            <p className="text-neutral-mid">{grant.description}</p>
          </div>

          <div>
            <h4 className="font-display font-bold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange" /> Focus Areas
            </h4>
            <div className="flex flex-wrap gap-2">
              {grant.focus_areas.map((area, i) => (
                <span key={i} className="px-3 py-1 bg-orange/10 text-orange text-sm rounded-full">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Eligibility
            </h4>
            <ul className="space-y-2">
              {grant.eligibility.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-neutral-mid">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Requirements
            </h4>
            <ul className="space-y-2">
              {grant.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-neutral-mid">
                  <span className="w-4 h-4 bg-neutral-light rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-3">Application Process</h4>
            <div className="space-y-3">
              {grant.application_process.map((step, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-neutral-light/20 rounded-lg">
                  <div className="w-8 h-8 bg-orange/10 rounded-full flex items-center justify-center text-orange font-bold text-sm">
                    {i + 1}
                  </div>
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-neutral-light p-6">
          {grant.external_link ? (
            <a
              href={grant.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-orange text-surface px-6 py-4 font-medium rounded-lg hover:bg-orange/90 transition-colors"
            >
              Apply on Official Site <ExternalLink className="w-4 h-4" />
            </a>
          ) : !isClosed ? (
            <button
              onClick={onApply}
              className="w-full inline-flex items-center justify-center gap-2 bg-orange text-surface px-6 py-4 font-medium rounded-lg hover:bg-orange/90 transition-colors"
            >
              Start Application <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-center">
              <p className="text-neutral-mid">This opportunity has closed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GrantApplicationModal({
  grant,
  onClose,
}: {
  grant: Grant;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    website: '',
    projectTitle: '',
    projectSummary: '',
    requestedAmount: '',
    agreeToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('grant_applications').insert({
        grant_id: grant.id,
        applicant_name: formData.name,
        organization_name: formData.organization,
        email: formData.email,
        phone: '', // Not in form data but in DB schema, defaulting to empty or need to add field
        project_title: formData.projectTitle,
        project_description: formData.projectSummary,
        requested_amount: parseInt(formData.requestedAmount.replace(/[^0-9]/g, '')),
        status: 'pending'
      });

      if (error) throw error;
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting grant application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
        <div className="bg-surface rounded-lg w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">Application Received!</h2>
          <p className="text-neutral-mid mb-6">
            Thank you for applying to {grant.title}. We'll review your application and be in touch soon.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-primary text-surface px-6 py-3 font-medium rounded-lg hover:bg-neutral-dark transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-display font-bold">Apply for Grant</h2>
            <p className="text-sm text-neutral-mid">{grant.title}</p>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-mid hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Organization</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Project Summary *</label>
            <textarea
              required
              value={formData.projectSummary}
              onChange={(e) => setFormData({ ...formData, projectSummary: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none resize-none"
              placeholder="Briefly describe your project and how the funding will be used..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Requested Amount *</label>
            <input
              type="text"
              required
              value={formData.requestedAmount}
              onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              placeholder={`$${grant.amount_min.toLocaleString()} - $${grant.amount_max.toLocaleString()}`}
            />
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              className="mt-1"
            />
            <span className="text-sm text-neutral-mid">
              I confirm the information provided is accurate and I agree to the grant terms and conditions.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange text-surface px-6 py-3 font-medium rounded-lg hover:bg-orange/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
