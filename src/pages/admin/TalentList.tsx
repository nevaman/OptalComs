import { useEffect, useState } from 'react';
import { supabase, Talent } from '../../lib/supabase';
import { Trash2, Globe, Eye, EyeOff, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function TalentList() {
  const [talent, setTalent] = useState<Talent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTalent();
  }, []);

  async function fetchTalent() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('talent')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTalent(data);
    }
    setIsLoading(false);
  }

  const toggleVisibility = async (member: Talent) => {
    const { error } = await supabase
      .from('talent')
      .update({ is_visible: !member.is_visible })
      .eq('id', member.id);

    if (!error) {
      setTalent(prev => prev.map(t => t.id === member.id ? { ...t, is_visible: !t.is_visible } : t));
    }
  };

  const deleteTalent = async (id: string) => {
    if (confirm('Are you sure you want to remove this person from the talent list?')) {
      const { error } = await supabase.from('talent').delete().eq('id', id);
      if (!error) {
        setTalent(prev => prev.filter(t => t.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Talent Network</h1>
          <p className="text-neutral-mid mt-1">Approved designers and developers</p>
        </div>
      </div>

      <div className="bg-surface rounded border border-neutral-light overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center animate-pulse text-neutral-mid">Loading...</div>
        ) : talent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-light/30 border-b border-neutral-light">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-light">
                {talent.map((member) => (
                  <tr key={member.id} className="hover:bg-neutral-light/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-light flex items-center justify-center overflow-hidden">
                          {member.avatar_url ? (
                            <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-neutral-mid" />
                          )}
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-mid italic truncate max-w-[200px]">
                      {member.role}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        member.is_visible ? 'bg-green-100 text-green-700' : 'bg-neutral-light text-neutral-mid'
                      }`}>
                        {member.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {member.portfolio_url && (
                          <a 
                            href={member.portfolio_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 text-neutral-mid hover:text-primary transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                        <button 
                          onClick={() => toggleVisibility(member)}
                          className="p-2 text-neutral-mid hover:text-primary transition-colors"
                          title={member.is_visible ? "Hide from public" : "Show to public"}
                        >
                          {member.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => deleteTalent(member.id)}
                          className="p-2 text-neutral-mid hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <User className="w-12 h-12 text-neutral-light mx-auto mb-4" />
            <p className="text-neutral-mid">No talent profiles yet. Approve some applications to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

