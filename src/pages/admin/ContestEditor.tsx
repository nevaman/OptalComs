import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, X, Trophy, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

interface Prize {
  place: string;
  reward: string;
  description: string;
}

interface Judge {
  name: string;
  title: string;
}

interface TimelineItem {
  stage: string;
  date: string;
}

interface ContestData {
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  deadline: string;
  status: 'draft' | 'open' | 'closed';
  external_link: string;
  is_featured: boolean;
  category: string;
  start_date: string;
  end_date: string;
  results_date: string;
  telegram_channel: string;
  prizes: Prize[];
  judges: Judge[];
  timeline: TimelineItem[];
  submission_guidelines: string[];
  eligibility: string[];
}

const contestCategories = [
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'content', label: 'Content' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'mixed', label: 'Mixed / Multi-discipline' },
];

export function ContestEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'prizes' | 'timeline' | 'rules'>('basic');

  const [contest, setContest] = useState<ContestData>({
    title: '',
    slug: '',
    description: '',
    requirements: [],
    deadline: '',
    status: 'draft',
    external_link: '',
    is_featured: false,
    category: 'design',
    start_date: '',
    end_date: '',
    results_date: '',
    telegram_channel: '',
    prizes: [{ place: '1st Place', reward: '', description: '' }],
    judges: [],
    timeline: [],
    submission_guidelines: [],
    eligibility: [],
  });

  useEffect(() => {
    if (!isNew && id) {
      fetchContest();
    }
  }, [id, isNew]);

  async function fetchContest() {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      navigate('/admin/opportunities');
      return;
    }

    const metadata = (data.metadata || {}) as Record<string, unknown>;
    setContest({
      title: data.title,
      slug: data.slug,
      description: data.description,
      requirements: data.requirements || [],
      deadline: data.deadline ? data.deadline.split('T')[0] : '',
      status: data.status,
      external_link: data.external_link || '',
      is_featured: data.is_featured,
      category: (metadata.category as string) || 'design',
      start_date: metadata.start_date ? (metadata.start_date as string).split('T')[0] : '',
      end_date: metadata.end_date ? (metadata.end_date as string).split('T')[0] : '',
      results_date: metadata.results_date ? (metadata.results_date as string).split('T')[0] : '',
      telegram_channel: (metadata.telegram_channel as string) || '',
      prizes: (metadata.prizes as Prize[]) || [{ place: '1st Place', reward: '', description: '' }],
      judges: (metadata.judges as Judge[]) || [],
      timeline: (metadata.timeline as TimelineItem[]) || [],
      submission_guidelines: (metadata.submission_guidelines as string[]) || [],
      eligibility: (metadata.eligibility as string[]) || [],
    });
    setIsLoading(false);
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function handleSave() {
    if (!contest.title.trim()) {
      alert('Please enter a contest title');
      return;
    }

    setIsSaving(true);

    const opportunityData = {
      type: 'contest',
      title: contest.title,
      slug: contest.slug || generateSlug(contest.title),
      description: contest.description,
      requirements: contest.requirements,
      deadline: contest.end_date ? new Date(contest.end_date).toISOString() : null,
      status: contest.status,
      external_link: contest.external_link || null,
      is_featured: contest.is_featured,
      metadata: {
        category: contest.category,
        start_date: contest.start_date ? new Date(contest.start_date).toISOString() : null,
        end_date: contest.end_date ? new Date(contest.end_date).toISOString() : null,
        results_date: contest.results_date ? new Date(contest.results_date).toISOString() : null,
        telegram_channel: contest.telegram_channel,
        prizes: contest.prizes.filter((p) => p.reward),
        judges: contest.judges.filter((j) => j.name),
        timeline: contest.timeline.filter((t) => t.stage && t.date),
        submission_guidelines: contest.submission_guidelines,
        eligibility: contest.eligibility,
        entry_count: 0,
      },
    };

    if (isNew) {
      const { error } = await supabase.from('opportunities').insert([opportunityData]);
      if (error) {
        alert('Error creating contest: ' + error.message);
        setIsSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from('opportunities')
        .update(opportunityData)
        .eq('id', id);
      if (error) {
        alert('Error updating contest: ' + error.message);
        setIsSaving(false);
        return;
      }
    }

    setIsSaving(false);
    navigate('/admin/opportunities');
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this contest?')) return;

    const { error } = await supabase.from('opportunities').delete().eq('id', id);
    if (!error) {
      navigate('/admin/opportunities');
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'prizes', label: 'Prizes & Judges' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'rules', label: 'Rules & Eligibility' },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/opportunities')}
            className="p-2 text-neutral-mid hover:text-primary hover:bg-neutral-light/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">
                {isNew ? 'New Contest' : 'Edit Contest'}
              </h1>
              <p className="text-sm text-neutral-mid">Creative challenge</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <button
              onClick={handleDelete}
              className="p-2 text-neutral-mid hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <Button onClick={handleSave} isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isNew ? 'Create Contest' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-neutral-light">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-orange text-orange'
                : 'border-transparent text-neutral-mid hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'basic' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-lg border border-neutral-light p-6">
            <h2 className="font-display font-semibold mb-6">Contest Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Contest Title *</label>
                <input
                  type="text"
                  value={contest.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setContest((prev) => ({
                      ...prev,
                      title,
                      slug: isNew ? generateSlug(title) : prev.slug,
                    }));
                  }}
                  placeholder="e.g. Brand Identity Challenge 2026"
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL Slug</label>
                <input
                  type="text"
                  value={contest.slug}
                  onChange={(e) => setContest((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="brand-identity-challenge-2026"
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={contest.category}
                  onChange={(e) => setContest((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none bg-surface"
                >
                  {contestCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={contest.description}
                  onChange={(e) => setContest((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe the contest, what participants will create, and what you're looking for..."
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telegram Channel (Optional)</label>
                <input
                  type="url"
                  value={contest.telegram_channel}
                  onChange={(e) => setContest((prev) => ({ ...prev, telegram_channel: e.target.value }))}
                  placeholder="https://t.me/yourcontest"
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">External Link (Optional)</label>
                <input
                  type="url"
                  value={contest.external_link}
                  onChange={(e) => setContest((prev) => ({ ...prev, external_link: e.target.value }))}
                  placeholder="https://example.com/contest"
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg border border-neutral-light p-6">
            <h2 className="font-display font-semibold mb-6">Publishing Options</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="flex gap-3">
                  {(['draft', 'open', 'closed'] as const).map((status) => (
                    <label
                      key={status}
                      className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all text-center ${
                        contest.status === status
                          ? 'border-orange bg-orange/5'
                          : 'border-neutral-light hover:border-neutral-mid'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={contest.status === status}
                        onChange={() => setContest((prev) => ({ ...prev, status }))}
                        className="sr-only"
                      />
                      <span className="font-medium capitalize">{status}</span>
                      <p className="text-xs text-neutral-mid mt-1">
                        {status === 'draft' && 'Hidden from public'}
                        {status === 'open' && 'Accepting submissions'}
                        {status === 'closed' && 'No longer accepting'}
                      </p>
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 border border-neutral-light rounded-lg cursor-pointer hover:bg-neutral-light/20 transition-colors">
                <input
                  type="checkbox"
                  checked={contest.is_featured}
                  onChange={(e) => setContest((prev) => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-5 h-5 text-orange rounded"
                />
                <div>
                  <span className="font-medium">Featured Contest</span>
                  <p className="text-sm text-neutral-mid">Highlight this contest on the opportunities page</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'prizes' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-lg border border-neutral-light p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-semibold">Prizes</h2>
                <p className="text-sm text-neutral-mid">Define what winners will receive</p>
              </div>
              <Button
                variant="secondary"
                onClick={() =>
                  setContest((prev) => ({
                    ...prev,
                    prizes: [...prev.prizes, { place: '', reward: '', description: '' }],
                  }))
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Prize
              </Button>
            </div>

            <div className="space-y-4">
              {contest.prizes.map((prize, index) => (
                <div key={index} className="p-4 bg-neutral-light/20 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-mid mb-1">Position</label>
                        <input
                          type="text"
                          value={prize.place}
                          onChange={(e) => {
                            const newPrizes = [...contest.prizes];
                            newPrizes[index].place = e.target.value;
                            setContest((prev) => ({ ...prev, prizes: newPrizes }));
                          }}
                          placeholder="e.g. 1st Place"
                          className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-mid mb-1">Reward</label>
                        <input
                          type="text"
                          value={prize.reward}
                          onChange={(e) => {
                            const newPrizes = [...contest.prizes];
                            newPrizes[index].reward = e.target.value;
                            setContest((prev) => ({ ...prev, prizes: newPrizes }));
                          }}
                          placeholder="e.g. $5,000"
                          className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-mid mb-1">Additional (Optional)</label>
                        <input
                          type="text"
                          value={prize.description}
                          onChange={(e) => {
                            const newPrizes = [...contest.prizes];
                            newPrizes[index].description = e.target.value;
                            setContest((prev) => ({ ...prev, prizes: newPrizes }));
                          }}
                          placeholder="e.g. Plus mentorship"
                          className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                        />
                      </div>
                    </div>
                    {contest.prizes.length > 1 && (
                      <button
                        onClick={() =>
                          setContest((prev) => ({
                            ...prev,
                            prizes: prev.prizes.filter((_, i) => i !== index),
                          }))
                        }
                        className="p-2 text-neutral-mid hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-lg border border-neutral-light p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-semibold">Judges</h2>
                <p className="text-sm text-neutral-mid">Who will evaluate submissions</p>
              </div>
              <Button
                variant="secondary"
                onClick={() =>
                  setContest((prev) => ({
                    ...prev,
                    judges: [...prev.judges, { name: '', title: '' }],
                  }))
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Judge
              </Button>
            </div>

            {contest.judges.length > 0 ? (
              <div className="space-y-3">
                {contest.judges.map((judge, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={judge.name}
                      onChange={(e) => {
                        const newJudges = [...contest.judges];
                        newJudges[index].name = e.target.value;
                        setContest((prev) => ({ ...prev, judges: newJudges }));
                      }}
                      placeholder="Name"
                      className="flex-1 px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                    />
                    <input
                      type="text"
                      value={judge.title}
                      onChange={(e) => {
                        const newJudges = [...contest.judges];
                        newJudges[index].title = e.target.value;
                        setContest((prev) => ({ ...prev, judges: newJudges }));
                      }}
                      placeholder="Title / Company"
                      className="flex-1 px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                    />
                    <button
                      onClick={() =>
                        setContest((prev) => ({
                          ...prev,
                          judges: prev.judges.filter((_, i) => i !== index),
                        }))
                      }
                      className="p-2 text-neutral-mid hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-mid text-center py-4">No judges added yet</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-lg border border-neutral-light p-6">
            <h2 className="font-display font-semibold mb-6">Key Dates</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={contest.start_date}
                  onChange={(e) => setContest((prev) => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
                <p className="text-xs text-neutral-mid mt-1">When submissions open</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={contest.end_date}
                  onChange={(e) => setContest((prev) => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
                <p className="text-xs text-neutral-mid mt-1">Submission deadline</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Results Date</label>
                <input
                  type="date"
                  value={contest.results_date}
                  onChange={(e) => setContest((prev) => ({ ...prev, results_date: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
                <p className="text-xs text-neutral-mid mt-1">Winner announcement</p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg border border-neutral-light p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-semibold">Timeline Milestones</h2>
                <p className="text-sm text-neutral-mid">Additional stages shown to participants</p>
              </div>
              <Button
                variant="secondary"
                onClick={() =>
                  setContest((prev) => ({
                    ...prev,
                    timeline: [...prev.timeline, { stage: '', date: '' }],
                  }))
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </div>

            {contest.timeline.length > 0 ? (
              <div className="space-y-3">
                {contest.timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={item.stage}
                      onChange={(e) => {
                        const newTimeline = [...contest.timeline];
                        newTimeline[index].stage = e.target.value;
                        setContest((prev) => ({ ...prev, timeline: newTimeline }));
                      }}
                      placeholder="e.g. Judging Period"
                      className="flex-1 px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                    />
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => {
                        const newTimeline = [...contest.timeline];
                        newTimeline[index].date = e.target.value;
                        setContest((prev) => ({ ...prev, timeline: newTimeline }));
                      }}
                      className="px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                    />
                    <button
                      onClick={() =>
                        setContest((prev) => ({
                          ...prev,
                          timeline: prev.timeline.filter((_, i) => i !== index),
                        }))
                      }
                      className="p-2 text-neutral-mid hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-mid text-center py-4">No milestones added yet</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-6">
          <ListEditor
            title="Requirements"
            description="What participants must submit"
            items={contest.requirements}
            placeholder="e.g. Logo design with variations"
            onChange={(items) => setContest((prev) => ({ ...prev, requirements: items }))}
          />

          <ListEditor
            title="Submission Guidelines"
            description="Format and delivery instructions"
            items={contest.submission_guidelines}
            placeholder="e.g. Submit as PDF (max 20 pages)"
            onChange={(items) => setContest((prev) => ({ ...prev, submission_guidelines: items }))}
          />

          <ListEditor
            title="Eligibility"
            description="Who can participate"
            items={contest.eligibility}
            placeholder="e.g. Open to designers worldwide"
            onChange={(items) => setContest((prev) => ({ ...prev, eligibility: items }))}
          />
        </div>
      )}
    </div>
  );
}

function ListEditor({
  title,
  description,
  items,
  placeholder,
  onChange,
}: {
  title: string;
  description: string;
  items: string[];
  placeholder: string;
  onChange: (items: string[]) => void;
}) {
  const [input, setInput] = useState('');

  function addItem() {
    if (!input.trim()) return;
    onChange([...items, input.trim()]);
    setInput('');
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="bg-surface rounded-lg border border-neutral-light p-6">
      <div className="mb-4">
        <h2 className="font-display font-semibold">{title}</h2>
        <p className="text-sm text-neutral-mid">{description}</p>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
        />
        <Button variant="secondary" onClick={addItem}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between p-3 bg-neutral-light/30 rounded-lg group">
              <span className="text-sm">{item}</span>
              <button
                onClick={() => removeItem(i)}
                className="p-1 text-neutral-mid hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-neutral-mid text-center py-4">No items added yet</p>
      )}
    </div>
  );
}
