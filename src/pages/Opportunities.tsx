import { useEffect, useState } from 'react';
import { Briefcase, Trophy, Calendar, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { supabase, Opportunity } from '../lib/supabase';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ApplicationModal } from '../components/opportunities/ApplicationModal';
import { format } from 'date-fns';

export function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'job' | 'contest'>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    async function fetchOpportunities() {
      const { data } = await supabase
        .from('opportunities')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (data) {
        setOpportunities(data);
      }
      setIsLoading(false);
    }

    fetchOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter((op) => {
    if (filter === 'all') return true;
    return op.type === filter;
  });

  return (
    <div className="pt-32 pb-20">
      <div className="container-grid">
        <div className="col-span-full mb-12">
          <SectionHeading
            title="Opportunities"
            subtitle="Join our team or participate in our creative challenges. We're always looking for talented designers and developers."
          />
          
          <div className="flex gap-4 mt-8 border-b border-neutral-light pb-4">
            {(['all', 'job', 'contest'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filter === t
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-mid hover:text-primary'
                }`}
              >
                {t === 'all' ? 'All Opportunities' : t === 'job' ? 'Careers' : 'Contests'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-neutral-light rounded animate-pulse" />
            ))}
          </div>
        ) : filteredOpportunities.length > 0 ? (
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredOpportunities.map((op) => (
              <div
                key={op.id}
                className="group p-8 bg-surface border border-neutral-light hover:border-primary transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-neutral-light/30 rounded">
                    {op.type === 'job' ? (
                      <Briefcase className="w-6 h-6 text-primary" />
                    ) : (
                      <Trophy className="w-6 h-6 text-orange" />
                    )}
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${
                    op.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-orange/10 text-orange'
                  }`}>
                    {op.type === 'job' ? 'Career' : 'Contest'}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-primary transition-colors">
                  {op.title}
                </h3>

                <p className="text-neutral-mid mb-8 flex-grow line-clamp-3">
                  {op.description}
                </p>

                <div className="space-y-3 mb-8">
                  {op.location && (
                    <div className="flex items-center gap-2 text-sm text-neutral-mid">
                      <MapPin className="w-4 h-4" />
                      {op.location}
                    </div>
                  )}
                  {op.deadline && (
                    <div className="flex items-center gap-2 text-sm text-neutral-mid">
                      <Calendar className="w-4 h-4" />
                      Deadline: {format(new Date(op.deadline), 'MMMM d, yyyy')}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {op.requirements.slice(0, 3).map((req, i) => (
                    <span key={i} className="px-3 py-1 bg-neutral-light/50 text-xs rounded text-neutral-mid">
                      {req}
                    </span>
                  ))}
                  {op.requirements.length > 3 && (
                    <span className="text-xs text-neutral-mid self-center">
                      +{op.requirements.length - 3} more
                    </span>
                  )}
                </div>

                {op.external_link ? (
                  <a
                    href={op.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-orange transition-colors mt-auto"
                  >
                    Apply Now <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button 
                    onClick={() => setSelectedOpportunity(op)}
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-orange transition-colors mt-auto"
                  >
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-20 bg-neutral-light/10 rounded">
            <p className="text-neutral-mid text-lg">No open opportunities at the moment. Check back later!</p>
          </div>
        )}
      </div>

      {selectedOpportunity && (
        <ApplicationModal 
          opportunity={selectedOpportunity} 
          onClose={() => setSelectedOpportunity(null)} 
        />
      )}
    </div>
  );
}

