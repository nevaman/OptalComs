import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, X, Coins } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

interface GrantData {
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  deadline: string;
  status: 'draft' | 'open' | 'closed';
  external_link: string;
  is_featured: boolean;
  organization: string;
  amount_min: number;
  amount_max: number;
  focus_areas: string[];
  eligibility: string[];
  application_process: string[];
  category: string;
  funding_type: string;
}

const grantCategories = [
  { value: 'creative', label: 'Creative & Arts' },
  { value: 'technology', label: 'Technology' },
  { value: 'social_impact', label: 'Social Impact' },
  { value: 'research', label: 'Research' },
  { value: 'education', label: 'Education' },
  { value: 'general', label: 'General' },
];

const fundingTypes = [
  { value: 'grant', label: 'Grant' },
  { value: 'fellowship', label: 'Fellowship' },
  { value: 'residency', label: 'Residency' },
  { value: 'sponsorship', label: 'Sponsorship' },
  { value: 'prize', label: 'Prize / Award' },
];

export function GrantEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const [grant, setGrant] = useState<GrantData>({
    title: '',
    slug: '',
    description: '',
    requirements: [],
    deadline: '',
    status: 'draft',
    external_link: '',
    is_featured: false,
    organization: '',
    amount_min: 0,
    amount_max: 0,
    focus_areas: [],
    eligibility: [],
    application_process: [],
    category: 'general',
    funding_type: 'grant',
  });

  useEffect(() => {
    if (!isNew && id) {
      fetchGrant();
    }
  }, [id, isNew]);

  async function fetchGrant() {
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
    setGrant({
      title: data.title,
      slug: data.slug,
      description: data.description,
      requirements: data.requirements || [],
      deadline: data.deadline ? data.deadline.split('T')[0] : '',
      status: data.status,
      external_link: data.external_link || '',
      is_featured: data.is_featured,
      organization: (metadata.organization as string) || '',
      amount_min: (metadata.amount_min as number) || 0,
      amount_max: (metadata.amount_max as number) || 0,
      focus_areas: (metadata.focus_areas as string[]) || [],
      eligibility: (metadata.eligibility as string[]) || [],
      application_process: (metadata.application_process as string[]) || [],
      category: (metadata.category as string) || 'general',
      funding_type: (metadata.funding_type as string) || 'grant',
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
    if (!grant.title.trim()) {
      alert('Please enter a grant title');
      return;
    }

    if (!grant.organization.trim()) {
      alert('Please enter the organization name');
      return;
    }

    setIsSaving(true);

    const opportunityData = {
      type: 'grant',
      title: grant.title,
      slug: grant.slug || generateSlug(grant.title),
      description: grant.description,
      requirements: grant.requirements,
      deadline: grant.deadline ? new Date(grant.deadline).toISOString() : null,
      status: grant.status,
      external_link: grant.external_link || null,
      is_featured: grant.is_featured,
      metadata: {
        organization: grant.organization,
        amount_min: grant.amount_min,
        amount_max: grant.amount_max,
        focus_areas: grant.focus_areas,
        eligibility: grant.eligibility,
        application_process: grant.application_process,
        category: grant.category,
        funding_type: grant.funding_type,
      },
    };

    if (isNew) {
      const { error } = await supabase.from('opportunities').insert([opportunityData]);
      if (error) {
        alert('Error creating grant: ' + error.message);
        setIsSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from('opportunities')
        .update(opportunityData)
        .eq('id', id);
      if (error) {
        alert('Error updating grant: ' + error.message);
        setIsSaving(false);
        return;
      }
    }

    setIsSaving(false);
    navigate('/admin/opportunities');
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this grant?')) return;

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
              <h1 className="text-2xl font-display font-bold">
                {isNew ? 'New Grant' : 'Edit Grant'}
              </h1>
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
                value={grant.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setGrant((prev) => ({
                    ...prev,
                    title,
                    slug: isNew ? generateSlug(title) : prev.slug,
                  }));
                }}
                placeholder="e.g. Creative Innovation Fund"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL Slug</label>
              <input
                type="text"
                value={grant.slug}
                onChange={(e) => setGrant((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="creative-innovation-fund"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Organization *</label>
              <input
                type="text"
                value={grant.organization}
                onChange={(e) => setGrant((prev) => ({ ...prev, organization: e.target.value }))}
                placeholder="e.g. National Arts Foundation"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={grant.description}
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
                value={grant.category}
                onChange={(e) => setGrant((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none bg-surface"
              >
                {grantCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Funding Type</label>
              <select
                value={grant.funding_type}
                onChange={(e) => setGrant((prev) => ({ ...prev, funding_type: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none bg-surface"
              >
                {fundingTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
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
                type="date"
                value={grant.deadline}
                onChange={(e) => setGrant((prev) => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">External Link</label>
              <input
                type="url"
                value={grant.external_link}
                onChange={(e) => setGrant((prev) => ({ ...prev, external_link: e.target.value }))}
                placeholder="https://foundation.org/apply"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>
          </div>
        </div>

        <ListEditor
          title="Focus Areas"
          description="What topics or fields does this grant support"
          items={grant.focus_areas}
          placeholder="e.g. Digital Art, Interactive Media"
          onChange={(items) => setGrant((prev) => ({ ...prev, focus_areas: items }))}
        />

        <ListEditor
          title="Requirements"
          description="What applicants need to submit"
          items={grant.requirements}
          placeholder="e.g. Project proposal, Portfolio, Budget breakdown"
          onChange={(items) => setGrant((prev) => ({ ...prev, requirements: items }))}
        />

        <ListEditor
          title="Eligibility"
          description="Who can apply for this grant"
          items={grant.eligibility}
          placeholder="e.g. Individual artists, Non-profit organizations"
          onChange={(items) => setGrant((prev) => ({ ...prev, eligibility: items }))}
        />

        <ListEditor
          title="Application Process"
          description="Steps to apply"
          items={grant.application_process}
          placeholder="e.g. Submit online application, Panel review"
          onChange={(items) => setGrant((prev) => ({ ...prev, application_process: items }))}
        />

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
                      grant.status === status
                        ? 'border-orange bg-orange/5'
                        : 'border-neutral-light hover:border-neutral-mid'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={grant.status === status}
                      onChange={() => setGrant((prev) => ({ ...prev, status }))}
                      className="sr-only"
                    />
                    <span className="font-medium capitalize">{status}</span>
                    <p className="text-xs text-neutral-mid mt-1">
                      {status === 'draft' && 'Hidden from public'}
                      {status === 'open' && 'Accepting applications'}
                      {status === 'closed' && 'No longer accepting'}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 border border-neutral-light rounded-lg cursor-pointer hover:bg-neutral-light/20 transition-colors">
              <input
                type="checkbox"
                checked={grant.is_featured}
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
