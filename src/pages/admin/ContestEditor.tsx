import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, X, Trophy } from 'lucide-react';
import { supabase, Contest } from '../../lib/supabase';
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

interface Sponsor {
  name: string;
  logo?: string;
}

export function ContestEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'prizes' | 'timeline' | 'rules'>('basic');

  const [contest, setContest] = useState<Partial<Contest>>({
    title: '',
    slug: '',
    category: 'design',
    description: '',
    brief: '',
    requirements: [],
    submission_guidelines: [],
    eligibility: [],
    status: 'upcoming',
    is_featured: false,
    entry_count: 0,
  });

  const [prizes, setPrizes] = useState<Prize[]>([{ place: '1st Place', reward: '', description: '' }]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    if (id) {
      fetchContest();
    }
  }, [id]);

  async function fetchContest() {
    const { data, error } = await supabase.from('contests').select('*').eq('id', id).maybeSingle();

    if (!error && data) {
      setContest(data);
      setPrizes(data.prizes?.length > 0 ? data.prizes : [{ place: '1st Place', reward: '', description: '' }]);
      setJudges(data.judges || []);
      setTimeline(data.timeline || []);
      setSponsors(data.sponsors || []);
    }
    setIsLoading(false);
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function handleSave() {
    if (!contest.title) {
      alert('Please enter a contest title');
      return;
    }

    setIsSaving(true);

    const dataToSave = {
      ...contest,
      slug: contest.slug || generateSlug(contest.title || ''),
      prizes: prizes.filter((p) => p.reward),
      judges: judges.filter((j) => j.name),
      timeline: timeline.filter((t) => t.stage && t.date),
      sponsors: sponsors.filter((s) => s.name),
    };

    try {
      if (isNew) {
        const { error } = await supabase.from('contests').insert([dataToSave]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('contests').update(dataToSave).eq('id', id);
        if (error) throw error;
      }
      navigate('/admin/opportunities');
    } catch (error: any) {
      alert('Error saving contest: ' + error.message);
    }

    setIsSaving(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this contest?')) return;
    await supabase.from('contests').delete().eq('id', id);
    navigate('/admin/opportunities');
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
              <h1 className="text-2xl font-display font-bold">{isNew ? 'New Contest' : 'Edit Contest'}</h1>
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

      <div className="flex gap-1 mb-6 border-b border-neutral-light">
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
                  value={contest.title || ''}
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
                  value={contest.slug || ''}
                  onChange={(e) => setContest((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="brand-identity-challenge-2026"
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={contest.category || 'design'}
                  onChange={(e) => setContest((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none bg-surface"
                >
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="content">Content</option>
                  <option value="strategy">Strategy</option>
                  <option value="mixed">Mixed / Multi-discipline</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Short Description *</label>
                <textarea
                  value={contest.description || ''}
                  onChange={(e) => setContest((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="A brief overview of the contest..."
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Full Brief</label>
                <textarea
                  value={contest.brief || ''}
                  onChange={(e) => setContest((prev) => ({ ...prev, brief: e.target.value }))}
                  rows={5}
                  placeholder="Detailed brief for participants..."
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telegram Channel</label>
                <input
                  type="url"
                  value={contest.telegram_channel || ''}
                  onChange={(e) => setContest((prev) => ({ ...prev, telegram_channel: e.target.value }))}
                  placeholder="https://t.me/yourcontest"
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                <input
                  type="url"
                  value={contest.featured_image || ''}
                  onChange={(e) => setContest((prev) => ({ ...prev, featured_image: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg border border-neutral-light p-6">
            <h2 className="font-display font-semibold mb-6">Status & Visibility</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['upcoming', 'open', 'judging', 'completed'] as const).map((status) => (
                    <label
                      key={status}
                      className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
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
                      <span className="text-sm font-medium capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 border border-neutral-light rounded-lg cursor-pointer hover:bg-neutral-light/20 transition-colors">
                <input
                  type="checkbox"
                  checked={contest.is_featured || false}
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
                <p className="text-sm text-neutral-mid">What winners will receive</p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setPrizes([...prizes, { place: '', reward: '', description: '' }])}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Prize
              </Button>
            </div>

            <div className="space-y-4">
              {prizes.map((prize, index) => (
                <div key={index} className="p-4 bg-neutral-light/20 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-mid mb-1">Position</label>
                        <input
                          type="text"
                          value={prize.place}
                          onChange={(e) => {
                            const newPrizes = [...prizes];
                            newPrizes[index].place = e.target.value;
                            setPrizes(newPrizes);
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
                            const newPrizes = [...prizes];
                            newPrizes[index].reward = e.target.value;
                            setPrizes(newPrizes);
                          }}
                          placeholder="e.g. $5,000"
                          className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-mid mb-1">Additional</label>
                        <input
                          type="text"
                          value={prize.description}
                          onChange={(e) => {
                            const newPrizes = [...prizes];
                            newPrizes[index].description = e.target.value;
                            setPrizes(newPrizes);
                          }}
                          placeholder="e.g. Plus mentorship"
                          className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                        />
                      </div>
                    </div>
                    {prizes.length > 1 && (
                      <button
                        onClick={() => setPrizes(prizes.filter((_, i) => i !== index))}
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
              <Button variant="secondary" onClick={() => setJudges([...judges, { name: '', title: '' }])}>
                <Plus className="w-4 h-4 mr-2" />
                Add Judge
              </Button>
            </div>

            {judges.length > 0 ? (
              <div className="space-y-3">
                {judges.map((judge, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={judge.name}
                      onChange={(e) => {
                        const newJudges = [...judges];
                        newJudges[index].name = e.target.value;
                        setJudges(newJudges);
                      }}
                      placeholder="Name"
                      className="flex-1 px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                    />
                    <input
                      type="text"
                      value={judge.title}
                      onChange={(e) => {
                        const newJudges = [...judges];
                        newJudges[index].title = e.target.value;
                        setJudges(newJudges);
                      }}
                      placeholder="Title / Company"
                      className="flex-1 px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                    />
                    <button
                      onClick={() => setJudges(judges.filter((_, i) => i !== index))}
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

          <div className="bg-surface rounded-lg border border-neutral-light p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-semibold">Sponsors</h2>
                <p className="text-sm text-neutral-mid">Contest sponsors</p>
              </div>
              <Button variant="secondary" onClick={() => setSponsors([...sponsors, { name: '' }])}>
                <Plus className="w-4 h-4 mr-2" />
                Add Sponsor
              </Button>
            </div>

            {sponsors.length > 0 ? (
              <div className="space-y-3">
                {sponsors.map((sponsor, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={sponsor.name}
                      onChange={(e) => {
                        const newSponsors = [...sponsors];
                        newSponsors[index].name = e.target.value;
                        setSponsors(newSponsors);
                      }}
                      placeholder="Sponsor name"
                      className="flex-1 px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                    />
                    <button
                      onClick={() => setSponsors(sponsors.filter((_, i) => i !== index))}
                      className="p-2 text-neutral-mid hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-mid text-center py-4">No sponsors added yet</p>
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
                  type="datetime-local"
                  value={contest.start_date ? new Date(contest.start_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) =>
                    setContest((prev) => ({
                      ...prev,
                      start_date: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    }))
                  }
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
                <p className="text-xs text-neutral-mid mt-1">When submissions open</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="datetime-local"
                  value={contest.end_date ? new Date(contest.end_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) =>
                    setContest((prev) => ({
                      ...prev,
                      end_date: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    }))
                  }
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
                <p className="text-xs text-neutral-mid mt-1">Submission deadline</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Results Date</label>
                <input
                  type="datetime-local"
                  value={contest.results_date ? new Date(contest.results_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) =>
                    setContest((prev) => ({
                      ...prev,
                      results_date: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    }))
                  }
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
              <Button variant="secondary" onClick={() => setTimeline([...timeline, { stage: '', date: '' }])}>
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </div>

            {timeline.length > 0 ? (
              <div className="space-y-3">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={item.stage}
                      onChange={(e) => {
                        const newTimeline = [...timeline];
                        newTimeline[index].stage = e.target.value;
                        setTimeline(newTimeline);
                      }}
                      placeholder="e.g. Judging Period"
                      className="flex-1 px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                    />
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => {
                        const newTimeline = [...timeline];
                        newTimeline[index].date = e.target.value;
                        setTimeline(newTimeline);
                      }}
                      className="px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none text-sm"
                    />
                    <button
                      onClick={() => setTimeline(timeline.filter((_, i) => i !== index))}
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
            items={contest.requirements || []}
            placeholder="e.g. Logo design with variations"
            onChange={(items) => setContest((prev) => ({ ...prev, requirements: items }))}
          />

          <ListEditor
            title="Submission Guidelines"
            description="Format and delivery instructions"
            items={contest.submission_guidelines || []}
            placeholder="e.g. Submit as PDF (max 20 pages)"
            onChange={(items) => setContest((prev) => ({ ...prev, submission_guidelines: items }))}
          />

          <ListEditor
            title="Eligibility"
            description="Who can participate"
            items={contest.eligibility || []}
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
