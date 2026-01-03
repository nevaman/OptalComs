import { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Star,
  Palette,
  Code,
  Video,
  PenTool,
  Box,
  Camera,
  Sparkles,
  Megaphone,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { supabase, type TalentOffering, type TalentPricingTier } from '../../lib/supabase';

const iconOptions = [
  { value: 'palette', label: 'Palette', icon: Palette },
  { value: 'pen-tool', label: 'Pen Tool', icon: PenTool },
  { value: 'code', label: 'Code', icon: Code },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'box', label: 'Box', icon: Box },
  { value: 'camera', label: 'Camera', icon: Camera },
  { value: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'megaphone', label: 'Megaphone', icon: Megaphone },
];

export function TalentPageSettings() {
  const [activeTab, setActiveTab] = useState<'offerings' | 'pricing'>('offerings');
  const [offerings, setOfferings] = useState<TalentOffering[]>([]);
  const [pricingTiers, setPricingTiers] = useState<TalentPricingTier[]>([]);
  const [editingOffering, setEditingOffering] = useState<TalentOffering | null>(null);
  const [editingPricing, setEditingPricing] = useState<TalentPricingTier | null>(null);
  const [isAddingOffering, setIsAddingOffering] = useState(false);
  const [isAddingPricing, setIsAddingPricing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTalentContent();
  }, []);

  const loadTalentContent = async () => {
    setIsLoading(true);
    setError(null);
    const [offeringsResult, pricingResult] = await Promise.all([
      supabase.from('talent_offerings').select('*').order('sort_order', { ascending: true }),
      supabase.from('talent_pricing_tiers').select('*').order('sort_order', { ascending: true }),
    ]);

    if (offeringsResult.error) {
      setError('Unable to load talent offerings.');
    } else {
      setOfferings(offeringsResult.data || []);
    }

    if (pricingResult.error) {
      setError(prev => prev || 'Unable to load pricing tiers.');
    } else {
      setPricingTiers(pricingResult.data || []);
    }

    setIsLoading(false);
  };

  const toggleOfferingActive = async (id: string) => {
    const current = offerings.find((o) => o.id === id);
    if (!current) return;
    const { error: updateError, data } = await supabase
      .from('talent_offerings')
      .update({ is_active: !current.is_active })
      .eq('id', id)
      .select()
      .single();

    if (!updateError && data) {
      setOfferings((prev) => prev.map((o) => (o.id === id ? data : o)));
    }
  };

  const togglePricingActive = async (id: string) => {
    const current = pricingTiers.find((p) => p.id === id);
    if (!current) return;
    const { error: updateError, data } = await supabase
      .from('talent_pricing_tiers')
      .update({ is_active: !current.is_active })
      .eq('id', id)
      .select()
      .single();

    if (!updateError && data) {
      setPricingTiers((prev) => prev.map((p) => (p.id === id ? data : p)));
    }
  };

  const togglePricingPopular = async (id: string) => {
    const updates = pricingTiers.map((tier) => ({
      ...tier,
      is_popular: tier.id === id ? !tier.is_popular : false,
    }));

    const updateResults = await Promise.all(
      updates.map((tier) =>
        supabase.from('talent_pricing_tiers').update({ is_popular: tier.is_popular }).eq('id', tier.id),
      ),
    );

    if (!updateResults.some((res) => res.error)) {
      setPricingTiers(updates);
    }
  };

  const deleteOffering = async (id: string) => {
    if (confirm('Are you sure you want to delete this talent offering?')) {
      const { error: deleteError } = await supabase.from('talent_offerings').delete().eq('id', id);
      if (!deleteError) {
        setOfferings((prev) => prev.filter((o) => o.id !== id));
      }
    }
  };

  const deletePricing = async (id: string) => {
    if (confirm('Are you sure you want to delete this pricing tier?')) {
      const { error: deleteError } = await supabase.from('talent_pricing_tiers').delete().eq('id', id);
      if (!deleteError) {
        setPricingTiers((prev) => prev.filter((p) => p.id !== id));
      }
    }
  };

  const moveOffering = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...offerings].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((o) => o.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sorted.length - 1)) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [sorted[index], sorted[swapIndex]] = [sorted[swapIndex], sorted[index]];
    const reordered = sorted.map((item, i) => ({ ...item, sort_order: i + 1 }));

    const updates = [
      supabase.from('talent_offerings').update({ sort_order: reordered[index].sort_order }).eq('id', reordered[index].id),
      supabase.from('talent_offerings').update({ sort_order: reordered[swapIndex].sort_order }).eq('id', reordered[swapIndex].id),
    ];

    const results = await Promise.all(updates);
    if (!results.some((res) => res.error)) {
      setOfferings(reordered);
    }
  };

  const movePricing = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...pricingTiers].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((p) => p.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sorted.length - 1)) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [sorted[index], sorted[swapIndex]] = [sorted[swapIndex], sorted[index]];
    const reordered = sorted.map((item, i) => ({ ...item, sort_order: i + 1 }));

    const updates = [
      supabase.from('talent_pricing_tiers').update({ sort_order: reordered[index].sort_order }).eq('id', reordered[index].id),
      supabase.from('talent_pricing_tiers').update({ sort_order: reordered[swapIndex].sort_order }).eq('id', reordered[swapIndex].id),
    ];

    const results = await Promise.all(updates);
    if (!results.some((res) => res.error)) {
      setPricingTiers(reordered);
    }
  };

  const saveOffering = async (offering: TalentOffering) => {
    const payload = {
      title: offering.title,
      description: offering.description,
      icon: offering.icon,
      skills: offering.skills,
      tools: offering.tools,
      is_active: offering.is_active,
      sort_order: offering.sort_order || offerings.length + 1,
    };

    if (isAddingOffering) {
      const { data, error: insertError } = await supabase
        .from('talent_offerings')
        .insert(payload)
        .select()
        .single();
      if (!insertError && data) {
        setOfferings((prev) => [...prev, data]);
      }
      setIsAddingOffering(false);
    } else {
      const { data, error: updateError } = await supabase
        .from('talent_offerings')
        .update(payload)
        .eq('id', offering.id)
        .select()
        .single();
      if (!updateError && data) {
        setOfferings((prev) => prev.map((o) => (o.id === offering.id ? data : o)));
      }
    }
    setEditingOffering(null);
  };

  const savePricing = async (pricing: TalentPricingTier) => {
    const payload = {
      name: pricing.name,
      description: pricing.description,
      price: pricing.price,
      price_suffix: pricing.price_suffix,
      features: pricing.features,
      is_popular: pricing.is_popular,
      cta_text: pricing.cta_text,
      is_active: pricing.is_active,
      sort_order: pricing.sort_order || pricingTiers.length + 1,
    };

    if (isAddingPricing) {
      const { data, error: insertError } = await supabase
        .from('talent_pricing_tiers')
        .insert(payload)
        .select()
        .single();
      if (!insertError && data) {
        setPricingTiers((prev) => [...prev, data]);
      }
      setIsAddingPricing(false);
    } else {
      const { data, error: updateError } = await supabase
        .from('talent_pricing_tiers')
        .update(payload)
        .eq('id', pricing.id)
        .select()
        .single();
      if (!updateError && data) {
        setPricingTiers((prev) => prev.map((p) => (p.id === pricing.id ? data : p)));
      }
    }
    setEditingPricing(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Talent Page Settings</h1>
        <p className="text-neutral-mid mt-1">Manage talent offerings and pricing displayed on the talent page</p>
      </div>

      {error && (
        <div className="p-3 rounded border border-red-100 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2 border-b border-neutral-light">
        <button
          onClick={() => setActiveTab('offerings')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'offerings'
              ? 'border-orange text-orange'
              : 'border-transparent text-neutral-mid hover:text-primary'
          }`}
        >
          Talent Offerings ({offerings.length})
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pricing'
              ? 'border-orange text-orange'
              : 'border-transparent text-neutral-mid hover:text-primary'
          }`}
        >
          Pricing Tiers ({pricingTiers.length})
        </button>
      </div>

      {isLoading ? (
        <div className="bg-surface rounded border border-neutral-light p-12 text-center text-neutral-mid">
          Loading talent content...
        </div>
      ) : (
        <>
          {activeTab === 'offerings' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setIsAddingOffering(true);
                    setEditingOffering({
                      id: '',
                      title: '',
                      description: '',
                      icon: 'palette',
                      skills: [],
                      tools: [],
                      sort_order: offerings.length + 1,
                      is_active: true,
                      created_at: '',
                      updated_at: '',
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Offering
                </Button>
              </div>

              {(editingOffering || isAddingOffering) && editingOffering && (
                <OfferingEditor
                  offering={editingOffering}
                  onSave={saveOffering}
                  onCancel={() => {
                    setEditingOffering(null);
                    setIsAddingOffering(false);
                  }}
                />
              )}

              <div className="bg-surface rounded border border-neutral-light overflow-hidden">
                {offerings.length > 0 ? (
                  <div className="divide-y divide-neutral-light">
                    {[...offerings].sort((a, b) => a.sort_order - b.sort_order).map((offering, index) => {
                      const IconComponent = iconOptions.find(i => i.value === offering.icon)?.icon || Palette;
                      return (
                        <div
                          key={offering.id}
                          className={`p-4 flex items-center gap-4 ${!offering.is_active ? 'opacity-50' : ''}`}
                        >
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => moveOffering(offering.id, 'up')}
                              disabled={index === 0}
                              className="p-1 text-neutral-mid hover:text-primary disabled:opacity-30"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveOffering(offering.id, 'down')}
                              disabled={index === offerings.length - 1}
                              className="p-1 text-neutral-mid hover:text-primary disabled:opacity-30"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-orange" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium">{offering.title}</h3>
                            <p className="text-sm text-neutral-mid truncate">{offering.description || 'No description'}</p>
                            <div className="flex gap-2 mt-2">
                              {offering.tools.slice(0, 4).map((tool, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 bg-neutral-light/50 rounded">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleOfferingActive(offering.id)}
                              className={`p-2 rounded transition-colors ${
                                offering.is_active ? 'text-green-600 hover:bg-green-50' : 'text-neutral-mid hover:bg-neutral-light/50'
                              }`}
                              title={offering.is_active ? 'Hide offering' : 'Show offering'}
                            >
                              {offering.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setEditingOffering(offering)}
                              className="p-2 text-neutral-mid hover:text-primary hover:bg-neutral-light/50 rounded transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteOffering(offering.id)}
                              className="p-2 text-neutral-mid hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center text-neutral-mid">
                    No talent offerings yet. Add one to get started.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setIsAddingPricing(true);
                    setEditingPricing({
                      id: '',
                      name: '',
                      description: '',
                      price: 0,
                      price_suffix: '/month',
                      features: [],
                      is_popular: false,
                      cta_text: 'Get Started',
                      sort_order: pricingTiers.length + 1,
                      is_active: true,
                      created_at: '',
                      updated_at: '',
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pricing Tier
                </Button>
              </div>

              {(editingPricing || isAddingPricing) && editingPricing && (
                <PricingEditor
                  pricing={editingPricing}
                  onSave={savePricing}
                  onCancel={() => {
                    setEditingPricing(null);
                    setIsAddingPricing(false);
                  }}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...pricingTiers].sort((a, b) => a.sort_order - b.sort_order).map((tier, index) => (
                  <div
                    key={tier.id}
                    className={`bg-surface rounded border p-6 relative ${
                      tier.is_popular ? 'border-orange' : 'border-neutral-light'
                    } ${!tier.is_active ? 'opacity-50' : ''}`}
                  >
                    {tier.is_popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange text-surface text-xs font-bold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-display font-bold text-lg">{tier.name}</h3>
                        <p className="text-sm text-neutral-mid">{tier.description || 'No description'}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => movePricing(tier.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-neutral-mid hover:text-primary disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => movePricing(tier.id, 'down')}
                          disabled={index === pricingTiers.length - 1}
                          className="p-1 text-neutral-mid hover:text-primary disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      {tier.price > 0 ? (
                        <span className="text-3xl font-display font-bold">${tier.price.toLocaleString()}{tier.price_suffix}</span>
                      ) : (
                        <span className="text-xl font-display font-bold">Custom</span>
                      )}
                    </div>

                    <ul className="space-y-2 mb-6 text-sm">
                      {tier.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="text-neutral-mid truncate">• {feature}</li>
                      ))}
                      {tier.features.length > 4 && (
                        <li className="text-neutral-mid">+{tier.features.length - 4} more</li>
                      )}
                    </ul>

                    <div className="flex gap-2 pt-4 border-t border-neutral-light">
                      <button
                        onClick={() => togglePricingPopular(tier.id)}
                        className={`p-2 rounded transition-colors ${
                          tier.is_popular ? 'text-orange bg-orange/10' : 'text-neutral-mid hover:bg-neutral-light/50'
                        }`}
                        title={tier.is_popular ? 'Remove popular badge' : 'Mark as popular'}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => togglePricingActive(tier.id)}
                        className={`p-2 rounded transition-colors ${
                          tier.is_active ? 'text-green-600 hover:bg-green-50' : 'text-neutral-mid hover:bg-neutral-light/50'
                        }`}
                        title={tier.is_active ? 'Hide tier' : 'Show tier'}
                      >
                        {tier.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingPricing(tier)}
                        className="p-2 text-neutral-mid hover:text-primary hover:bg-neutral-light/50 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePricing(tier.id)}
                        className="p-2 text-neutral-mid hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OfferingEditor({
  offering,
  onSave,
  onCancel,
}: {
  offering: TalentOffering;
  onSave: (offering: TalentOffering) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<TalentOffering>({
    ...offering,
    description: offering.description || '',
    skills: offering.skills || [],
    tools: offering.tools || [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [toolInput, setToolInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim()) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const addTool = () => {
    if (toolInput.trim()) {
      setForm({ ...form, tools: [...form.tools, toolInput.trim()] });
      setToolInput('');
    }
  };

  return (
    <div className="bg-surface rounded border border-orange/30 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold">{offering.id ? 'Edit Offering' : 'Add New Offering'}</h3>
        <button onClick={onCancel} className="p-2 text-neutral-mid hover:text-primary">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
            placeholder="e.g., Graphic Designers"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Icon</label>
          <select
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
          >
            {iconOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none resize-none"
          placeholder="Brief description of this talent category..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className="flex-1 px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              placeholder="Add a skill..."
            />
            <button onClick={addSkill} className="px-3 py-2 bg-neutral-light rounded hover:bg-neutral-light/70">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-neutral-light rounded">
                {skill}
                <button onClick={() => setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tools</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
              className="flex-1 px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
              placeholder="Add a tool..."
            />
            <button onClick={addTool} className="px-3 py-2 bg-neutral-light rounded hover:bg-neutral-light/70">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tools.map((tool, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-orange/10 text-orange rounded">
                {tool}
                <button onClick={() => setForm({ ...form, tools: form.tools.filter((_, idx) => idx !== i) })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(form)}>
          <Save className="w-4 h-4 mr-2" />
          Save Offering
        </Button>
      </div>
    </div>
  );
}

function PricingEditor({
  pricing,
  onSave,
  onCancel,
}: {
  pricing: TalentPricingTier;
  onSave: (pricing: TalentPricingTier) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<TalentPricingTier>({
    ...pricing,
    description: pricing.description || '',
    features: pricing.features || [],
  });
  const [featureInput, setFeatureInput] = useState('');

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  return (
    <div className="bg-surface rounded border border-orange/30 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold">{pricing.id ? 'Edit Pricing Tier' : 'Add New Pricing Tier'}</h3>
        <button onClick={onCancel} className="p-2 text-neutral-mid hover:text-primary">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
            placeholder="e.g., Professional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CTA Button Text</label>
          <input
            type="text"
            value={form.cta_text}
            onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
            placeholder="e.g., Get Started"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
          placeholder="Brief description..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price (0 for custom/contact)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
            placeholder="e.g., 3500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price Suffix</label>
          <input
            type="text"
            value={form.price_suffix}
            onChange={(e) => setForm({ ...form, price_suffix: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
            placeholder="e.g., /month"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Features</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            className="flex-1 px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
            placeholder="Add a feature..."
          />
          <button onClick={addFeature} className="px-3 py-2 bg-neutral-light rounded hover:bg-neutral-light/70">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {form.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm p-2 bg-neutral-light/30 rounded">
              <span className="flex-1">{feature}</span>
              <button onClick={() => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) })}>
                <X className="w-4 h-4 text-neutral-mid hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_popular}
            onChange={(e) => setForm({ ...form, is_popular: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Mark as popular</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Active</span>
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(form)}>
          <Save className="w-4 h-4 mr-2" />
          Save Pricing Tier
        </Button>
      </div>
    </div>
  );
}
