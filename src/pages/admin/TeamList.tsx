import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, EyeOff, Trash2, MoreVertical, GripVertical } from 'lucide-react';
import { supabase, TeamMember } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

export function TeamList() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .order('sort_order', { ascending: true });

    if (data) {
      setMembers(data);
    }
    setIsLoading(false);
  }

  async function toggleVisibility(member: TeamMember) {
    const { error } = await supabase
      .from('team_members')
      .update({ is_visible: !member.is_visible })
      .eq('id', member.id);

    if (!error) {
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, is_visible: !m.is_visible } : m))
      );
    }
    setOpenMenu(null);
  }

  async function deleteMember(member: TeamMember) {
    if (!confirm(`Are you sure you want to delete "${member.name}"?`)) {
      return;
    }

    const { error } = await supabase.from('team_members').delete().eq('id', member.id);

    if (!error) {
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    }
    setOpenMenu(null);
  }

  async function updateOrder(dragIndex: number, dropIndex: number) {
    const newMembers = [...members];
    const [removed] = newMembers.splice(dragIndex, 1);
    newMembers.splice(dropIndex, 0, removed);

    setMembers(newMembers);

    for (let i = 0; i < newMembers.length; i++) {
      await supabase.from('team_members').update({ sort_order: i }).eq('id', newMembers[i].id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Team Members</h1>
          <p className="text-neutral-mid mt-1">Manage your team profiles</p>
        </div>
        <Button href="/admin/team/new" variant="primary" icon>
          <Plus className="w-4 h-4 mr-2" />
          New Member
        </Button>
      </div>

      <div className="bg-surface rounded border border-neutral-light">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-neutral-light rounded" />
              ))}
            </div>
          </div>
        ) : members.length > 0 ? (
          <div className="divide-y divide-neutral-light">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 hover:bg-neutral-light/20 transition-colors"
              >
                <Link
                  to={`/admin/team/${member.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <GripVertical className="w-4 h-4 text-neutral-mid cursor-move shrink-0" />
                  <div className="w-12 h-12 bg-neutral-light rounded-full overflow-hidden shrink-0">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-mid font-display text-lg">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{member.name}</p>
                    <p className="text-sm text-orange">{member.role}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      member.is_visible
                        ? 'bg-green-100 text-green-700'
                        : 'bg-neutral-light text-neutral-mid'
                    }`}
                  >
                    {member.is_visible ? 'Visible' : 'Hidden'}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                      className="p-2 text-neutral-mid hover:text-primary transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenu === member.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenu(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 bg-surface border border-neutral-light rounded shadow-lg z-20 min-w-[160px]">
                          <button
                            onClick={() => toggleVisibility(member)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-neutral-light/50 transition-colors"
                          >
                            {member.is_visible ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                Show
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => deleteMember(member)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-neutral-mid">No team members yet</p>
            <Button href="/admin/team/new" variant="accent" className="mt-4">
              Add your first team member
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
