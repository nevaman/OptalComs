import { useMemo, useState } from 'react';
import { Coins, Calendar, Globe, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Opportunity } from '../../lib/supabase';

export interface Grant {
  id: string;
  title: string;
  organization?: string;
  organization_logo?: string;
  amount_min?: number;
  amount_max?: number;
  description: string;
  focus_areas?: string[];
  eligibility?: string[];
  requirements?: string[];
  application_process?: string[];
  deadline?: string;
  status: 'open' | 'closing_soon' | 'closed';
  external_link?: string;
  is_featured?: boolean;
  category?: string;
  funding_type?: string;
  posted_at?: string;
}

type GrantMetadata = {
  organization?: string;
  organization_logo?: string;
  amount_min?: number;
  amount_max?: number;
  focus_areas?: string[];
  eligibility?: string[];
  application_process?: string[];
  category?: string;
  funding_type?: string;
};

const mapOpportunityToGrant = (opportunity: Opportunity): Grant => {
  const metadata = (opportunity.metadata || {}) as GrantMetadata;
  return {
    id: opportunity.id,
    title: opportunity.title,
    organization: metadata.organization || 'Optal Communications',
    organization_logo: metadata.organization_logo,
    amount_min: metadata.amount_min,
    amount_max: metadata.amount_max,
    description: opportunity.description,
    focus_areas: metadata.focus_areas || [],
    eligibility: metadata.eligibility || [],
    requirements: opportunity.requirements || [],
    application_process: metadata.application_process || [],
    deadline: opportunity.deadline || undefined,
    status: opportunity.status === 'closed' ? 'closed' : 'open',
    external_link: opportunity.external_link || undefined,
    is_featured: opportunity.is_featured,
    category: metadata.category || 'General',
    funding_type: metadata.funding_type || 'grant',
    posted_at: opportunity.created_at,
  };
};

export function GrantsTab({
  opportunities,
  isLoading,
}: {
  opportunities: Opportunity[];
  isLoading: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);

  const grants = useMemo(
    () =>
      opportunities
        .filter((op) => op.type === 'grant' && op.status !== 'draft')
        .map(mapOpportunityToGrant),
    [opportunities]
  );

  const filteredGrants = grants.filter((grant) => {
    const matchesSearch =
      searchQuery === '' ||
      grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (grant.organization || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (grant.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-neutral-light/20 rounded-lg">
        <div className="w-10 h-10 border-4 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neutral-mid">Loading grants...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search grants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
          />
        </div>
      </div>

      {filteredGrants.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGrants.map((grant) => (
            <GrantCard key={grant.id} grant={grant} onSelect={setSelectedGrant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-neutral-light/20 rounded-lg">
          <Coins className="w-12 h-12 text-neutral-light mx-auto mb-4" />
          <p className="text-neutral-mid text-lg">No grants are available right now.</p>
        </div>
      )}

      {selectedGrant && (
        <GrantDetailModal grant={selectedGrant} onClose={() => setSelectedGrant(null)} />
      )}
    </div>
  );
}

function GrantCard({ grant, onSelect }: { grant: Grant; onSelect: (grant: Grant) => void }) {
  return (
    <div
      className="p-6 bg-surface border rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onSelect(grant)}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {grant.organization_logo ? (
            <img
              src={grant.organization_logo}
              alt={grant.organization}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-orange" />
            </div>
          )}
          <div>
            <h3 className="font-display font-bold text-lg">{grant.title}</h3>
            <p className="text-sm text-neutral-mid">{grant.organization}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            grant.status === 'open'
              ? 'bg-green-100 text-green-700'
              : grant.status === 'closing_soon'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-neutral-light text-neutral-dark'
          }`}
        >
          {grant.status.replace('_', ' ')}
        </span>
      </div>

      <p className="text-neutral-mid text-sm line-clamp-2 mb-4">{grant.description}</p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-mid">
        {grant.deadline && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Closes {format(new Date(grant.deadline), 'MMM d, yyyy')}
          </span>
        )}
        {grant.focus_areas && grant.focus_areas.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {grant.focus_areas.slice(0, 2).join(', ')}
          </span>
        )}
      </div>
    </div>
  );
}

function GrantDetailModal({ grant, onClose }: { grant: Grant; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Coins className="w-6 h-6 text-orange" />
              <h2 className="text-xl font-display font-bold">{grant.title}</h2>
            </div>
            {grant.deadline && (
              <p className="text-sm text-neutral-mid mt-1">
                Deadline {format(new Date(grant.deadline), 'MMM d, yyyy')} ({formatDistanceToNow(new Date(grant.deadline))} left)
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-neutral-mid hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-neutral-mid">{grant.description}</p>

          {grant.focus_areas && grant.focus_areas.length > 0 && (
            <div>
              <h4 className="font-display font-bold mb-3">Focus Areas</h4>
              <div className="flex flex-wrap gap-2">
                {grant.focus_areas.map((area, i) => (
                  <span key={i} className="px-3 py-1 bg-neutral-light/50 text-sm rounded-full">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {grant.eligibility && grant.eligibility.length > 0 && (
            <div>
              <h4 className="font-display font-bold mb-3">Eligibility</h4>
              <ul className="space-y-2">
                {grant.eligibility.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-neutral-mid">
                    <CheckCircle2 className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {grant.requirements && grant.requirements.length > 0 && (
            <div>
              <h4 className="font-display font-bold mb-3">Requirements</h4>
              <ul className="space-y-2">
                {grant.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-neutral-mid">
                    <CheckCircle2 className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-neutral-light p-6 flex gap-3">
          {grant.external_link ? (
            <a
              href={grant.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-orange text-surface px-6 py-3 font-medium rounded-lg hover:bg-orange/90 transition-colors"
            >
              View Details <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <div className="flex-1 text-center text-neutral-mid py-3">Apply through your admin portal.</div>
          )}
        </div>
      </div>
    </div>
  );
}
