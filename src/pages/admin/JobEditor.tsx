import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, X, Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

interface JobData {
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  location: string;
  deadline: string;
  status: 'draft' | 'open' | 'closed';
  external_link: string;
  is_featured: boolean;
  company: string;
  employment_type: string;
  experience_level: string;
  salary_range: string;
  benefits: string[];
  is_internal: boolean;
  category: string;
}

const employmentTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead / Director' },
];

const categories = [
  'Design',
  'Engineering',
  'Marketing',
  'Strategy',
  'Operations',
  'Finance',
  'Sales',
  'Other',
];

export function JobEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [requirementInput, setRequirementInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

  const [job, setJob] = useState<JobData>({
    title: '',
    slug: '',
    description: '',
    requirements: [],
    location: '',
    deadline: '',
    status: 'draft',
    external_link: '',
    is_featured: false,
    company: 'Optal Creative',
    employment_type: 'full-time',
    experience_level: 'mid',
    salary_range: '',
    benefits: [],
    is_internal: true,
    category: 'Design',
  });

  useEffect(() => {
    if (!isNew && id) {
      fetchJob();
    }
  }, [id, isNew]);

  async function fetchJob() {
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
    setJob({
      title: data.title,
      slug: data.slug,
      description: data.description,
      requirements: data.requirements || [],
      location: data.location || '',
      deadline: data.deadline ? data.deadline.split('T')[0] : '',
      status: data.status,
      external_link: data.external_link || '',
      is_featured: data.is_featured,
      company: (metadata.company as string) || 'Optal Creative',
      employment_type: (metadata.employment_type as string) || 'full-time',
      experience_level: (metadata.experience_level as string) || 'mid',
      salary_range: (metadata.salary_range as string) || '',
      benefits: (metadata.benefits as string[]) || [],
      is_internal: metadata.is_internal !== false,
      category: (metadata.category as string) || 'Design',
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
    if (!job.title.trim()) {
      alert('Please enter a job title');
      return;
    }

    setIsSaving(true);

    const opportunityData = {
      type: 'job',
      title: job.title,
      slug: job.slug || generateSlug(job.title),
      description: job.description,
      requirements: job.requirements,
      location: job.location || null,
      deadline: job.deadline ? new Date(job.deadline).toISOString() : null,
      status: job.status,
      external_link: job.is_internal ? null : job.external_link || null,
      is_featured: job.is_featured,
      metadata: {
        company: job.company,
        employment_type: job.employment_type,
        experience_level: job.experience_level,
        salary_range: job.salary_range,
        benefits: job.benefits,
        is_internal: job.is_internal,
        category: job.category,
      },
    };

    if (isNew) {
      const { error } = await supabase.from('opportunities').insert([opportunityData]);
      if (error) {
        alert('Error creating job: ' + error.message);
        setIsSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from('opportunities')
        .update(opportunityData)
        .eq('id', id);
      if (error) {
        alert('Error updating job: ' + error.message);
        setIsSaving(false);
        return;
      }
    }

    setIsSaving(false);
    navigate('/admin/opportunities');
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this job listing?')) return;

    const { error } = await supabase.from('opportunities').delete().eq('id', id);
    if (!error) {
      navigate('/admin/opportunities');
    }
  }

  function addRequirement() {
    if (!requirementInput.trim()) return;
    setJob((prev) => ({
      ...prev,
      requirements: [...prev.requirements, requirementInput.trim()],
    }));
    setRequirementInput('');
  }

  function removeRequirement(index: number) {
    setJob((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  }

  function addBenefit() {
    if (!benefitInput.trim()) return;
    setJob((prev) => ({
      ...prev,
      benefits: [...prev.benefits, benefitInput.trim()],
    }));
    setBenefitInput('');
  }

  function removeBenefit(index: number) {
    setJob((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
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
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">
                {isNew ? 'New Job Listing' : 'Edit Job Listing'}
              </h1>
              <p className="text-sm text-neutral-mid">Career opportunity</p>
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
            {isNew ? 'Create Job' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-surface rounded-lg border border-neutral-light p-6">
          <h2 className="font-display font-semibold mb-6">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Job Title *</label>
              <input
                type="text"
                value={job.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setJob((prev) => ({
                    ...prev,
                    title,
                    slug: isNew ? generateSlug(title) : prev.slug,
                  }));
                }}
                placeholder="e.g. Senior UI/UX Designer"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL Slug</label>
              <input
                type="text"
                value={job.slug}
                onChange={(e) => setJob((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="senior-ui-ux-designer"
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={job.category}
                onChange={(e) => setJob((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none bg-surface"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={job.description}
                onChange={(e) => setJob((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Describe the role, responsibilities, and what makes it exciting..."
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-neutral-light p-6">
          <h2 className="font-display font-semibold mb-6">Company & Position Details</h2>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-neutral-light/30 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={job.is_internal}
                  onChange={() => setJob((prev) => ({ ...prev, is_internal: true, company: 'Optal Creative' }))}
                  className="w-4 h-4 text-orange"
                />
                <span className="text-sm font-medium">Internal Position (Our Team)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={!job.is_internal}
                  onChange={() => setJob((prev) => ({ ...prev, is_internal: false }))}
                  className="w-4 h-4 text-orange"
                />
                <span className="text-sm font-medium">External / Partner Company</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  value={job.company}
                  onChange={(e) => setJob((prev) => ({ ...prev, company: e.target.value }))}
                  disabled={job.is_internal}
                  placeholder="Company name"
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none disabled:bg-neutral-light/30 disabled:text-neutral-mid"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={job.location}
                  onChange={(e) => setJob((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. Remote, New York, Addis Ababa"
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Employment Type</label>
                <select
                  value={job.employment_type}
                  onChange={(e) => setJob((prev) => ({ ...prev, employment_type: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none bg-surface"
                >
                  {employmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Experience Level</label>
                <select
                  value={job.experience_level}
                  onChange={(e) => setJob((prev) => ({ ...prev, experience_level: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none bg-surface"
                >
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Salary Range</label>
                <input
                  type="text"
                  value={job.salary_range}
                  onChange={(e) => setJob((prev) => ({ ...prev, salary_range: e.target.value }))}
                  placeholder="e.g. $80k - $120k"
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Application Deadline</label>
                <input
                  type="date"
                  value={job.deadline}
                  onChange={(e) => setJob((prev) => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
              </div>
            </div>

            {!job.is_internal && (
              <div>
                <label className="block text-sm font-medium mb-2">External Application Link</label>
                <input
                  type="url"
                  value={job.external_link}
                  onChange={(e) => setJob((prev) => ({ ...prev, external_link: e.target.value }))}
                  placeholder="https://company.com/careers/apply"
                  className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                />
                <p className="text-xs text-neutral-mid mt-1">Applicants will be redirected to this URL</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-neutral-light p-6">
          <h2 className="font-display font-semibold mb-6">Requirements</h2>
          <p className="text-sm text-neutral-mid mb-4">List what candidates need to have</p>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={requirementInput}
              onChange={(e) => setRequirementInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              placeholder="e.g. 5+ years of experience in UI/UX design"
              className="flex-1 px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
            />
            <Button variant="secondary" onClick={addRequirement}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {job.requirements.length > 0 ? (
            <ul className="space-y-2">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-center justify-between p-3 bg-neutral-light/30 rounded-lg group">
                  <span className="text-sm">{req}</span>
                  <button
                    onClick={() => removeRequirement(i)}
                    className="p-1 text-neutral-mid hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-mid text-center py-4">No requirements added yet</p>
          )}
        </div>

        <div className="bg-surface rounded-lg border border-neutral-light p-6">
          <h2 className="font-display font-semibold mb-6">Benefits</h2>
          <p className="text-sm text-neutral-mid mb-4">What perks come with this position</p>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              placeholder="e.g. Remote work, Health insurance, Learning budget"
              className="flex-1 px-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
            />
            <Button variant="secondary" onClick={addBenefit}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {job.benefits.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((benefit, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-light/50 rounded-full text-sm group"
                >
                  {benefit}
                  <button
                    onClick={() => removeBenefit(i)}
                    className="text-neutral-mid hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-mid text-center py-4">No benefits added yet</p>
          )}
        </div>

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
                      job.status === status
                        ? 'border-orange bg-orange/5'
                        : 'border-neutral-light hover:border-neutral-mid'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={job.status === status}
                      onChange={() => setJob((prev) => ({ ...prev, status }))}
                      className="sr-only"
                    />
                    <span className="font-medium capitalize">{status}</span>
                    <p className="text-xs text-neutral-mid mt-1">
                      {status === 'draft' && 'Hidden from public'}
                      {status === 'open' && 'Visible and accepting applications'}
                      {status === 'closed' && 'No longer accepting applications'}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 border border-neutral-light rounded-lg cursor-pointer hover:bg-neutral-light/20 transition-colors">
              <input
                type="checkbox"
                checked={job.is_featured}
                onChange={(e) => setJob((prev) => ({ ...prev, is_featured: e.target.checked }))}
                className="w-5 h-5 text-orange rounded"
              />
              <div>
                <span className="font-medium">Featured Listing</span>
                <p className="text-sm text-neutral-mid">Highlight this job at the top of the careers page</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
