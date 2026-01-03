import { useState } from 'react';
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

interface TalentOffering {
  id: string;
  title: string;
  description: string;
  icon: string;
  skills: string[];
  tools: string[];
  order: number;
  is_active: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  price_suffix: string;
  features: string[];
  is_popular: boolean;
  cta_text: string;
  order: number;
  is_active: boolean;
}

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

const mockTalentOfferings: TalentOffering[] = [
  {
    id: '1',
    title: 'Graphic Designers',
    description: 'Expert visual designers who create stunning brand assets, marketing materials, and digital graphics.',
    icon: 'palette',
    skills: ['Brand Design', 'Print Design', 'Digital Graphics', 'Layout Design'],
    tools: ['Figma', 'Photoshop', 'Illustrator', 'InDesign'],
    order: 1,
    is_active: true,
  },
  {
    id: '2',
    title: 'UI/UX Designers',
    description: 'User-centered designers who craft intuitive interfaces and seamless digital experiences.',
    icon: 'pen-tool',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    tools: ['Figma', 'Sketch', 'Adobe XD', 'Framer'],
    order: 2,
    is_active: true,
  },
  {
    id: '3',
    title: 'Motion Designers',
    description: 'Creative animators who bring brands to life through captivating motion graphics and animations.',
    icon: 'sparkles',
    skills: ['2D Animation', '3D Animation', 'Motion Graphics', 'Visual Effects'],
    tools: ['After Effects', 'Cinema 4D', 'Blender', 'Premiere Pro'],
    order: 3,
    is_active: true,
  },
  {
    id: '4',
    title: 'Video Editors',
    description: 'Skilled editors who transform raw footage into polished, engaging video content.',
    icon: 'video',
    skills: ['Video Editing', 'Color Grading', 'Sound Design', 'Storytelling'],
    tools: ['Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'After Effects'],
    order: 4,
    is_active: true,
  },
  {
    id: '5',
    title: 'Frontend Developers',
    description: 'Technical experts who build responsive, performant, and accessible web interfaces.',
    icon: 'code',
    skills: ['React', 'TypeScript', 'CSS/Tailwind', 'Performance'],
    tools: ['VS Code', 'Git', 'Figma', 'Chrome DevTools'],
    order: 5,
    is_active: true,
  },
  {
    id: '6',
    title: 'Full Stack Developers',
    description: 'Versatile engineers who handle both frontend and backend development with expertise.',
    icon: 'box',
    skills: ['Frontend', 'Backend', 'Databases', 'DevOps'],
    tools: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    order: 6,
    is_active: true,
  },
];

const mockPricingTiers: PricingTier[] = [
  {
    id: '1',
    name: 'Starter',
    description: 'Perfect for small teams getting started with offshore talent.',
    price: 2000,
    price_suffix: '/month',
    features: [
      'Part-time dedicated talent (20 hrs/week)',
      'Pre-vetted professionals',
      'Basic project management',
      'Weekly check-ins',
      'Email support',
    ],
    is_popular: false,
    cta_text: 'Get Started',
    order: 1,
    is_active: true,
  },
  {
    id: '2',
    name: 'Professional',
    description: 'Full-time embedded talent for growing teams.',
    price: 3500,
    price_suffix: '/month',
    features: [
      'Full-time dedicated talent (40 hrs/week)',
      'Top 3% pre-vetted professionals',
      'Dedicated account manager',
      'Performance tracking & reporting',
      'Slack/Teams integration',
      'Priority support',
    ],
    is_popular: true,
    cta_text: 'Start Hiring',
    order: 2,
    is_active: true,
  },
  {
    id: '3',
    name: 'Enterprise',
    description: 'Custom solutions for scaling organizations.',
    price: 0,
    price_suffix: '',
    features: [
      'Multiple dedicated team members',
      'Custom vetting requirements',
      'Dedicated success team',
      'Custom integrations',
      'SLA guarantees',
      'Quarterly business reviews',
      'Volume discounts',
    ],
    is_popular: false,
    cta_text: 'Contact Sales',
    order: 3,
    is_active: true,
  },
];

export function TalentPageSettings() {
  const [activeTab, setActiveTab] = useState<'offerings' | 'pricing'>('offerings');
  const [offerings, setOfferings] = useState<TalentOffering[]>(mockTalentOfferings);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(mockPricingTiers);
  const [editingOffering, setEditingOffering] = useState<TalentOffering | null>(null);
  const [editingPricing, setEditingPricing] = useState<PricingTier | null>(null);
  const [isAddingOffering, setIsAddingOffering] = useState(false);
  const [isAddingPricing, setIsAddingPricing] = useState(false);

  const toggleOfferingActive = (id: string) => {
    setOfferings(prev => prev.map(o => o.id === id ? { ...o, is_active: !o.is_active } : o));
  };

  const togglePricingActive = (id: string) => {
    setPricingTiers(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
  };

  const togglePricingPopular = (id: string) => {
    setPricingTiers(prev => prev.map(p => ({
      ...p,
      is_popular: p.id === id ? !p.is_popular : false,
    })));
  };

  const deleteOffering = (id: string) => {
    if (confirm('Are you sure you want to delete this talent offering?')) {
      setOfferings(prev => prev.filter(o => o.id !== id));
    }
  };

  const deletePricing = (id: string) => {
    if (confirm('Are you sure you want to delete this pricing tier?')) {
      setPricingTiers(prev => prev.filter(p => p.id !== id));
    }
  };

  const moveOffering = (id: string, direction: 'up' | 'down') => {
    const index = offerings.findIndex(o => o.id === id);
    if (direction === 'up' && index > 0) {
      const newOfferings = [...offerings];
      [newOfferings[index - 1], newOfferings[index]] = [newOfferings[index], newOfferings[index - 1]];
      newOfferings.forEach((o, i) => o.order = i + 1);
      setOfferings(newOfferings);
    } else if (direction === 'down' && index < offerings.length - 1) {
      const newOfferings = [...offerings];
      [newOfferings[index], newOfferings[index + 1]] = [newOfferings[index + 1], newOfferings[index]];
      newOfferings.forEach((o, i) => o.order = i + 1);
      setOfferings(newOfferings);
    }
  };

  const movePricing = (id: string, direction: 'up' | 'down') => {
    const index = pricingTiers.findIndex(p => p.id === id);
    if (direction === 'up' && index > 0) {
      const newPricing = [...pricingTiers];
      [newPricing[index - 1], newPricing[index]] = [newPricing[index], newPricing[index - 1]];
      newPricing.forEach((p, i) => p.order = i + 1);
      setPricingTiers(newPricing);
    } else if (direction === 'down' && index < pricingTiers.length - 1) {
      const newPricing = [...pricingTiers];
      [newPricing[index], newPricing[index + 1]] = [newPricing[index + 1], newPricing[index]];
      newPricing.forEach((p, i) => p.order = i + 1);
      setPricingTiers(newPricing);
    }
  };

  const saveOffering = (offering: TalentOffering) => {
    if (isAddingOffering) {
      setOfferings(prev => [...prev, { ...offering, id: Date.now().toString(), order: prev.length + 1 }]);
      setIsAddingOffering(false);
    } else {
      setOfferings(prev => prev.map(o => o.id === offering.id ? offering : o));
    }
    setEditingOffering(null);
  };

  const savePricing = (pricing: PricingTier) => {
    if (isAddingPricing) {
      setPricingTiers(prev => [...prev, { ...pricing, id: Date.now().toString(), order: prev.length + 1 }]);
      setIsAddingPricing(false);
    } else {
      setPricingTiers(prev => prev.map(p => p.id === pricing.id ? pricing : p));
    }
    setEditingPricing(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Talent Page Settings</h1>
        <p className="text-neutral-mid mt-1">Manage talent offerings and pricing displayed on the talent page</p>
      </div>

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
                  order: offerings.length + 1,
                  is_active: true,
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Offering
            </Button>
          </div>

          {(editingOffering || isAddingOffering) && (
            <OfferingEditor
              offering={editingOffering!}
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
                {offerings.sort((a, b) => a.order - b.order).map((offering, index) => {
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
                        <p className="text-sm text-neutral-mid truncate">{offering.description}</p>
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
                  order: pricingTiers.length + 1,
                  is_active: true,
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Pricing Tier
            </Button>
          </div>

          {(editingPricing || isAddingPricing) && (
            <PricingEditor
              pricing={editingPricing!}
              onSave={savePricing}
              onCancel={() => {
                setEditingPricing(null);
                setIsAddingPricing(false);
              }}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingTiers.sort((a, b) => a.order - b.order).map((tier, index) => (
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
                    <p className="text-sm text-neutral-mid">{tier.description}</p>
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
  const [form, setForm] = useState(offering);
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
  pricing: PricingTier;
  onSave: (pricing: PricingTier) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(pricing);
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
