import { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ExternalLink,
  Briefcase,
  Trophy,
  Coins,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Search,
  Filter,
  Star,
  ChevronDown,
  X,
  Save,
  Clock,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { format } from 'date-fns';
import type { CareerListing } from '../../components/opportunities/CareersTab';
import type { Contest } from '../../components/opportunities/ContestsTab';
import type { Grant } from '../../components/opportunities/GrantsTab';

type TabType = 'careers' | 'contests' | 'grants';

const mockCareers: CareerListing[] = [
  {
    id: '1',
    title: 'Senior UI/UX Designer',
    company: 'Optal Creative',
    location: 'Remote',
    type: 'full-time',
    experience_level: 'senior',
    salary_range: '$90k - $120k',
    description: 'We are looking for a Senior UI/UX Designer to join our growing team.',
    requirements: ['5+ years experience', 'Figma proficiency'],
    benefits: ['Remote work', 'Health insurance'],
    is_internal: true,
    posted_at: '2026-01-02T10:00:00Z',
    is_featured: true,
    category: 'Design',
  },
  {
    id: '2',
    title: 'Communications Manager',
    company: 'TechCorp Inc',
    location: 'New York, NY',
    type: 'full-time',
    experience_level: 'senior',
    salary_range: '$100k - $140k',
    description: 'Lead communications strategy for a fast-growing tech company.',
    requirements: ['7+ years experience', 'Tech industry'],
    benefits: ['Equity package', 'Premium healthcare'],
    is_internal: false,
    external_link: 'https://example.com/jobs/1',
    posted_at: '2025-12-28T09:00:00Z',
    is_featured: false,
    category: 'Marketing',
  },
];

const mockContests: Contest[] = [
  {
    id: '1',
    title: 'Brand Identity Challenge 2026',
    slug: 'brand-identity-2026',
    category: 'design',
    description: 'Create a complete brand identity system for a fictional sustainable fashion startup.',
    brief: 'Design a comprehensive brand identity...',
    prizes: [{ place: '1st Place', reward: '$5,000' }],
    judges: [{ name: 'Sarah Chen', title: 'Creative Director' }],
    timeline: [{ stage: 'Submissions Open', date: '2026-01-15' }],
    requirements: ['Logo design', 'Color palette'],
    submission_guidelines: ['Submit as PDF'],
    eligibility: ['Open worldwide'],
    sponsors: [{ name: 'Figma' }],
    status: 'open',
    entry_count: 247,
    start_date: '2026-01-15T00:00:00Z',
    end_date: '2026-02-15T23:59:59Z',
    is_featured: true,
  },
];

const mockGrants: Grant[] = [
  {
    id: '1',
    title: 'Creative Innovation Fund',
    organization: 'National Arts Foundation',
    amount_min: 10000,
    amount_max: 50000,
    description: 'Supporting innovative creative projects.',
    focus_areas: ['Digital Art', 'Interactive Media'],
    eligibility: ['Individual artists'],
    requirements: ['Project proposal'],
    application_process: ['Submit online'],
    deadline: '2026-03-15T23:59:59Z',
    status: 'open',
    is_featured: true,
    category: 'creative',
    funding_type: 'grant',
    posted_at: '2026-01-01T10:00:00Z',
  },
];

export function OpportunitiesManager() {
  const [activeTab, setActiveTab] = useState<TabType>('careers');
  const [careers, setCareers] = useState<CareerListing[]>(mockCareers);
  const [contests, setContests] = useState<Contest[]>(mockContests);
  const [grants, setGrants] = useState<Grant[]>(mockGrants);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCareer, setEditingCareer] = useState<CareerListing | null>(null);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const tabs = [
    { id: 'careers' as TabType, label: 'Careers', icon: Briefcase, count: careers.length },
    { id: 'contests' as TabType, label: 'Contests', icon: Trophy, count: contests.length },
    { id: 'grants' as TabType, label: 'Grants', icon: Coins, count: grants.length },
  ];

  const deleteCareer = (id: string) => {
    if (confirm('Delete this job listing?')) {
      setCareers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const deleteContest = (id: string) => {
    if (confirm('Delete this contest?')) {
      setContests((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const deleteGrant = (id: string) => {
    if (confirm('Delete this grant?')) {
      setGrants((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const toggleCareerFeatured = (id: string) => {
    setCareers((prev) => prev.map((c) => (c.id === id ? { ...c, is_featured: !c.is_featured } : c)));
  };

  const toggleContestFeatured = (id: string) => {
    setContests((prev) => prev.map((c) => (c.id === id ? { ...c, is_featured: !c.is_featured } : c)));
  };

  const toggleGrantFeatured = (id: string) => {
    setGrants((prev) => prev.map((g) => (g.id === id ? { ...g, is_featured: !g.is_featured } : g)));
  };

  const handleAddNew = () => {
    setIsAdding(true);
    if (activeTab === 'careers') {
      setEditingCareer({
        id: '',
        title: '',
        company: 'Optal Creative',
        location: '',
        type: 'full-time',
        experience_level: 'mid',
        salary_range: '',
        description: '',
        requirements: [],
        benefits: [],
        is_internal: true,
        posted_at: new Date().toISOString(),
        is_featured: false,
        category: '',
      });
    } else if (activeTab === 'contests') {
      setEditingContest({
        id: '',
        title: '',
        slug: '',
        category: 'design',
        description: '',
        brief: '',
        prizes: [],
        judges: [],
        timeline: [],
        requirements: [],
        submission_guidelines: [],
        eligibility: [],
        sponsors: [],
        status: 'upcoming',
        entry_count: 0,
        start_date: '',
        end_date: '',
        is_featured: false,
      });
    } else {
      setEditingGrant({
        id: '',
        title: '',
        organization: '',
        amount_min: 0,
        amount_max: 0,
        description: '',
        focus_areas: [],
        eligibility: [],
        requirements: [],
        application_process: [],
        deadline: '',
        status: 'open',
        is_featured: false,
        category: 'general',
        funding_type: 'grant',
        posted_at: new Date().toISOString(),
      });
    }
  };

  const saveCareer = (career: CareerListing) => {
    if (isAdding) {
      setCareers((prev) => [...prev, { ...career, id: Date.now().toString() }]);
    } else {
      setCareers((prev) => prev.map((c) => (c.id === career.id ? career : c)));
    }
    setEditingCareer(null);
    setIsAdding(false);
  };

  const saveContest = (contest: Contest) => {
    if (isAdding) {
      setContests((prev) => [...prev, { ...contest, id: Date.now().toString() }]);
    } else {
      setContests((prev) => prev.map((c) => (c.id === contest.id ? contest : c)));
    }
    setEditingContest(null);
    setIsAdding(false);
  };

  const saveGrant = (grant: Grant) => {
    if (isAdding) {
      setGrants((prev) => [...prev, { ...grant, id: Date.now().toString() }]);
    } else {
      setGrants((prev) => prev.map((g) => (g.id === grant.id ? grant : g)));
    }
    setEditingGrant(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Opportunities Manager</h1>
          <p className="text-neutral-mid mt-1">Manage careers, contests, and grants</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add {activeTab === 'careers' ? 'Job' : activeTab === 'contests' ? 'Contest' : 'Grant'}
        </Button>
      </div>

      <div className="flex gap-2 border-b border-neutral-light">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-orange text-orange'
                  : 'border-transparent text-neutral-mid hover:text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-mid" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-light rounded focus:border-orange focus:outline-none"
        />
      </div>

      {activeTab === 'careers' && (
        <div className="bg-surface rounded border border-neutral-light overflow-hidden">
          {careers.length > 0 ? (
            <div className="divide-y divide-neutral-light">
              {careers
                .filter(
                  (c) =>
                    searchQuery === '' ||
                    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.company.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((career) => (
                  <div key={career.id} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{career.title}</h3>
                        {career.is_internal && (
                          <span className="px-2 py-0.5 bg-orange/10 text-orange text-xs font-bold rounded">
                            INTERNAL
                          </span>
                        )}
                        {career.is_featured && (
                          <Star className="w-4 h-4 text-orange fill-orange" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-mid">
                        {career.company} | {career.location} | {career.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCareerFeatured(career.id)}
                        className={`p-2 rounded transition-colors ${
                          career.is_featured
                            ? 'text-orange bg-orange/10'
                            : 'text-neutral-mid hover:bg-neutral-light/50'
                        }`}
                        title={career.is_featured ? 'Remove featured' : 'Mark as featured'}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsAdding(false);
                          setEditingCareer(career);
                        }}
                        className="p-2 text-neutral-mid hover:text-primary hover:bg-neutral-light/50 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCareer(career.id)}
                        className="p-2 text-neutral-mid hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-mid">
              No job listings yet. Add one to get started.
            </div>
          )}
        </div>
      )}

      {activeTab === 'contests' && (
        <div className="bg-surface rounded border border-neutral-light overflow-hidden">
          {contests.length > 0 ? (
            <div className="divide-y divide-neutral-light">
              {contests
                .filter(
                  (c) =>
                    searchQuery === '' ||
                    c.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((contest) => (
                  <div key={contest.id} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{contest.title}</h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded ${
                            contest.status === 'open'
                              ? 'bg-green-100 text-green-700'
                              : contest.status === 'upcoming'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-neutral-light text-neutral-mid'
                          }`}
                        >
                          {contest.status.toUpperCase()}
                        </span>
                        {contest.is_featured && (
                          <Star className="w-4 h-4 text-orange fill-orange" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-mid">
                        {contest.entry_count} entries | Ends{' '}
                        {format(new Date(contest.end_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleContestFeatured(contest.id)}
                        className={`p-2 rounded transition-colors ${
                          contest.is_featured
                            ? 'text-orange bg-orange/10'
                            : 'text-neutral-mid hover:bg-neutral-light/50'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsAdding(false);
                          setEditingContest(contest);
                        }}
                        className="p-2 text-neutral-mid hover:text-primary hover:bg-neutral-light/50 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteContest(contest.id)}
                        className="p-2 text-neutral-mid hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-mid">
              No contests yet. Add one to get started.
            </div>
          )}
        </div>
      )}

      {activeTab === 'grants' && (
        <div className="bg-surface rounded border border-neutral-light overflow-hidden">
          {grants.length > 0 ? (
            <div className="divide-y divide-neutral-light">
              {grants
                .filter(
                  (g) =>
                    searchQuery === '' ||
                    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    g.organization.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((grant) => (
                  <div key={grant.id} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
                      <Coins className="w-5 h-5 text-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{grant.title}</h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded ${
                            grant.status === 'open'
                              ? 'bg-green-100 text-green-700'
                              : grant.status === 'closing_soon'
                              ? 'bg-orange/10 text-orange'
                              : 'bg-neutral-light text-neutral-mid'
                          }`}
                        >
                          {grant.status.replace('_', ' ').toUpperCase()}
                        </span>
                        {grant.is_featured && (
                          <Star className="w-4 h-4 text-orange fill-orange" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-mid">
                        {grant.organization} | ${grant.amount_min.toLocaleString()} - $
                        {grant.amount_max.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleGrantFeatured(grant.id)}
                        className={`p-2 rounded transition-colors ${
                          grant.is_featured
                            ? 'text-orange bg-orange/10'
                            : 'text-neutral-mid hover:bg-neutral-light/50'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsAdding(false);
                          setEditingGrant(grant);
                        }}
                        className="p-2 text-neutral-mid hover:text-primary hover:bg-neutral-light/50 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteGrant(grant.id)}
                        className="p-2 text-neutral-mid hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-mid">
              No grants yet. Add one to get started.
            </div>
          )}
        </div>
      )}

      {editingCareer && (
        <CareerEditor
          career={editingCareer}
          onSave={saveCareer}
          onCancel={() => {
            setEditingCareer(null);
            setIsAdding(false);
          }}
          isNew={isAdding}
        />
      )}

      {editingContest && (
        <ContestEditor
          contest={editingContest}
          onSave={saveContest}
          onCancel={() => {
            setEditingContest(null);
            setIsAdding(false);
          }}
          isNew={isAdding}
        />
      )}

      {editingGrant && (
        <GrantEditor
          grant={editingGrant}
          onSave={saveGrant}
          onCancel={() => {
            setEditingGrant(null);
            setIsAdding(false);
          }}
          isNew={isAdding}
        />
      )}
    </div>
  );
}

function CareerEditor({
  career,
  onSave,
  onCancel,
  isNew,
}: {
  career: CareerListing;
  onSave: (career: CareerListing) => void;
  onCancel: () => void;
  isNew: boolean;
}) {
  const [form, setForm] = useState(career);
  const [reqInput, setReqInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold">
            {isNew ? 'Add Job Listing' : 'Edit Job Listing'}
          </h2>
          <button onClick={onCancel} className="p-2 text-neutral-mid hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company *</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as CareerListing['type'] })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience</label>
              <select
                value={form.experience_level}
                onChange={(e) =>
                  setForm({ ...form, experience_level: e.target.value as CareerListing['experience_level'] })
                }
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead / Director</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Salary Range</label>
              <input
                type="text"
                value={form.salary_range || ''}
                onChange={(e) => setForm({ ...form, salary_range: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                placeholder="e.g., $80k - $120k"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                placeholder="e.g., Design, Engineering"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_internal}
                onChange={(e) => setForm({ ...form, is_internal: e.target.checked })}
              />
              <span className="text-sm">Internal (Our Team)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              <span className="text-sm">Featured</span>
            </label>
          </div>

          {!form.is_internal && (
            <div>
              <label className="block text-sm font-medium mb-1">External Application Link</label>
              <input
                type="url"
                value={form.external_link || ''}
                onChange={(e) => setForm({ ...form, external_link: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                placeholder="https://..."
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-light">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => onSave(form)}>
              <Save className="w-4 h-4 mr-2" />
              Save Job
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContestEditor({
  contest,
  onSave,
  onCancel,
  isNew,
}: {
  contest: Contest;
  onSave: (contest: Contest) => void;
  onCancel: () => void;
  isNew: boolean;
}) {
  const [form, setForm] = useState(contest);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold">
            {isNew ? 'Add Contest' : 'Edit Contest'}
          </h2>
          <button onClick={onCancel} className="p-2 text-neutral-mid hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contest Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Contest['category'] })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              >
                <option value="design">Design</option>
                <option value="development">Development</option>
                <option value="content">Content</option>
                <option value="strategy">Strategy</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Contest['status'] })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              >
                <option value="upcoming">Upcoming</option>
                <option value="open">Open</option>
                <option value="judging">Judging</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="datetime-local"
                value={form.start_date ? form.start_date.slice(0, 16) : ''}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="datetime-local"
                value={form.end_date ? form.end_date.slice(0, 16) : ''}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Brief</label>
            <textarea
              value={form.brief}
              onChange={(e) => setForm({ ...form, brief: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none resize-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            />
            <span className="text-sm">Featured Contest</span>
          </label>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-light">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => onSave(form)}>
              <Save className="w-4 h-4 mr-2" />
              Save Contest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GrantEditor({
  grant,
  onSave,
  onCancel,
  isNew,
}: {
  grant: Grant;
  onSave: (grant: Grant) => void;
  onCancel: () => void;
  isNew: boolean;
}) {
  const [form, setForm] = useState(grant);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold">{isNew ? 'Add Grant' : 'Edit Grant'}</h2>
          <button onClick={onCancel} className="p-2 text-neutral-mid hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Grant Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Organization *</label>
              <input
                type="text"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Amount ($)</label>
              <input
                type="number"
                value={form.amount_min}
                onChange={(e) => setForm({ ...form, amount_min: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Amount ($)</label>
              <input
                type="number"
                value={form.amount_max}
                onChange={(e) => setForm({ ...form, amount_max: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="datetime-local"
                value={form.deadline ? form.deadline.slice(0, 16) : ''}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Grant['category'] })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              >
                <option value="creative">Creative & Arts</option>
                <option value="technology">Technology</option>
                <option value="social_impact">Social Impact</option>
                <option value="research">Research</option>
                <option value="general">General</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Funding Type</label>
              <select
                value={form.funding_type}
                onChange={(e) => setForm({ ...form, funding_type: e.target.value as Grant['funding_type'] })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              >
                <option value="grant">Grant</option>
                <option value="fellowship">Fellowship</option>
                <option value="residency">Residency</option>
                <option value="sponsorship">Sponsorship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              <span className="text-sm">Featured</span>
            </label>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Grant['status'] })}
                className="px-3 py-1 border border-neutral-light rounded focus:border-orange focus:outline-none text-sm"
              >
                <option value="open">Open</option>
                <option value="closing_soon">Closing Soon</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-light">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => onSave(form)}>
              <Save className="w-4 h-4 mr-2" />
              Save Grant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
