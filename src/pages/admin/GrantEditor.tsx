import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, X, Coins } from 'lucide-react';
import { supabase, Grant } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

export function GrantEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const [grant, setGrant] = useState<Partial<Grant>>({
    title: '',
    organization: '',
    amount_min: 0,
    amount_max: 0,
    description: '',
    focus_areas: [],
    eligibility: [],
    requirements: [],
    application_process: [],
    status: 'open',
    is_featured: false,
    category: 'creative',
    funding_type: 'grant',
  });

  useEffect(() => {
    if (id) {
      fetchGrant();
    }
  }, [id]);

  async function fetchGrant() {
    const { data, error } = await supabase.from('grants').select('*').eq('id', id).maybeSingle();

    if (!error && data) {
      setGrant(data);
    }
    setIsLoading(false);
  }

  async function handleSave() {
    if (!grant.title) {
      alert('Please enter a grant title');
      return;
    }
    if (!grant.organization) {
      alert('Please enter the organization name');
      return;
    }

    setIsSaving(true);

    try {
      if (isNew) {
        const { error } = await supabase.from('grants').insert([grant]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('grants').update(grant).eq('id', id);
        if (error) throw error;
      }
      navigate('/admin/opportunities');
    } catch (error: any) {
      alert('Error saving grant: ' + error.message);
    }

    setIsSaving(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this grant?')) return;
    await supabase.from('grants').delete().eq('id', id);
    navigate('/admin/opportunities');
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">{isNew ? 'New Grant' : 'Edit Grant'}</h1>
              <p className="text-sm text-neutral-mid">Funding opportunity</p>
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
            {isNew ? 'Create Grant' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-surface rounded-lg border border-neutral-light p-6">
          <h2 className="font-display font-semibold mb-6">Grant Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Grant Title *</label>
              <input
                type="text"
                value={grant.title || ''}
                onChange={(e) => setGrant((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Creative Innovation Fund"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Organization *</label>
              <input
                type="text"
                value={grant.organization || ''}
                onChange={(e) => setGrant((prev) => ({ ...prev, organization: e.target.value }))}
                placeholder="e.g. National Arts Foundation"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">External Link</label>
              <input
                type="url"
                value={grant.external_link || ''}
                onChange={(e) => setGrant((prev) => ({ ...prev, external_link: e.target.value }))}
                placeholder="https://foundation.org/apply"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={grant.description || ''}
                onChange={(e) => setGrant((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Describe the grant, its purpose, and what kind of projects it supports..."
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-neutral-light p-6">
          <h2 className="font-display font-semibold mb-6">Funding Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={grant.category || 'creative'}
                onChange={(e) => setGrant((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none bg-surface"
              >
                <option value="creative">Creative & Arts</option>
                <option value="technology">Technology</option>
                <option value="social_impact">Social Impact</option>
                <option value="research">Research</option>
                <option value="education">Education</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Funding Type</label>
              <select
                value={grant.funding_type || 'grant'}
                onChange={(e) => setGrant((prev) => ({ ...prev, funding_type: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none bg-surface"
              >
                <option value="grant">Grant</option>
                <option value="fellowship">Fellowship</option>
                <option value="residency">Residency</option>
                <option value="sponsorship">Sponsorship</option>
                <option value="prize">Prize / Award</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Minimum Amount ($)</label>
              <input
                type="number"
                value={grant.amount_min || ''}
                onChange={(e) => setGrant((prev) => ({ ...prev, amount_min: parseInt(e.target.value) || 0 }))}
                placeholder="5000"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Maximum Amount ($)</label>
              <input
                type="number"
                value={grant.amount_max || ''}
                onChange={(e) => setGrant((prev) => ({ ...prev, amount_max: parseInt(e.target.value) || 0 }))}
                placeholder="50000"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Application Deadline</label>
              <input
                type="datetime-local"
                value={grant.deadline ? new Date(grant.deadline).toISOString().slice(0, 16) : ''}
                onChange={(e) =>
                  setGrant((prev) => ({
                    ...prev,
                    deadline: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                  }))
                }
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={grant.status || 'open'}
                onChange={(e) => setGrant((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none bg-surface"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </div>

        <ListEditor
          title="Focus Areas"
          description="What topics or fields does this grant support"
          items={grant.focus_areas || []}
          placeholder="e.g. Digital Art, Interactive Media"
          onChange={(items) => setGrant((prev) => ({ ...prev, focus_areas: items }))}
        />

        <ListEditor
          title="Requirements"
          description="What applicants need to submit"
          items={grant.requirements || []}
          placeholder="e.g. Project proposal, Portfolio, Budget breakdown"
          onChange={(items) => setGrant((prev) => ({ ...prev, requirements: items }))}
        />

        <ListEditor
          title="Eligibility"
          description="Who can apply for this grant"
          items={grant.eligibility || []}
          placeholder="e.g. Individual artists, Non-profit organizations"
          onChange={(items) => setGrant((prev) => ({ ...prev, eligibility: items }))}
        />

        <ListEditor
          title="Application Process"
          description="Steps to apply"
          items={grant.application_process || []}
          placeholder="e.g. Submit online application, Panel review"
          onChange={(items) => setGrant((prev) => ({ ...prev, application_process: items }))}
        />

        <div className="bg-surface rounded-lg border border-neutral-light p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={grant.is_featured || false}
              onChange={(e) => setGrant((prev) => ({ ...prev, is_featured: e.target.checked }))}
              className="w-5 h-5 text-orange rounded"
            />
            <div>
              <span className="font-medium">Featured Grant</span>
              <p className="text-sm text-neutral-mid">Highlight this grant on the opportunities page</p>
            </div>
          </label>
        </div>
      </div>
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
