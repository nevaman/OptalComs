import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, Plus, X } from 'lucide-react';
import { supabase, Contest } from '../../lib/supabase';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function ContestEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  
  // Array inputs
  const [reqInput, setReqInput] = useState('');
  const [guideInput, setGuideInput] = useState('');
  const [eligInput, setEligInput] = useState('');

  // JSON inputs (as strings for editing)
  const [prizesJson, setPrizesJson] = useState('[]');
  const [judgesJson, setJudgesJson] = useState('[]');
  const [timelineJson, setTimelineJson] = useState('[]');
  const [sponsorsJson, setSponsorsJson] = useState('[]');

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
    prizes: [],
    judges: [],
    timeline: [],
    sponsors: [],
  });

  useEffect(() => {
    if (id) {
      fetchContest();
    }
  }, [id]);

  async function fetchContest() {
    const { data, error } = await supabase
      .from('contests')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      setContest(data);
      setPrizesJson(JSON.stringify(data.prizes || [], null, 2));
      setJudgesJson(JSON.stringify(data.judges || [], null, 2));
      setTimelineJson(JSON.stringify(data.timeline || [], null, 2));
      setSponsorsJson(JSON.stringify(data.sponsors || [], null, 2));
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
    if (!contest.title || !contest.slug) {
      alert('Title and slug are required');
      return;
    }

    setIsSaving(true);
    
    try {
      const dataToSave = { 
        ...contest,
        prizes: JSON.parse(prizesJson),
        judges: JSON.parse(judgesJson),
        timeline: JSON.parse(timelineJson),
        sponsors: JSON.parse(sponsorsJson),
      };

      if (isNew) {
        const { error } = await supabase.from('contests').insert([dataToSave]);
        if (error) throw error;
        navigate('/admin/opportunities');
      } else {
        const { error } = await supabase
          .from('contests')
          .update(dataToSave)
          .eq('id', id);
        
        if (error) throw error;
        navigate('/admin/opportunities');
      }
    } catch (error: any) {
      alert('Error saving contest: ' + error.message);
    }
    
    setIsSaving(false);
  }

  function addItem(
    input: string, 
    setInput: (s: string) => void, 
    list: string[] | undefined, 
    field: keyof Contest
  ) {
    if (!input.trim()) return;
    const currentList = (list || []) as string[];
    setContest(prev => ({ ...prev, [field]: [...currentList, input.trim()] }));
    setInput('');
  }

  function removeItem(index: number, list: string[] | undefined, field: keyof Contest) {
    const currentList = (list || []) as string[];
    setContest(prev => ({
      ...prev,
      [field]: currentList.filter((_, i) => i !== index),
    }));
  }

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/opportunities')}
            className="p-2 text-neutral-mid hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-display font-bold">
            {isNew ? 'New Contest' : 'Edit Contest'}
          </h1>
        </div>
        <div className="flex gap-3">
          {!isNew && (
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete this contest?')) {
                  const { error } = await supabase.from('contests').delete().eq('id', id);
                  if (!error) navigate('/admin/opportunities');
                }
              }}
              className="p-2 text-neutral-mid hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <Button onClick={handleSave} variant="primary" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Contest
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
            <h2 className="font-display font-semibold">Details</h2>
            
            <Input
              label="Title"
              value={contest.title || ''}
              onChange={(e) => {
                const title = e.target.value;
                setContest(prev => ({ 
                  ...prev, 
                  title,
                  slug: isNew ? generateSlug(title) : prev.slug 
                }));
              }}
              required
            />

            <Input
              label="Slug"
              value={contest.slug || ''}
              onChange={(e) => setContest(prev => ({ ...prev, slug: e.target.value }))}
              required
            />

            <Textarea
              label="Description"
              value={contest.description || ''}
              onChange={(e) => setContest(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
            />

            <Textarea
              label="Brief"
              value={contest.brief || ''}
              onChange={(e) => setContest(prev => ({ ...prev, brief: e.target.value }))}
              required
              rows={6}
            />

            {/* Arrays */}
            <div>
              <label className="block text-sm font-medium mb-2">Requirements</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={reqInput}
                  onChange={(e) => setReqInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(reqInput, setReqInput, contest.requirements, 'requirements'))}
                  className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                />
                <Button type="button" variant="secondary" onClick={() => addItem(reqInput, setReqInput, contest.requirements, 'requirements')}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {contest.requirements?.map((req, i) => (
                  <li key={i} className="flex items-center justify-between p-3 bg-neutral-light/30 rounded text-sm">
                    {req}
                    <button onClick={() => removeItem(i, contest.requirements, 'requirements')} className="text-neutral-mid hover:text-red-500"><X className="w-4 h-4" /></button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Complex JSON fields */}
            <div>
              <label className="block text-sm font-medium mb-2">Prizes (JSON)</label>
              <Textarea value={prizesJson} onChange={(e) => setPrizesJson(e.target.value)} rows={5} className="font-mono text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Timeline (JSON)</label>
              <Textarea value={timelineJson} onChange={(e) => setTimelineJson(e.target.value)} rows={5} className="font-mono text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Judges (JSON)</label>
              <Textarea value={judgesJson} onChange={(e) => setJudgesJson(e.target.value)} rows={5} className="font-mono text-sm" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
            <h2 className="font-display font-semibold">Settings</h2>

            <Select
              label="Status"
              value={contest.status || 'upcoming'}
              onChange={(e) => setContest(prev => ({ ...prev, status: e.target.value }))}
              options={[
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'open', label: 'Open' },
                { value: 'judging', label: 'Judging' },
                { value: 'completed', label: 'Completed' },
              ]}
            />
            
            <Select
              label="Category"
              value={contest.category || 'design'}
              onChange={(e) => setContest(prev => ({ ...prev, category: e.target.value }))}
              options={[
                { value: 'design', label: 'Design' },
                { value: 'development', label: 'Development' },
                { value: 'strategy', label: 'Strategy' },
                { value: 'content', label: 'Content' },
                { value: 'mixed', label: 'Mixed' },
              ]}
            />

            <Input
              label="Start Date"
              type="datetime-local"
              value={contest.start_date ? new Date(contest.start_date).toISOString().slice(0, 16) : ''}
              onChange={(e) => setContest(prev => ({ ...prev, start_date: new Date(e.target.value).toISOString() }))}
            />

            <Input
              label="End Date"
              type="datetime-local"
              value={contest.end_date ? new Date(contest.end_date).toISOString().slice(0, 16) : ''}
              onChange={(e) => setContest(prev => ({ ...prev, end_date: new Date(e.target.value).toISOString() }))}
            />

            <Input
              label="Results Date"
              type="datetime-local"
              value={contest.results_date ? new Date(contest.results_date).toISOString().slice(0, 16) : ''}
              onChange={(e) => setContest(prev => ({ ...prev, results_date: new Date(e.target.value).toISOString() }))}
            />

            <Input
              label="Featured Image URL"
              value={contest.featured_image || ''}
              onChange={(e) => setContest(prev => ({ ...prev, featured_image: e.target.value }))}
            />

            <Input
              label="Telegram Channel"
              value={contest.telegram_channel || ''}
              onChange={(e) => setContest(prev => ({ ...prev, telegram_channel: e.target.value }))}
            />

            <div className="flex items-center gap-2">
               <input
                 type="checkbox"
                 checked={contest.is_featured || false}
                 onChange={(e) => setContest(prev => ({ ...prev, is_featured: e.target.checked }))}
               />
               <label>Featured</label>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

