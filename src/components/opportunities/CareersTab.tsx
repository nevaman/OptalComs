import { useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Building2,
  ExternalLink,
  ArrowRight,
  Filter,
  Briefcase,
  Users,
  DollarSign,
  CheckCircle2,
  X,
} from 'lucide-react';
import { format } from 'date-fns';

export interface CareerListing {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  experience_level: 'entry' | 'mid' | 'senior' | 'lead';
  salary_range?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  is_internal: boolean;
  external_link?: string;
  deadline?: string;
  posted_at: string;
  is_featured: boolean;
  category: string;
}

const mockCareers: CareerListing[] = [
  {
    id: '1',
    title: 'Senior UI/UX Designer',
    company: 'Optal Creative',
    location: 'Remote',
    type: 'full-time',
    experience_level: 'senior',
    salary_range: '$90k - $120k',
    description: 'We are looking for a Senior UI/UX Designer to join our growing team. You will work on high-impact projects for global brands.',
    requirements: ['5+ years of UI/UX experience', 'Proficiency in Figma', 'Strong portfolio', 'Experience with design systems'],
    benefits: ['Remote work', 'Health insurance', 'Learning budget', 'Flexible hours'],
    is_internal: true,
    posted_at: '2026-01-02T10:00:00Z',
    is_featured: true,
    category: 'Design',
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Optal Creative',
    location: 'Remote / Hybrid',
    type: 'full-time',
    experience_level: 'mid',
    salary_range: '$80k - $110k',
    description: 'Join our development team to build beautiful, performant web applications using React and TypeScript.',
    requirements: ['3+ years React experience', 'TypeScript proficiency', 'CSS/Tailwind expertise', 'Git workflow'],
    benefits: ['Remote work', 'Stock options', 'Conference budget', '4-day work week'],
    is_internal: true,
    posted_at: '2026-01-01T14:00:00Z',
    is_featured: true,
    category: 'Engineering',
  },
  {
    id: '3',
    title: 'Communications Manager',
    company: 'TechCorp Inc',
    company_logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'New York, NY',
    type: 'full-time',
    experience_level: 'senior',
    salary_range: '$100k - $140k',
    description: 'Lead communications strategy for a fast-growing tech company. Work with executive team on PR and brand messaging.',
    requirements: ['7+ years in communications', 'Tech industry experience', 'Media relations expertise', 'Crisis management'],
    benefits: ['Competitive salary', 'Equity package', 'Premium healthcare', 'Unlimited PTO'],
    is_internal: false,
    external_link: 'https://example.com/jobs/1',
    posted_at: '2025-12-28T09:00:00Z',
    is_featured: false,
    category: 'Marketing',
  },
  {
    id: '4',
    title: 'Brand Strategist',
    company: 'Creative Agency X',
    company_logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Los Angeles, CA',
    type: 'full-time',
    experience_level: 'mid',
    description: 'Develop brand strategies for Fortune 500 clients. Lead client presentations and workshops.',
    requirements: ['4+ years brand strategy', 'Agency experience preferred', 'Presentation skills', 'Research methodologies'],
    benefits: ['Creative environment', 'Annual bonus', 'Training programs'],
    is_internal: false,
    external_link: 'https://example.com/jobs/2',
    posted_at: '2025-12-25T11:00:00Z',
    is_featured: false,
    category: 'Strategy',
  },
  {
    id: '5',
    title: 'Motion Graphics Designer',
    company: 'MediaHouse Studios',
    company_logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Remote',
    type: 'contract',
    experience_level: 'mid',
    salary_range: '$60/hr - $80/hr',
    description: 'Create stunning motion graphics for social media campaigns and video content.',
    requirements: ['After Effects mastery', '3+ years experience', 'Social media formats', 'Quick turnaround'],
    benefits: ['Flexible schedule', 'Creative freedom', 'Long-term contract potential'],
    is_internal: false,
    external_link: 'https://example.com/jobs/3',
    posted_at: '2025-12-20T16:00:00Z',
    is_featured: false,
    category: 'Design',
  },
  {
    id: '6',
    title: 'Project Manager',
    company: 'Optal Creative',
    location: 'Remote',
    type: 'full-time',
    experience_level: 'mid',
    salary_range: '$70k - $95k',
    description: 'Manage multiple client projects simultaneously, ensuring on-time delivery and client satisfaction.',
    requirements: ['3+ years PM experience', 'Agency background', 'Strong communication', 'Tool proficiency (Asana, Notion)'],
    benefits: ['Remote work', 'Health insurance', 'Learning budget', 'Flexible hours'],
    is_internal: true,
    posted_at: '2025-12-18T10:00:00Z',
    is_featured: false,
    category: 'Operations',
  },
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead / Director' },
];

const jobTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
];

export function CareersTab() {
  const [careers] = useState<CareerListing[]>(mockCareers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'internal' | 'external'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CareerListing | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const filteredCareers = careers.filter((career) => {
    const matchesSearch =
      searchQuery === '' ||
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSource =
      sourceFilter === 'all' ||
      (sourceFilter === 'internal' && career.is_internal) ||
      (sourceFilter === 'external' && !career.is_internal);

    const matchesType = typeFilter === 'all' || career.type === typeFilter;
    const matchesExperience = experienceFilter === 'all' || career.experience_level === experienceFilter;

    return matchesSearch && matchesSource && matchesType && matchesExperience;
  });

  const featuredJobs = filteredCareers.filter((c) => c.is_featured);
  const regularJobs = filteredCareers.filter((c) => !c.is_featured);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-mid" />
          <input
            type="text"
            placeholder="Search by title, company, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-3 border border-neutral-light rounded-lg hover:bg-neutral-light/30 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'internal', 'external'] as const).map((source) => (
          <button
            key={source}
            onClick={() => setSourceFilter(source)}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              sourceFilter === source
                ? 'bg-orange text-surface'
                : 'bg-neutral-light/50 text-neutral-mid hover:bg-neutral-light'
            }`}
          >
            {source === 'all' ? 'All Jobs' : source === 'internal' ? 'Our Team' : 'Partner Companies'}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="p-6 bg-neutral-light/20 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Job Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg bg-surface focus:border-orange focus:outline-none"
            >
              <option value="all">All Types</option>
              {jobTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Experience Level</label>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg bg-surface focus:border-orange focus:outline-none"
            >
              <option value="all">All Levels</option>
              {experienceLevels.map((level) => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {featuredJobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold flex items-center gap-2">
            <span className="text-orange">Featured</span> Positions
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} onSelect={setSelectedJob} featured />
            ))}
          </div>
        </div>
      )}

      {regularJobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold">All Opportunities</h3>
          <div className="space-y-4">
            {regularJobs.map((job) => (
              <JobCard key={job.id} job={job} onSelect={setSelectedJob} />
            ))}
          </div>
        </div>
      )}

      {filteredCareers.length === 0 && (
        <div className="text-center py-16 bg-neutral-light/20 rounded-lg">
          <Briefcase className="w-12 h-12 text-neutral-light mx-auto mb-4" />
          <p className="text-neutral-mid text-lg">No positions match your criteria.</p>
          <p className="text-neutral-mid text-sm mt-2">Try adjusting your filters or search query.</p>
        </div>
      )}

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={() => {
            setShowApplicationForm(true);
          }}
        />
      )}

      {showApplicationForm && selectedJob && (
        <ApplicationFormModal
          job={selectedJob}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
}

function JobCard({
  job,
  onSelect,
  featured = false,
}: {
  job: CareerListing;
  onSelect: (job: CareerListing) => void;
  featured?: boolean;
}) {
  return (
    <div
      onClick={() => onSelect(job)}
      className={`p-6 bg-surface border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${
        featured ? 'border-orange/30 hover:border-orange' : 'border-neutral-light hover:border-primary'
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {job.company_logo ? (
            <img src={job.company_logo} alt={job.company} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-orange" />
            </div>
          )}
          <div>
            <h4 className="font-display font-bold text-lg">{job.title}</h4>
            <p className="text-sm text-neutral-mid">{job.company}</p>
          </div>
        </div>
        {job.is_internal && (
          <span className="px-2 py-1 bg-orange/10 text-orange text-xs font-bold rounded">OUR TEAM</span>
        )}
      </div>

      <p className="text-neutral-mid text-sm mb-4 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-3 mb-4">
        <span className="inline-flex items-center gap-1 text-xs text-neutral-mid">
          <MapPin className="w-3 h-3" /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-neutral-mid">
          <Clock className="w-3 h-3" /> {job.type.replace('-', ' ')}
        </span>
        {job.salary_range && (
          <span className="inline-flex items-center gap-1 text-xs text-neutral-mid">
            <DollarSign className="w-3 h-3" /> {job.salary_range}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-mid">
          Posted {format(new Date(job.posted_at), 'MMM d, yyyy')}
        </span>
        <span className="text-sm font-medium text-orange inline-flex items-center gap-1">
          View Details <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}

function JobDetailModal({
  job,
  onClose,
  onApply,
}: {
  job: CareerListing;
  onClose: () => void;
  onApply: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold">{job.title}</h2>
          <button onClick={onClose} className="p-2 text-neutral-mid hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            {job.company_logo ? (
              <img src={job.company_logo} alt={job.company} className="w-16 h-16 rounded-lg object-cover" />
            ) : (
              <div className="w-16 h-16 bg-orange/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-orange" />
              </div>
            )}
            <div>
              <h3 className="font-display font-bold text-lg">{job.company}</h3>
              <div className="flex flex-wrap gap-3 mt-1">
                <span className="inline-flex items-center gap-1 text-sm text-neutral-mid">
                  <MapPin className="w-4 h-4" /> {job.location}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-neutral-mid">
                  <Clock className="w-4 h-4" /> {job.type.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          {job.salary_range && (
            <div className="p-4 bg-orange/5 rounded-lg">
              <p className="text-sm text-neutral-mid mb-1">Salary Range</p>
              <p className="text-xl font-display font-bold text-orange">{job.salary_range}</p>
            </div>
          )}

          <div>
            <h4 className="font-display font-bold mb-3">About the Role</h4>
            <p className="text-neutral-mid">{job.description}</p>
          </div>

          <div>
            <h4 className="font-display font-bold mb-3">Requirements</h4>
            <ul className="space-y-2">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-neutral-mid">
                  <CheckCircle2 className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {job.benefits.length > 0 && (
            <div>
              <h4 className="font-display font-bold mb-3">Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, i) => (
                  <span key={i} className="px-3 py-1 bg-neutral-light/50 text-sm rounded-full">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-neutral-light p-6 flex gap-4">
          {job.external_link ? (
            <a
              href={job.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-orange text-surface px-6 py-3 font-medium rounded-lg hover:bg-orange/90 transition-colors"
            >
              Apply on Company Site <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <button
              onClick={onApply}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-orange text-surface px-6 py-3 font-medium rounded-lg hover:bg-orange/90 transition-colors"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ApplicationFormModal({
  job,
  onClose,
}: {
  job: CareerListing;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    resume: null as File | null,
    coverLetter: '',
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
          <h2 className="text-2xl font-display font-bold mb-4">Application Submitted!</h2>
          <p className="text-neutral-mid mb-6">
            Thank you for applying to {job.title} at {job.company}. We'll review your application and get back to you soon.
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
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold">Apply for Position</h2>
            <p className="text-sm text-neutral-mid">{job.title} at {job.company}</p>
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
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Portfolio / Website</label>
            <input
              type="url"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cover Letter</label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none resize-none"
              placeholder="Tell us why you're interested in this role..."
            />
          </div>

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
