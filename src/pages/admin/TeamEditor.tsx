import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase, TeamMember } from '../../lib/supabase';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function TeamEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const [member, setMember] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    bio: '',
    photo_url: '',
    linkedin_url: '',
    twitter_url: '',
    email: '',
    is_visible: true,
    sort_order: 0,
  });

  useEffect(() => {
    if (id) {
      fetchMember();
    }
  }, [id]);

  async function fetchMember() {
    const { data } = await supabase.from('team_members').select('*').eq('id', id).maybeSingle();

    if (data) {
      setMember(data);
    }
    setIsLoading(false);
  }

  async function handleSave() {
    if (!member.name || !member.role) {
      alert('Name and role are required');
      return;
    }

    setIsSaving(true);

    if (isNew) {
      const { data: existing } = await supabase
        .from('team_members')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1);

      const maxOrder = existing?.[0]?.sort_order ?? -1;

      const { data, error } = await supabase
        .from('team_members')
        .insert([{ ...member, sort_order: maxOrder + 1 }])
        .select()
        .single();

      if (error) {
        alert('Error creating member: ' + error.message);
        setIsSaving(false);
        return;
      }

      navigate(`/admin/team/${data.id}`);
    } else {
      const { error } = await supabase.from('team_members').update(member).eq('id', id);

      if (error) {
        alert('Error saving member: ' + error.message);
      }
    }

    setIsSaving(false);
  }

  function toggleVisibility() {
    setMember((prev) => ({ ...prev, is_visible: !prev.is_visible }));
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse">
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
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/team')}
            className="p-2 text-neutral-mid hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-display font-semibold">
            {isNew ? 'New Team Member' : member.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleVisibility}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
              member.is_visible
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-neutral-light text-neutral-mid hover:bg-neutral-light/80'
            }`}
          >
            {member.is_visible ? (
              <>
                <Eye className="w-4 h-4" />
                Visible
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                Hidden
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
            label="Name"
            value={member.name || ''}
            onChange={(e) => setMember((prev) => ({ ...prev, name: e.target.value }))}
            required
            placeholder="Full name"
          />

          <Input
            label="Role"
            value={member.role || ''}
            onChange={(e) => setMember((prev) => ({ ...prev, role: e.target.value }))}
            required
            placeholder="Job title or role"
          />

          <Textarea
            label="Bio"
            value={member.bio || ''}
            onChange={(e) => setMember((prev) => ({ ...prev, bio: e.target.value }))}
            placeholder="Short biography"
            rows={4}
          />

          <Input
            label="Photo URL"
            value={member.photo_url || ''}
            onChange={(e) => setMember((prev) => ({ ...prev, photo_url: e.target.value }))}
            placeholder="https://..."
          />
        </div>

        <div className="bg-surface p-6 rounded border border-neutral-light space-y-6">
          <h2 className="font-display font-semibold">Contact & Social</h2>

          <Input
            label="Email"
            type="email"
            value={member.email || ''}
            onChange={(e) => setMember((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="email@example.com"
          />

          <Input
            label="LinkedIn URL"
            value={member.linkedin_url || ''}
            onChange={(e) => setMember((prev) => ({ ...prev, linkedin_url: e.target.value }))}
            placeholder="https://linkedin.com/in/..."
          />

          <Input
            label="Twitter URL"
            value={member.twitter_url || ''}
            onChange={(e) => setMember((prev) => ({ ...prev, twitter_url: e.target.value }))}
            placeholder="https://twitter.com/..."
          />
        </div>

        {member.photo_url && (
          <div className="bg-surface p-6 rounded border border-neutral-light">
            <h2 className="font-display font-semibold mb-4">Preview</h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-neutral-light rounded-full overflow-hidden">
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-display font-semibold">{member.name || 'Name'}</p>
                <p className="text-sm text-orange">{member.role || 'Role'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
