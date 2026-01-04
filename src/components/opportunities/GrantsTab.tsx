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
import { opportunitiesStore } from '../../lib/opportunitiesStore';

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

const mockGrants: Grant[] = [
  {
    id: '1',
    title: 'Creative Innovation Fund',
    organization: 'National Arts Foundation',
    organization_logo: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100',
    amount_min: 10000,
    amount_max: 50000,
    description: 'Supporting innovative creative projects that push boundaries in design, technology, and storytelling. We fund projects that explore new mediums and challenge conventional approaches.',
    focus_areas: ['Digital Art', 'Interactive Media', 'Design Innovation', 'Cross-disciplinary Work'],
    eligibility: [
      'Individual artists or creative teams',
      'Must be based in North America',
      'Projects must be completed within 12 months',
      'First-time applicants welcome',
    ],
    requirements: [
      'Project proposal (max 5 pages)',
      'Budget breakdown',
      'Portfolio of previous work',
      'Timeline and milestones',
      'Two professional references',
    ],
    application_process: [
      'Submit initial application online',
      'Selected applicants invited for interview',
      'Final decisions announced within 8 weeks',
    ],
    deadline: '2026-03-15T23:59:59Z',
    status: 'open',
    is_featured: true,
    category: 'creative',
    funding_type: 'grant',
    posted_at: '2026-01-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Tech for Good Fellowship',
    organization: 'Global Impact Initiative',
    amount_min: 25000,
    amount_max: 75000,
    description: 'A 6-month fellowship program for developers and designers creating technology solutions for social challenges. Includes mentorship, workspace, and networking opportunities.',
    focus_areas: ['Accessibility', 'Education', 'Healthcare', 'Environmental Solutions'],
    eligibility: [
      'Developers, designers, or product managers',
      'Must commit to full-time fellowship',
      'Open to international applicants',
      'Existing prototype preferred but not required',
    ],
    requirements: [
      'Application form with project concept',
      'Resume/CV',
      'Video pitch (3 minutes max)',
      'Technical documentation if applicable',
    ],
    application_process: [
      'Online application submission',
      'Technical interview',
      'Final presentation to selection committee',
    ],
    deadline: '2026-02-28T23:59:59Z',
    status: 'open',
    is_featured: true,
    category: 'technology',
    funding_type: 'fellowship',
    posted_at: '2025-12-15T14:00:00Z',
  },
  {
    id: '3',
    title: 'Small Business Design Support',
    organization: 'Creative Economy Fund',
    organization_logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100',
    amount_min: 2500,
    amount_max: 10000,
    description: 'Micro-grants for small businesses and startups seeking professional design and branding services. Funds can be used to hire designers or cover design tool subscriptions.',
    focus_areas: ['Brand Identity', 'Website Design', 'Marketing Materials', 'Product Design'],
    eligibility: [
      'Small businesses under 50 employees',
      'Operating for at least 6 months',
      'Revenue under $1M annually',
      'Minority-owned businesses prioritized',
    ],
    requirements: [
      'Business registration documents',
      'Brief description of design needs',
      'Quote from design professional',
    ],
    application_process: [
      'Rolling applications accepted',
      'Decisions within 2 weeks',
      'Funds distributed directly to design provider',
    ],
    deadline: '2026-06-30T23:59:59Z',
    status: 'open',
    is_featured: false,
    category: 'general',
    funding_type: 'grant',
    posted_at: '2025-11-01T09:00:00Z',
  },
  {
    id: '4',
    title: 'Communications Research Grant',
    organization: 'Institute for Media Studies',
    amount_min: 15000,
    amount_max: 30000,
    description: 'Funding for research projects exploring the intersection of communications, technology, and society. Academic and independent researchers welcome.',
    focus_areas: ['Digital Communications', 'Media Ethics', 'Audience Research', 'Crisis Communications'],
    eligibility: [
      'Researchers with relevant background',
      'Academic affiliation not required',
      'Projects must produce publishable findings',
    ],
    requirements: [
      'Research proposal',
      'Methodology outline',
      'Literature review',
      'Publication plan',
    ],
    application_process: [
      'Submit proposal online',
      'Peer review process',
      'Committee decision within 12 weeks',
    ],
    deadline: '2026-01-31T23:59:59Z',
    status: 'closing_soon',
    is_featured: false,
    category: 'research',
    funding_type: 'grant',
    posted_at: '2025-10-15T11:00:00Z',
  },
  {
    id: '5',
    title: 'Artist Residency Program',
    organization: 'Creative Collective',
    amount_min: 5000,
    amount_max: 5000,
    description: '3-month residency program providing studio space, accommodation, and a stipend for artists working in digital media and interactive design.',
    focus_areas: ['Digital Art', 'New Media', 'Interactive Installation', 'VR/AR'],
    eligibility: [
      'Artists with established practice',
      'Must be available for full residency period',
      'Open to international artists',
    ],
    requirements: [
      'Portfolio',
      'Project proposal for residency',
      'Artist statement',
      'References',
    ],
    application_process: [
      'Application via online form',
      'Portfolio review',
      'Interview for shortlisted candidates',
    ],
    deadline: '2025-12-01T23:59:59Z',
    status: 'closed',
    is_featured: false,
    category: 'creative',
    funding_type: 'residency',
    posted_at: '2025-09-01T10:00:00Z',
  },
];

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

  useEffect(() => {
    const loadData = () => setGrants(opportunitiesStore.getGrants());
    loadData();
    const unsubscribe = opportunitiesStore.subscribe(loadData);
    return unsubscribe;
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
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
