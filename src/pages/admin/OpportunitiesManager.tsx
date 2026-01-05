import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Edit2,
  Briefcase,
  Trophy,
  Coins,
  Search,
  Star,
  X,
  Save,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  ExternalLink,
  Clock,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { format } from 'date-fns';
import { opportunitiesStore } from '../../lib/opportunitiesStore';
import type { CareerListing } from '../../components/opportunities/CareersTab';
import type { Contest } from '../../components/opportunities/ContestsTab';
import type { Grant } from '../../components/opportunities/GrantsTab';

type TabType = 'careers' | 'contests' | 'grants';

export function OpportunitiesManager() {
  const [activeTab, setActiveTab] = useState<TabType>('careers');
  const [careers, setCareers] = useState<CareerListing[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCareer, setEditingCareer] = useState<CareerListing | null>(null);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadData();
    const unsubscribe = opportunitiesStore.subscribe(loadData);
    return unsubscribe;
  }, []);

  function loadData() {
    setCareers(opportunitiesStore.getCareers());
    setContests(opportunitiesStore.getContests());
    setGrants(opportunitiesStore.getGrants());
  }

  const tabs = [
    { id: 'careers' as TabType, label: 'Careers', icon: Briefcase, count: careers.length },
    { id: 'contests' as TabType, label: 'Contests', icon: Trophy, count: contests.length },
    { id: 'grants' as TabType, label: 'Grants', icon: Coins, count: grants.length },
  ];

  const deleteCareer = (id: string) => {
    if (confirm('Delete this job listing?')) {
      opportunitiesStore.deleteCareer(id);
    }
  };

  const deleteContest = (id: string) => {
    if (confirm('Delete this contest?')) {
      opportunitiesStore.deleteContest(id);
    }
  };

  const deleteGrant = (id: string) => {
    if (confirm('Delete this grant?')) {
      opportunitiesStore.deleteGrant(id);
    }
  };

  const toggleCareerFeatured = (id: string) => {
    const career = careers.find((c) => c.id === id);
    if (career) {
      opportunitiesStore.updateCareer(id, { is_featured: !career.is_featured });
    }
  };

  const toggleContestFeatured = (id: string) => {
    const contest = contests.find((c) => c.id === id);
    if (contest) {
      opportunitiesStore.updateContest(id, { is_featured: !contest.is_featured });
    }
  };

  const toggleGrantFeatured = (id: string) => {
    const grant = grants.find((g) => g.id === id);
    if (grant) {
      opportunitiesStore.updateGrant(id, { is_featured: !grant.is_featured });
    }
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
        telegram_channel: 'https://t.me/optalcontests',
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
      opportunitiesStore.addCareer(career);
    } else {
      opportunitiesStore.updateCareer(career.id, career);
    }
    setEditingCareer(null);
    setIsAdding(false);
  };

  const saveContest = (contest: Contest) => {
    if (isAdding) {
      opportunitiesStore.addContest(contest);
    } else {
      opportunitiesStore.updateContest(contest.id, contest);
    }
    setEditingContest(null);
    setIsAdding(false);
  };

  const saveGrant = (grant: Grant) => {
    if (isAdding) {
      opportunitiesStore.addGrant(grant);
    } else {
      opportunitiesStore.updateGrant(grant.id, grant);
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
        <div className="flex gap-2">
          {activeTab === 'contests' && (
            <Link to="/admin/contest-registrations">
              <Button variant="secondary">
                <Users className="w-4 h-4 mr-2" />
                View Registrations
              </Button>
            </Link>
          )}
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add {activeTab === 'careers' ? 'Job' : activeTab === 'contests' ? 'Contest' : 'Grant'}
          </Button>
        </div>
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
                        {career.is_featured && <Star className="w-4 h-4 text-orange fill-orange" />}
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
            <div className="p-12 text-center text-neutral-mid">No job listings yet. Add one to get started.</div>
          )}
        </div>
      )}

      {activeTab === 'contests' && (
        <div className="bg-surface rounded border border-neutral-light overflow-hidden">
          {contests.length > 0 ? (
            <div className="divide-y divide-neutral-light">
              {contests
                .filter(
                  (c) => searchQuery === '' || c.title.toLowerCase().includes(searchQuery.toLowerCase())
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
                              : contest.status === 'judging'
                              ? 'bg-orange/10 text-orange'
                              : 'bg-neutral-light text-neutral-mid'
                          }`}
                        >
                          {contest.status.toUpperCase()}
                        </span>
                        {contest.is_featured && <Star className="w-4 h-4 text-orange fill-orange" />}
                      </div>
                      <p className="text-sm text-neutral-mid">
                        {contest.entry_count} registrations |{' '}
                        {contest.end_date && `Ends ${format(new Date(contest.end_date), 'MMM d, yyyy')}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/contest-registrations?contest=${contest.id}`}
                        className="p-2 text-neutral-mid hover:text-primary hover:bg-neutral-light/50 rounded transition-colors"
                        title="View registrations"
                      >
                        <Users className="w-4 h-4" />
                      </Link>
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
            <div className="p-12 text-center text-neutral-mid">No contests yet. Add one to get started.</div>
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
                        {grant.is_featured && <Star className="w-4 h-4 text-orange fill-orange" />}
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
            <div className="p-12 text-center text-neutral-mid">No grants yet. Add one to get started.</div>
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

  const addItem = (
    field: 'requirements' | 'benefits',
    value: string,
    setValue: (v: string) => void
  ) => {
    if (!value.trim()) return;
    setForm((prev) => ({ ...prev, [field]: [...(prev[field] || []), value.trim()] }));
    setValue('');
  };

  const removeItem = (field: 'requirements' | 'benefits', index: number) => {
    setForm((prev) => ({ ...prev, [field]: (prev[field] || []).filter((_, i) => i !== index) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-display font-bold">{isNew ? 'Add Job Listing' : 'Edit Job Listing'}</h2>
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
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none bg-surface"
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
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none bg-surface"
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

          <div>
            <label className="block text-sm font-medium mb-1">Requirements</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('requirements', reqInput, setReqInput))}
                className="flex-1 px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                placeholder="Add a requirement..."
              />
              <Button type="button" variant="secondary" onClick={() => addItem('requirements', reqInput, setReqInput)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {form.requirements?.map((req, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-neutral-light/30 rounded text-sm">
                  <span>{req}</span>
                  <button onClick={() => removeItem('requirements', i)} className="text-neutral-mid hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Benefits</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('benefits', benefitInput, setBenefitInput))}
                className="flex-1 px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                placeholder="Add a benefit..."
              />
              <Button type="button" variant="secondary" onClick={() => addItem('benefits', benefitInput, setBenefitInput)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {form.benefits?.map((benefit, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-neutral-light/30 rounded text-sm">
                  <span>{benefit}</span>
                  <button onClick={() => removeItem('benefits', i)} className="text-neutral-mid hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
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
  const [activeSection, setActiveSection] = useState<string | null>('basic');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const addPrize = () => {
    setForm((prev) => ({
      ...prev,
      prizes: [...prev.prizes, { place: '', reward: '', description: '' }],
    }));
  };

  const updatePrize = (index: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      prizes: prev.prizes.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }));
  };

  const removePrize = (index: number) => {
    setForm((prev) => ({ ...prev, prizes: prev.prizes.filter((_, i) => i !== index) }));
  };

  const addJudge = () => {
    setForm((prev) => ({
      ...prev,
      judges: [...prev.judges, { name: '', title: '' }],
    }));
  };

  const updateJudge = (index: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      judges: prev.judges.map((j, i) => (i === index ? { ...j, [field]: value } : j)),
    }));
  };

  const removeJudge = (index: number) => {
    setForm((prev) => ({ ...prev, judges: prev.judges.filter((_, i) => i !== index) }));
  };

  const addTimeline = () => {
    setForm((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { stage: '', date: '' }],
    }));
  };

  const updateTimeline = (index: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      timeline: prev.timeline.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    }));
  };

  const removeTimeline = (index: number) => {
    setForm((prev) => ({ ...prev, timeline: prev.timeline.filter((_, i) => i !== index) }));
  };

  const addListItem = (field: 'requirements' | 'submission_guidelines' | 'eligibility', value: string) => {
    if (!value.trim()) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
  };

  const removeListItem = (field: 'requirements' | 'submission_guidelines' | 'eligibility', index: number) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const Section = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="border border-neutral-light rounded">
      <button
        type="button"
        onClick={() => setActiveSection(activeSection === id ? null : id)}
        className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-neutral-light/30 transition-colors"
      >
        {title}
        {activeSection === id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {activeSection === id && <div className="p-4 pt-0 space-y-4">{children}</div>}
    </div>
  );

  const ListInput = ({
    field,
    label,
    placeholder,
  }: {
    field: 'requirements' | 'submission_guidelines' | 'eligibility';
    label: string;
    placeholder: string;
  }) => {
    const [input, setInput] = useState('');
    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addListItem(field, input);
                setInput('');
              }
            }}
            className="flex-1 px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
            placeholder={placeholder}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              addListItem(field, input);
              setInput('');
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-1">
          {form[field].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-neutral-light/30 rounded text-sm">
              <span>{item}</span>
              <button onClick={() => removeListItem(field, i)} className="text-neutral-mid hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-display font-bold">{isNew ? 'Add Contest' : 'Edit Contest'}</h2>
          <button onClick={onCancel} className="p-2 text-neutral-mid hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Section id="basic" title="Basic Information">
            <div>
              <label className="block text-sm font-medium mb-1">Contest Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    title,
                    slug: isNew ? generateSlug(title) : prev.slug,
                  }));
                }}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Contest['category'] })}
                  className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none bg-surface"
                >
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="content">Content</option>
                  <option value="strategy">Strategy</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Contest['status'] })}
                  className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none bg-surface"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="open">Open</option>
                  <option value="judging">Judging</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  />
                  <span className="text-sm">Featured Contest</span>
                </label>
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
              <label className="block text-sm font-medium mb-1">Contest Brief</label>
              <textarea
                value={form.brief}
                onChange={(e) => setForm({ ...form, brief: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none resize-none"
                placeholder="Detailed instructions for participants..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Telegram Channel URL</label>
              <input
                type="url"
                value={form.telegram_channel || ''}
                onChange={(e) => setForm({ ...form, telegram_channel: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                placeholder="https://t.me/..."
              />
            </div>
          </Section>

          <Section id="dates" title="Dates & Timeline">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-medium mb-1">Results Date</label>
                <input
                  type="datetime-local"
                  value={form.results_date ? form.results_date.slice(0, 16) : ''}
                  onChange={(e) => setForm({ ...form, results_date: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Timeline Stages</label>
                <Button type="button" variant="secondary" onClick={addTimeline}>
                  <Plus className="w-4 h-4 mr-1" /> Add Stage
                </Button>
              </div>
              <div className="space-y-2">
                {form.timeline.map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={item.stage}
                      onChange={(e) => updateTimeline(i, 'stage', e.target.value)}
                      className="flex-1 px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                      placeholder="Stage name"
                    />
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => updateTimeline(i, 'date', e.target.value)}
                      className="px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                    />
                    <button onClick={() => removeTimeline(i)} className="p-2 text-neutral-mid hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section id="prizes" title="Prizes">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutral-mid">Define prizes for winners</p>
              <Button type="button" variant="secondary" onClick={addPrize}>
                <Plus className="w-4 h-4 mr-1" /> Add Prize
              </Button>
            </div>
            <div className="space-y-3">
              {form.prizes.map((prize, i) => (
                <div key={i} className="p-3 bg-neutral-light/30 rounded space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={prize.place}
                      onChange={(e) => updatePrize(i, 'place', e.target.value)}
                      className="flex-1 px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                      placeholder="e.g., 1st Place"
                    />
                    <input
                      type="text"
                      value={prize.reward}
                      onChange={(e) => updatePrize(i, 'reward', e.target.value)}
                      className="w-32 px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                      placeholder="e.g., $5,000"
                    />
                    <button onClick={() => removePrize(i)} className="p-2 text-neutral-mid hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={prize.description || ''}
                    onChange={(e) => updatePrize(i, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                    placeholder="Additional description (optional)"
                  />
                </div>
              ))}
            </div>
          </Section>

          <Section id="judges" title="Judges">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutral-mid">Add judges for this contest</p>
              <Button type="button" variant="secondary" onClick={addJudge}>
                <Plus className="w-4 h-4 mr-1" /> Add Judge
              </Button>
            </div>
            <div className="space-y-2">
              {form.judges.map((judge, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={judge.name}
                    onChange={(e) => updateJudge(i, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                    placeholder="Judge name"
                  />
                  <input
                    type="text"
                    value={judge.title}
                    onChange={(e) => updateJudge(i, 'title', e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                    placeholder="Title / Company"
                  />
                  <button onClick={() => removeJudge(i)} className="p-2 text-neutral-mid hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Section>

          <Section id="requirements" title="Requirements & Guidelines">
            <ListInput field="requirements" label="Requirements" placeholder="Add a requirement..." />
            <ListInput field="submission_guidelines" label="Submission Guidelines" placeholder="Add a guideline..." />
            <ListInput field="eligibility" label="Eligibility" placeholder="Add eligibility criteria..." />
          </Section>

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

  const addListItem = (
    field: 'focus_areas' | 'eligibility' | 'requirements' | 'application_process',
    value: string,
    setInput: (v: string) => void
  ) => {
    if (!value.trim()) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setInput('');
  };

  const removeListItem = (
    field: 'focus_areas' | 'eligibility' | 'requirements' | 'application_process',
    index: number
  ) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const ListInput = ({
    field,
    label,
    placeholder,
  }: {
    field: 'focus_areas' | 'eligibility' | 'requirements' | 'application_process';
    label: string;
    placeholder: string;
  }) => {
    const [input, setInput] = useState('');
    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addListItem(field, input, setInput);
              }
            }}
            className="flex-1 px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
            placeholder={placeholder}
          />
          <Button type="button" variant="secondary" onClick={() => addListItem(field, input, setInput)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-1">
          {form[field].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-neutral-light/30 rounded text-sm">
              <span>{item}</span>
              <button onClick={() => removeListItem(field, i)} className="text-neutral-mid hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between z-10">
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
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none bg-surface"
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
                className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none bg-surface"
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

          <ListInput field="focus_areas" label="Focus Areas" placeholder="Add focus area..." />
          <ListInput field="eligibility" label="Eligibility" placeholder="Add eligibility criteria..." />
          <ListInput field="requirements" label="Requirements" placeholder="Add requirement..." />
          <ListInput field="application_process" label="Application Process" placeholder="Add process step..." />

          <div>
            <label className="block text-sm font-medium mb-1">External Link</label>
            <input
              type="url"
              value={form.external_link || ''}
              onChange={(e) => setForm({ ...form, external_link: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              placeholder="https://..."
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
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status:</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Grant['status'] })}
                className="px-3 py-1 border border-neutral-light rounded focus:border-orange focus:outline-none text-sm bg-surface"
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
