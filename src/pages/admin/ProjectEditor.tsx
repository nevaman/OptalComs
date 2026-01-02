import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, EyeOff, ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase, Project, ProjectBlock } from '../../lib/supabase';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { GalleryEditor } from '../../components/admin/GalleryEditor';

const industries = [
  { value: '', label: 'Select industry' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Hospitality', label: 'Hospitality' },
  { value: 'Non-profit', label: 'Non-profit' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Education', label: 'Education' },
  { value: 'Media', label: 'Media' },
];

const blockTypes = [
  { value: 'headline_text', label: 'Headline + Text' },
  { value: 'single_image', label: 'Single Image' },
  { value: 'image_grid', label: 'Image Grid' },
  { value: 'split_image_text', label: 'Split Image + Text' },
  { value: 'quote', label: 'Quote' },
  { value: 'statistics', label: 'Statistics' },
  { value: 'process_steps', label: 'Process Steps' },
  { value: 'deliverables', label: 'Deliverables List' },
  { value: 'gallery', label: 'Image Gallery (Masonry)' },
];

export function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'content' | 'blocks'>('details');

  const [project, setProject] = useState<Partial<Project>>({
    title: '',
    slug: '',
    year: new Date().getFullYear(),
    industry: '',
    disciplines: [],
    tags: [],
    summary: '',
    services: [],
    outcomes: [],
    hero_image: '',
    thumbnail_image: '',
    hover_image: '',
    client_name: '',
    challenge: '',
    insight: '',
    solution: '',
    results: '',
    credits: [],
    is_published: false,
    is_featured: false,
  });

  const [blocks, setBlocks] = useState<Partial<ProjectBlock>[]>([]);
  const [disciplineInput, setDisciplineInput] = useState('');
  const [serviceInput, setServiceInput] = useState('');
  const [outcomeInput, setOutcomeInput] = useState('');

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  async function fetchProject() {
    const { data: projectData } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (projectData) {
      setProject(projectData);

      const { data: blocksData } = await supabase
        .from('project_blocks')
        .select('*')
        .eq('project_id', id)
        .order('sort_order', { ascending: true });

      if (blocksData) {
        setBlocks(blocksData);
      }
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
    if (!project.title || !project.slug) {
      alert('Title and slug are required');
      return;
    }

    setIsSaving(true);

    if (isNew) {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

      if (error) {
        alert('Error creating project: ' + error.message);
        setIsSaving(false);
        return;
      }

      if (data && blocks.length > 0) {
        await supabase.from('project_blocks').insert(
          blocks.map((block, index) => ({
            ...block,
            project_id: data.id,
            sort_order: index,
          }))
        );
      }

      navigate(`/admin/projects/${data.id}`);
    } else {
      const { error } = await supabase.from('projects').update(project).eq('id', id);

      if (error) {
        alert('Error saving project: ' + error.message);
        setIsSaving(false);
        return;
      }

      await supabase.from('project_blocks').delete().eq('project_id', id);

      if (blocks.length > 0) {
        await supabase.from('project_blocks').insert(
          blocks.map((block, index) => ({
            project_id: id,
            block_type: block.block_type,
            content: block.content,
            sort_order: index,
          }))
        );
      }
    }

    setIsSaving(false);
  }

  async function togglePublish() {
    const newStatus = !project.is_published;
    setProject((prev) => ({
      ...prev,
      is_published: newStatus,
      published_at: newStatus ? new Date().toISOString() : null,
    }));
  }

  function addBlock(type: string) {
    const newBlock: Partial<ProjectBlock> = {
      block_type: type as ProjectBlock['block_type'],
      content: {},
      sort_order: blocks.length,
    };
    setBlocks((prev) => [...prev, newBlock]);
  }

  function updateBlock(index: number, content: Record<string, unknown>) {
    setBlocks((prev) =>
      prev.map((block, i) => (i === index ? { ...block, content } : block))
    );
  }

  function removeBlock(index: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    setBlocks((prev) => {
      const newBlocks = [...prev];
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      return newBlocks;
    });
  }

  function addToList(
    field: 'disciplines' | 'services' | 'outcomes',
    value: string,
    setter: (v: string) => void
  ) {
    if (!value.trim()) return;
    setProject((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()],
    }));
    setter('');
  }

  function removeFromList(field: 'disciplines' | 'services' | 'outcomes', index: number) {
    setProject((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-8 bg-neutral-light w-48 mb-8" />
        <div className="space-y-4">
          <div className="h-12 bg-neutral-light" />
          <div className="h-12 bg-neutral-light" />
          <div className="h-32 bg-neutral-light" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/projects')}
            className="p-2 text-neutral-mid hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-display font-semibold">
            {isNew ? 'New Project' : project.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={togglePublish}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
              project.is_published
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-neutral-light text-neutral-mid hover:bg-neutral-light/80'
            }`}
          >
            {project.is_published ? (
              <>
                <Eye className="w-4 h-4" />
                Published
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                Draft
              </>
            )}
          </button>
          <Button onClick={handleSave} variant="primary" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="border-b border-neutral-light mb-8">
        <div className="flex gap-8">
          {(['details', 'content', 'blocks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-mid hover:text-primary'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'details' && (
        <div className="space-y-8">
          <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
            <h2 className="font-display font-semibold">Basic Information</h2>

            <Input
              label="Title"
              value={project.title || ''}
              onChange={(e) => {
                const title = e.target.value;
                setProject((prev) => ({
                  ...prev,
                  title,
                  slug: prev.slug || generateSlug(title),
                }));
              }}
              required
              placeholder="Project title"
            />

            <Input
              label="Slug"
              value={project.slug || ''}
              onChange={(e) => setProject((prev) => ({ ...prev, slug: e.target.value }))}
              required
              placeholder="project-slug"
            />

            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Year"
                type="number"
                value={project.year || ''}
                onChange={(e) =>
                  setProject((prev) => ({ ...prev, year: parseInt(e.target.value) || 0 }))
                }
              />
              <Select
                label="Industry"
                value={project.industry || ''}
                onChange={(e) => setProject((prev) => ({ ...prev, industry: e.target.value }))}
                options={industries}
              />
            </div>

            <Input
              label="Client Name"
              value={project.client_name || ''}
              onChange={(e) => setProject((prev) => ({ ...prev, client_name: e.target.value }))}
              placeholder="Client or company name"
            />

            <Textarea
              label="Summary"
              value={project.summary || ''}
              onChange={(e) => setProject((prev) => ({ ...prev, summary: e.target.value }))}
              placeholder="Brief project summary (1-2 sentences)"
              rows={3}
            />
          </div>

          <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
            <h2 className="font-display font-semibold">Media</h2>

            <Input
              label="Hero Image URL"
              value={project.hero_image || ''}
              onChange={(e) => setProject((prev) => ({ ...prev, hero_image: e.target.value }))}
              placeholder="https://..."
            />

            <Input
              label="Thumbnail Image URL"
              value={project.thumbnail_image || ''}
              onChange={(e) => setProject((prev) => ({ ...prev, thumbnail_image: e.target.value }))}
              placeholder="https://..."
            />

            <Input
              label="Hover Image URL"
              value={project.hover_image || ''}
              onChange={(e) => setProject((prev) => ({ ...prev, hover_image: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
            <h2 className="font-display font-semibold">Disciplines & Services</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Disciplines</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={disciplineInput}
                  onChange={(e) => setDisciplineInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToList('disciplines', disciplineInput, setDisciplineInput);
                    }
                  }}
                  className="input-field flex-1"
                  placeholder="Add discipline and press Enter"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => addToList('disciplines', disciplineInput, setDisciplineInput)}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.disciplines?.map((d, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-light rounded text-sm"
                  >
                    {d}
                    <button
                      onClick={() => removeFromList('disciplines', i)}
                      className="text-neutral-mid hover:text-primary"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Services</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToList('services', serviceInput, setServiceInput);
                    }
                  }}
                  className="input-field flex-1"
                  placeholder="Add service and press Enter"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => addToList('services', serviceInput, setServiceInput)}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.services?.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-light rounded text-sm"
                  >
                    {s}
                    <button
                      onClick={() => removeFromList('services', i)}
                      className="text-neutral-mid hover:text-primary"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Outcomes</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={outcomeInput}
                  onChange={(e) => setOutcomeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToList('outcomes', outcomeInput, setOutcomeInput);
                    }
                  }}
                  className="input-field flex-1"
                  placeholder="Add outcome and press Enter"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => addToList('outcomes', outcomeInput, setOutcomeInput)}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.outcomes?.map((o, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-light rounded text-sm"
                  >
                    {o}
                    <button
                      onClick={() => removeFromList('outcomes', i)}
                      className="text-neutral-mid hover:text-primary"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-8">
          <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
            <h2 className="font-display font-semibold">Case Study Content</h2>

            <Textarea
              label="Challenge"
              value={project.challenge || ''}
              onChange={(e) => setProject((prev) => ({ ...prev, challenge: e.target.value }))}
              placeholder="What problem was the client facing?"
              rows={4}
            />

            <Textarea
              label="Insight"
              value={project.insight || ''}
              onChange={(e) => setProject((prev) => ({ ...prev, insight: e.target.value }))}
              placeholder="What key insight drove the solution?"
              rows={4}
            />

            <Textarea
              label="Solution"
              value={project.solution || ''}
              onChange={(e) => setProject((prev) => ({ ...prev, solution: e.target.value }))}
              placeholder="What solution did you deliver?"
              rows={4}
            />

            <Textarea
              label="Results"
              value={project.results || ''}
              onChange={(e) => setProject((prev) => ({ ...prev, results: e.target.value }))}
              placeholder="What were the outcomes?"
              rows={4}
            />
          </div>
        </div>
      )}

      {activeTab === 'blocks' && (
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded border border-neutral-light">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold">Content Blocks</h2>
              <div className="flex gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addBlock(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="input-field text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Add block...
                  </option>
                  {blockTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {blocks.length > 0 ? (
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <BlockEditor
                    key={index}
                    block={block}
                    index={index}
                    totalBlocks={blocks.length}
                    onUpdate={(content) => updateBlock(index, content)}
                    onRemove={() => removeBlock(index)}
                    onMove={(direction) => moveBlock(index, direction)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-neutral-mid text-center py-8">
                No content blocks yet. Add blocks to build your case study.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BlockEditor({
  block,
  index,
  totalBlocks,
  onUpdate,
  onRemove,
  onMove,
}: {
  block: Partial<ProjectBlock>;
  index: number;
  totalBlocks: number;
  onUpdate: (content: Record<string, unknown>) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
}) {
  const content = (block.content || {}) as Record<string, unknown>;
  const blockLabel = blockTypes.find((t) => t.value === block.block_type)?.label || block.block_type;

  return (
    <div className="border border-neutral-light rounded">
      <div className="flex items-center justify-between p-3 bg-neutral-light/30 border-b border-neutral-light">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-neutral-mid cursor-move" />
          <span className="text-sm font-medium">{blockLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="p-1 text-neutral-mid hover:text-primary disabled:opacity-30"
          >
            &uarr;
          </button>
          <button
            onClick={() => onMove('down')}
            disabled={index === totalBlocks - 1}
            className="p-1 text-neutral-mid hover:text-primary disabled:opacity-30"
          >
            &darr;
          </button>
          <button onClick={onRemove} className="p-1 text-red-500 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {block.block_type === 'headline_text' && (
          <>
            <Input
              label="Headline"
              value={String(content.headline || '')}
              onChange={(e) => onUpdate({ ...content, headline: e.target.value })}
              placeholder="Section headline"
            />
            <Textarea
              label="Text"
              value={String(content.text || '')}
              onChange={(e) => onUpdate({ ...content, text: e.target.value })}
              placeholder="Section text content"
              rows={4}
            />
          </>
        )}

        {block.block_type === 'single_image' && (
          <>
            <Input
              label="Image URL"
              value={String(content.url || '')}
              onChange={(e) => onUpdate({ ...content, url: e.target.value })}
              placeholder="https://..."
            />
            <Input
              label="Caption"
              value={String(content.caption || '')}
              onChange={(e) => onUpdate({ ...content, caption: e.target.value })}
              placeholder="Image caption (optional)"
            />
          </>
        )}

        {block.block_type === 'quote' && (
          <>
            <Textarea
              label="Quote Text"
              value={String(content.text || '')}
              onChange={(e) => onUpdate({ ...content, text: e.target.value })}
              placeholder="Quote text"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Author"
                value={String(content.author || '')}
                onChange={(e) => onUpdate({ ...content, author: e.target.value })}
                placeholder="Author name"
              />
              <Input
                label="Role"
                value={String(content.role || '')}
                onChange={(e) => onUpdate({ ...content, role: e.target.value })}
                placeholder="Author role"
              />
            </div>
          </>
        )}

        {block.block_type === 'split_image_text' && (
          <>
            <Input
              label="Image URL"
              value={String(content.imageUrl || '')}
              onChange={(e) => onUpdate({ ...content, imageUrl: e.target.value })}
              placeholder="https://..."
            />
            <Input
              label="Headline"
              value={String(content.headline || '')}
              onChange={(e) => onUpdate({ ...content, headline: e.target.value })}
              placeholder="Section headline"
            />
            <Textarea
              label="Text"
              value={String(content.text || '')}
              onChange={(e) => onUpdate({ ...content, text: e.target.value })}
              placeholder="Section text"
              rows={3}
            />
            <Select
              label="Image Position"
              value={String(content.imagePosition || 'left')}
              onChange={(e) => onUpdate({ ...content, imagePosition: e.target.value })}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
              ]}
            />
          </>
        )}

        {block.block_type === 'gallery' && (
          <GalleryEditor 
            images={(content.images as any[]) || []} 
            onUpdate={(images) => onUpdate({ ...content, images })} 
          />
        )}

        {(block.block_type === 'image_grid' || block.block_type === 'statistics' || block.block_type === 'process_steps' || block.block_type === 'deliverables') && (
          <p className="text-sm text-neutral-mid">
            Configure this block type in the JSON content field for advanced customization.
          </p>
        )}
      </div>
    </div>
  );
}
