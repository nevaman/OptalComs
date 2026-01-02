import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, EyeOff, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { supabase, Insight } from '../../lib/supabase';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function InsightEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const [insight, setInsight] = useState<Partial<Insight>>({
    title: '',
    slug: '',
    excerpt: '',
    content: [],
    featured_image: '',
    tags: [],
    is_published: false,
    is_featured: false,
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (id) {
      fetchInsight();
    }
  }, [id]);

  async function fetchInsight() {
    const { data } = await supabase.from('insights').select('*').eq('id', id).maybeSingle();

    if (data) {
      setInsight(data);
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
    if (!insight.title || !insight.slug) {
      alert('Title and slug are required');
      return;
    }

    setIsSaving(true);

    if (isNew) {
      const { data, error } = await supabase.from('insights').insert([insight]).select().single();

      if (error) {
        alert('Error creating insight: ' + error.message);
        setIsSaving(false);
        return;
      }

      navigate(`/admin/insights/${data.id}`);
    } else {
      const { error } = await supabase.from('insights').update(insight).eq('id', id);

      if (error) {
        alert('Error saving insight: ' + error.message);
      }
    }

    setIsSaving(false);
  }

  function togglePublish() {
    setInsight((prev) => ({
      ...prev,
      is_published: !prev.is_published,
      published_at: !prev.is_published ? new Date().toISOString() : null,
    }));
  }

  function addTag() {
    if (!tagInput.trim()) return;
    setInsight((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()],
    }));
    setTagInput('');
  }

  function removeTag(index: number) {
    setInsight((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((_, i) => i !== index),
    }));
  }

  function addContentBlock(type: string) {
    const content = insight.content || [];
    let newBlock: Record<string, unknown> = { type };

    switch (type) {
      case 'paragraph':
        newBlock = { type: 'paragraph', text: '' };
        break;
      case 'heading':
        newBlock = { type: 'heading', text: '' };
        break;
      case 'image':
        newBlock = { type: 'image', url: '', caption: '' };
        break;
      case 'quote':
        newBlock = { type: 'quote', text: '', author: '' };
        break;
    }

    setInsight((prev) => ({
      ...prev,
      content: [...content, newBlock],
    }));
  }

  function updateContentBlock(index: number, updates: Record<string, unknown>) {
    const content = [...(insight.content || [])];
    content[index] = { ...content[index], ...updates };
    setInsight((prev) => ({ ...prev, content }));
  }

  function removeContentBlock(index: number) {
    setInsight((prev) => ({
      ...prev,
      content: (prev.content || []).filter((_, i) => i !== index),
    }));
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse">
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
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/insights')}
            className="p-2 text-neutral-mid hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-display font-semibold">
            {isNew ? 'New Insight' : insight.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={togglePublish}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
              insight.is_published
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-neutral-light text-neutral-mid hover:bg-neutral-light/80'
            }`}
          >
            {insight.is_published ? (
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

      <div className="space-y-8">
        <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
          <h2 className="font-display font-semibold">Basic Information</h2>

          <Input
            label="Title"
            value={insight.title || ''}
            onChange={(e) => {
              const title = e.target.value;
              setInsight((prev) => ({
                ...prev,
                title,
                slug: prev.slug || generateSlug(title),
              }));
            }}
            required
            placeholder="Article title"
          />

          <Input
            label="Slug"
            value={insight.slug || ''}
            onChange={(e) => setInsight((prev) => ({ ...prev, slug: e.target.value }))}
            required
            placeholder="article-slug"
          />

          <Textarea
            label="Excerpt"
            value={insight.excerpt || ''}
            onChange={(e) => setInsight((prev) => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Brief summary for previews"
            rows={3}
          />

          <Input
            label="Featured Image URL"
            value={insight.featured_image || ''}
            onChange={(e) => setInsight((prev) => ({ ...prev, featured_image: e.target.value }))}
            placeholder="https://..."
          />

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="input-field flex-1"
                placeholder="Add tag and press Enter"
              />
              <Button type="button" variant="secondary" onClick={addTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {insight.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-light rounded text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(i)}
                    className="text-neutral-mid hover:text-primary"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Content</h2>
            <div className="flex gap-2">
              <button
                onClick={() => addContentBlock('paragraph')}
                className="text-xs px-3 py-1.5 bg-neutral-light hover:bg-neutral-light/80 rounded transition-colors"
              >
                + Paragraph
              </button>
              <button
                onClick={() => addContentBlock('heading')}
                className="text-xs px-3 py-1.5 bg-neutral-light hover:bg-neutral-light/80 rounded transition-colors"
              >
                + Heading
              </button>
              <button
                onClick={() => addContentBlock('image')}
                className="text-xs px-3 py-1.5 bg-neutral-light hover:bg-neutral-light/80 rounded transition-colors"
              >
                + Image
              </button>
              <button
                onClick={() => addContentBlock('quote')}
                className="text-xs px-3 py-1.5 bg-neutral-light hover:bg-neutral-light/80 rounded transition-colors"
              >
                + Quote
              </button>
            </div>
          </div>

          {insight.content && insight.content.length > 0 ? (
            <div className="space-y-4">
              {insight.content.map((block, index) => (
                <div key={index} className="border border-neutral-light rounded p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-neutral-mid uppercase">
                      {(block as { type: string }).type}
                    </span>
                    <button
                      onClick={() => removeContentBlock(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {(block as { type: string }).type === 'paragraph' && (
                    <Textarea
                      value={String((block as { text?: string }).text || '')}
                      onChange={(e) => updateContentBlock(index, { text: e.target.value })}
                      placeholder="Paragraph text..."
                      rows={4}
                    />
                  )}

                  {(block as { type: string }).type === 'heading' && (
                    <Input
                      value={String((block as { text?: string }).text || '')}
                      onChange={(e) => updateContentBlock(index, { text: e.target.value })}
                      placeholder="Heading text..."
                    />
                  )}

                  {(block as { type: string }).type === 'image' && (
                    <div className="space-y-3">
                      <Input
                        value={String((block as { url?: string }).url || '')}
                        onChange={(e) => updateContentBlock(index, { url: e.target.value })}
                        placeholder="Image URL..."
                      />
                      <Input
                        value={String((block as { caption?: string }).caption || '')}
                        onChange={(e) => updateContentBlock(index, { caption: e.target.value })}
                        placeholder="Caption (optional)"
                      />
                    </div>
                  )}

                  {(block as { type: string }).type === 'quote' && (
                    <div className="space-y-3">
                      <Textarea
                        value={String((block as { text?: string }).text || '')}
                        onChange={(e) => updateContentBlock(index, { text: e.target.value })}
                        placeholder="Quote text..."
                        rows={3}
                      />
                      <Input
                        value={String((block as { author?: string }).author || '')}
                        onChange={(e) => updateContentBlock(index, { author: e.target.value })}
                        placeholder="Author (optional)"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-mid text-center py-8">
              No content blocks yet. Add blocks to build your article.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
