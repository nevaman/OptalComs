import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, Plus, X } from 'lucide-react';
import { supabase, Career } from '../../lib/supabase';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function CareerEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  
  // Array inputs
  const [reqInput, setReqInput] = useState('');
  const [benInput, setBenInput] = useState('');

  const [career, setCareer] = useState<Partial<Career>>({
    title: '',
    company: 'Optal Creative',
    location: 'Remote',
    type: 'full-time',
    experience_level: 'mid',
    salary_range: '',
    description: '',
    requirements: [],
    benefits: [],
    is_internal: true,
    category: 'Design',
    is_featured: false,
  });

  useEffect(() => {
    if (id) {
      fetchCareer();
    }
  }, [id]);

  async function fetchCareer() {
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      setCareer(data);
    }
    setIsLoading(false);
  }

  async function handleSave() {
    if (!career.title || !career.company) {
      alert('Title and company are required');
      return;
    }

    setIsSaving(true);
    
    const dataToSave = { ...career };

    if (isNew) {
      const { error } = await supabase.from('careers').insert([dataToSave]);
      if (error) {
        alert('Error creating career: ' + error.message);
      } else {
        navigate('/admin/opportunities');
      }
    } else {
      const { error } = await supabase
        .from('careers')
        .update(dataToSave)
        .eq('id', id);
      
      if (error) {
        alert('Error updating career: ' + error.message);
      } else {
        navigate('/admin/opportunities');
      }
    }
    setIsSaving(false);
  }

  function addItem(
    input: string, 
    setInput: (s: string) => void, 
    list: string[] | undefined, 
    field: keyof Career
  ) {
    if (!input.trim()) return;
    const currentList = (list || []) as string[];
    setCareer(prev => ({ ...prev, [field]: [...currentList, input.trim()] }));
    setInput('');
  }

  function removeItem(index: number, list: string[] | undefined, field: keyof Career) {
    const currentList = (list || []) as string[];
    setCareer(prev => ({
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
            {isNew ? 'New Career' : 'Edit Career'}
          </h1>
        </div>
        <div className="flex gap-3">
          {!isNew && (
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete this career?')) {
                  const { error } = await supabase.from('careers').delete().eq('id', id);
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
            Save Career
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
            <h2 className="font-display font-semibold">Details</h2>
            
            <Input
              label="Title"
              value={career.title || ''}
              onChange={(e) => setCareer(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="e.g. Senior Brand Designer"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Company"
                value={career.company || ''}
                onChange={(e) => setCareer(prev => ({ ...prev, company: e.target.value }))}
                required
              />
               <Input
                label="Location"
                value={career.location || ''}
                onChange={(e) => setCareer(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>

            <Textarea
              label="Description"
              value={career.description || ''}
              onChange={(e) => setCareer(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={6}
            />

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium mb-2">Requirements</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={reqInput}
                  onChange={(e) => setReqInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(reqInput, setReqInput, career.requirements, 'requirements'))}
                  placeholder="Add a requirement..."
                  className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                />
                <Button type="button" variant="secondary" onClick={() => addItem(reqInput, setReqInput, career.requirements, 'requirements')}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {career.requirements?.map((req, i) => (
                  <li key={i} className="flex items-center justify-between p-3 bg-neutral-light/30 rounded text-sm">
                    {req}
                    <button onClick={() => removeItem(i, career.requirements, 'requirements')} className="text-neutral-mid hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium mb-2">Benefits</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={benInput}
                  onChange={(e) => setBenInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(benInput, setBenInput, career.benefits, 'benefits'))}
                  placeholder="Add a benefit..."
                  className="w-full px-3 py-2 border border-neutral-light rounded focus:border-orange focus:outline-none"
                />
                <Button type="button" variant="secondary" onClick={() => addItem(benInput, setBenInput, career.benefits, 'benefits')}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {career.benefits?.map((ben, i) => (
                  <li key={i} className="flex items-center justify-between p-3 bg-neutral-light/30 rounded text-sm">
                    {ben}
                    <button onClick={() => removeItem(i, career.benefits, 'benefits')} className="text-neutral-mid hover:text-red-500">
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
              value={career.type || 'full-time'}
              onChange={(e) => setCareer(prev => ({ ...prev, type: e.target.value }))}
              options={[
                { value: 'full-time', label: 'Full-time' },
                { value: 'part-time', label: 'Part-time' },
                { value: 'contract', label: 'Contract' },
                { value: 'freelance', label: 'Freelance' },
              ]}
            />

            <Select
              label="Experience Level"
              value={career.experience_level || 'mid'}
              onChange={(e) => setCareer(prev => ({ ...prev, experience_level: e.target.value }))}
              options={[
                { value: 'entry', label: 'Entry Level' },
                { value: 'mid', label: 'Mid Level' },
                { value: 'senior', label: 'Senior' },
                { value: 'lead', label: 'Lead / Director' },
              ]}
            />

            <Input
              label="Salary Range"
              value={career.salary_range || ''}
              onChange={(e) => setCareer(prev => ({ ...prev, salary_range: e.target.value }))}
              placeholder="e.g. $90k - $120k"
            />
            
            <Input
              label="Category"
              value={career.category || ''}
              onChange={(e) => setCareer(prev => ({ ...prev, category: e.target.value }))}
            />

            <div className="flex items-center gap-2">
               <input
                 type="checkbox"
                 checked={career.is_internal || false}
                 onChange={(e) => setCareer(prev => ({ ...prev, is_internal: e.target.checked }))}
               />
               <label>Internal Position</label>
            </div>
            
            {!career.is_internal && (
              <Input
                label="External Link"
                value={career.external_link || ''}
                onChange={(e) => setCareer(prev => ({ ...prev, external_link: e.target.value }))}
              />
            )}

            <div className="flex items-center gap-2">
               <input
                 type="checkbox"
                 checked={career.is_featured || false}
                 onChange={(e) => setCareer(prev => ({ ...prev, is_featured: e.target.checked }))}
               />
               <label>Featured</label>
            </div>

            <Input
              label="Deadline (Optional)"
              type="date"
              value={career.deadline ? new Date(career.deadline).toISOString().split('T')[0] : ''}
              onChange={(e) => setCareer(prev => ({ ...prev, deadline: e.target.value }))}
            />

          </div>
        </div>
      </div>
    </div>
  );
}

