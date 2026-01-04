import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, Plus, X } from 'lucide-react';
import { supabase, Opportunity } from '../../lib/supabase';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function OpportunityEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [requirementInput, setRequirementInput] = useState('');

  const [opportunity, setOpportunity] = useState<Partial<Opportunity>>({
    type: 'job',
    title: '',
    slug: '',
    description: '',
    requirements: [],
    location: '',
    deadline: '',
    status: 'draft',
    external_link: '',
    metadata: {},
    is_featured: false,
  });

  useEffect(() => {
    if (id) {
      fetchOpportunity();
    }
  }, [id]);

  async function fetchOpportunity() {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      // Format date for input
      const formattedDate = data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '';
      setOpportunity({
        ...data,
        deadline: formattedDate,
        metadata: data.metadata || {},
        is_featured: data.is_featured,
      });
    }
    setIsLoading(false);
  }

  const metadata = (opportunity.metadata as Record<string, unknown> | null) || {};

  const updateMetadataField = (key: string, value: unknown) => {
    setOpportunity((prev) => ({
      ...prev,
      metadata: { ...((prev.metadata as Record<string, unknown>) || {}), [key]: value },
    }));
  };

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function handleSave() {
    if (!opportunity.title || !opportunity.slug) {
      alert('Title and slug are required');
      return;
    }

    setIsSaving(true);
    
    // Prepare data for Supabase
    const dataToSave = {
      ...opportunity,
      deadline: opportunity.deadline || null,
      metadata: metadata,
      is_featured: opportunity.is_featured || false,
    };

    if (isNew) {
      const { error } = await supabase.from('opportunities').insert([dataToSave]);
      if (error) {
        alert('Error creating opportunity: ' + error.message);
      } else {
        navigate('/admin/opportunities');
      }
    } else {
      const { error } = await supabase
        .from('opportunities')
        .update(dataToSave)
        .eq('id', id);
      
      if (error) {
        alert('Error updating opportunity: ' + error.message);
      } else {
        navigate('/admin/opportunities');
      }
    }
    setIsSaving(false);
  }

  function addRequirement() {
    if (!requirementInput.trim()) return;
    setOpportunity((prev) => ({
      ...prev,
      requirements: [...(prev.requirements || []), requirementInput.trim()],
    }));
    setRequirementInput('');
  }

  function removeRequirement(index: number) {
    setOpportunity((prev) => ({
      ...prev,
      requirements: (prev.requirements || []).filter((_, i) => i !== index),
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
            {isNew ? 'New Opportunity' : 'Edit Opportunity'}
          </h1>
        </div>
        <div className="flex gap-3">
          {!isNew && (
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete this opportunity?')) {
                  const { error } = await supabase.from('opportunities').delete().eq('id', id);
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
            Save Opportunity
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
            <h2 className="font-display font-semibold">Details</h2>
            
            <Input
              label="Title"
              value={opportunity.title || ''}
              onChange={(e) => {
                const title = e.target.value;
                setOpportunity((prev) => ({
                  ...prev,
                  title,
                  slug: isNew ? generateSlug(title) : prev.slug,
                }));
              }}
              required
              placeholder="e.g. Senior Brand Designer"
            />

            <Input
              label="Slug"
              value={opportunity.slug || ''}
              onChange={(e) => setOpportunity((prev) => ({ ...prev, slug: e.target.value }))}
              required
            />

            <Textarea
              label="Description"
              value={opportunity.description || ''}
              onChange={(e) => setOpportunity((prev) => ({ ...prev, description: e.target.value }))}
              required
              rows={6}
              placeholder="Describe the role or contest..."
            />

            <div>
              <label className="block text-sm font-medium mb-2">Requirements</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  placeholder="Add a requirement..."
                  className="input-field flex-1"
                />
                <Button type="button" variant="secondary" onClick={addRequirement}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {opportunity.requirements?.map((req, i) => (
                  <li key={i} className="flex items-center justify-between p-3 bg-neutral-light/30 rounded text-sm">
                    {req}
                    <button onClick={() => removeRequirement(i)} className="text-neutral-mid hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
            <h2 className="font-display font-semibold">Settings</h2>

            <Select
              label="Type"
              value={opportunity.type || 'job'}
              onChange={(e) => setOpportunity((prev) => ({ ...prev, type: e.target.value as any }))}
              options={[
                { value: 'job', label: 'Career / Job' },
                { value: 'contest', label: 'Contest' },
                { value: 'grant', label: 'Grant / Funding' },
              ]}
            />

            <Select
              label="Status"
              value={opportunity.status || 'draft'}
              onChange={(e) => setOpportunity((prev) => ({ ...prev, status: e.target.value as any }))}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'open', label: 'Open / Live' },
                { value: 'closed', label: 'Closed' },
              ]}
            />

            <Input
              label="Location"
              value={opportunity.location || ''}
              onChange={(e) => setOpportunity((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Addis Ababa / Remote"
            />

            <Input
              label="Company / Organization"
              value={(metadata.company as string) || ''}
              onChange={(e) => updateMetadataField('company', e.target.value)}
              placeholder="Who is offering this opportunity?"
            />

            <Input
              label="Category"
              value={(metadata.category as string) || ''}
              onChange={(e) => updateMetadataField('category', e.target.value)}
              placeholder="Design, Marketing, Technology..."
            />

            <Input
              label="Compensation / Prize"
              value={(metadata.compensation as string) || ''}
              onChange={(e) => updateMetadataField('compensation', e.target.value)}
              placeholder="Salary range or prize amount"
            />

            <Input
              label="Deadline"
              type="date"
              value={opportunity.deadline || ''}
              onChange={(e) => setOpportunity((prev) => ({ ...prev, deadline: e.target.value }))}
            />

            <Input
              label="External Link (Optional)"
              value={opportunity.external_link || ''}
              onChange={(e) => setOpportunity((prev) => ({ ...prev, external_link: e.target.value }))}
              placeholder="https://..."
            />

            <div className="flex items-center justify-between border border-neutral-light rounded px-3 py-2">
              <span className="text-sm font-medium">Feature this opportunity</span>
              <input
                type="checkbox"
                checked={opportunity.is_featured || false}
                onChange={(e) => setOpportunity((prev) => ({ ...prev, is_featured: e.target.checked }))}
                className="h-4 w-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
