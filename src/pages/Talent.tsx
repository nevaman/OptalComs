import { useEffect, useState } from 'react';
import { supabase, Talent } from '../lib/supabase';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Globe, User, Code, Palette } from 'lucide-react';

export function TalentPage() {
  const [talent, setTalent] = useState<Talent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTalent() {
      const { data, error } = await supabase
        .from('talent')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTalent(data);
      }
      setIsLoading(false);
    }

    fetchTalent();
  }, []);

  return (
    <div className="pt-32 pb-20">
      <div className="container-grid">
        <div className="col-span-full mb-16">
          <SectionHeading
            title="Talent Network"
            subtitle="Meet the talented graphics designers and software developers who have successfully joined our network through our contests and opportunities."
          />
        </div>

        {isLoading ? (
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-neutral-light rounded animate-pulse" />
            ))}
          </div>
        ) : talent.length > 0 ? (
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {talent.map((member) => (
              <div
                key={member.id}
                className="group relative bg-surface border border-neutral-light overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="aspect-square bg-neutral-light relative overflow-hidden">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-mid">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                  
                  {member.portfolio_url && (
                    <a
                      href={member.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-4 right-4 w-10 h-10 bg-surface flex items-center justify-center rounded-full shadow-lg translate-y-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-primary hover:text-surface"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {member.role.toLowerCase().includes('dev') ? (
                      <Code className="w-3 h-3 text-primary" />
                    ) : (
                      <Palette className="w-3 h-3 text-orange" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-mid">
                      {member.role}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{member.name}</h3>
                  <p className="text-sm text-neutral-mid line-clamp-3">
                    {member.bio || 'Professional creator and dedicated contributor to the Optal network.'}
                  </p>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    {member.skills?.slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 bg-neutral-light/50 rounded uppercase font-medium text-neutral-mid">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-20 bg-neutral-light/10 rounded">
            <p className="text-neutral-mid text-lg">Our talent network is currently growing. Applications are open!</p>
          </div>
        )}
      </div>
    </div>
  );
}

