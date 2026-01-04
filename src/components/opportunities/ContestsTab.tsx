import { useMemo, useState } from 'react';
import { Trophy, Calendar, Clock, Users, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Opportunity, supabase } from '../../lib/supabase';

export interface Contest {
  id: string;
  title: string;
  slug: string;
  category?: string;
  description: string;
  requirements: string[];
  status: 'upcoming' | 'open' | 'judging' | 'completed' | 'closed';
  start_date?: string;
  end_date?: string;
  results_date?: string;
  featured_image?: string;
  is_featured?: boolean;
  external_link?: string;
  telegram_channel?: string;
  prizes?: { place: string; reward: string; description?: string }[];
  brief?: string;
  judges?: { name: string; title?: string; photo?: string }[];
  submission_guidelines?: string[];
  eligibility?: string[];
  sponsors?: { name: string; logo?: string }[];
  timeline?: { stage: string; date: string }[];
  entry_count?: number;
}

export interface Winner {
  id: string;
  contest_id: string;
  contest_title: string;
  name: string;
  photo?: string;
  place: number;
  project_title: string;
  project_image?: string;
  testimonial?: string;
  awarded_at: string;
}

type ContestMetadata = {
  category?: string;
  start_date?: string;
  end_date?: string;
  results_date?: string;
  featured_image?: string;
  telegram_channel?: string;
  prizes?: Contest['prizes'];
  timeline?: Contest['timeline'];
  entry_count?: number;
};

const mapOpportunityToContest = (opportunity: Opportunity): Contest => {
  const metadata = (opportunity.metadata || {}) as ContestMetadata;
  return {
    id: opportunity.id,
    title: opportunity.title,
    slug: opportunity.slug,
    category: metadata.category || 'General',
    description: opportunity.description,
    requirements: opportunity.requirements || [],
    status: (opportunity.status === 'closed' ? 'completed' : opportunity.status) as Contest['status'],
    start_date: metadata.start_date,
    end_date: opportunity.deadline || metadata.end_date,
    results_date: metadata.results_date,
    featured_image: metadata.featured_image,
    is_featured: opportunity.is_featured,
    external_link: opportunity.external_link || undefined,
    telegram_channel: metadata.telegram_channel,
    prizes: metadata.prizes || [],
    timeline: metadata.timeline || [],
    entry_count: metadata.entry_count,
  };
};

export function ContestsTab({
  opportunities,
  isLoading,
}: {
  opportunities: Opportunity[];
  isLoading: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'upcoming' | 'completed'>('all');
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const contests = useMemo(
    () =>
      opportunities
        .filter((op) => op.type === 'contest' && op.status !== 'draft')
        .map(mapOpportunityToContest),
    [opportunities]
  );

  const filteredContests = contests.filter((contest) => {
    const matchesSearch =
      searchQuery === '' ||
      contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contest.category || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || contest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-neutral-light/20 rounded-lg">
        <div className="w-10 h-10 border-4 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neutral-mid">Loading contests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search contests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-4 py-3 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'open', 'upcoming', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                statusFilter === status
                  ? 'bg-orange text-surface'
                  : 'bg-neutral-light/50 text-neutral-mid hover:bg-neutral-light'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredContests.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContests.map((contest) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              onSelect={(c) => {
                setSelectedContest(c);
                setShowRegistration(false);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-neutral-light/20 rounded-lg">
          <Trophy className="w-12 h-12 text-neutral-light mx-auto mb-4" />
          <p className="text-neutral-mid text-lg">No contests match your criteria.</p>
        </div>
      )}

      {selectedContest && (
        <ContestDetailModal
          contest={selectedContest}
          onClose={() => {
            setSelectedContest(null);
            setShowRegistration(false);
          }}
          onEnter={() => setShowRegistration(true)}
        />
      )}

      {showRegistration && selectedContest && (
        <ContestRegistrationModal
          contest={selectedContest}
          onClose={() => {
            setShowRegistration(false);
            setSelectedContest(null);
          }}
        />
      )}
    </div>
  );
}

function ContestCard({ contest, onSelect }: { contest: Contest; onSelect: (contest: Contest) => void }) {
  return (
    <div
      className="p-6 bg-surface border rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onSelect(contest)}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange/10 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-orange" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">{contest.title}</h3>
            <p className="text-sm text-neutral-mid capitalize">{contest.category}</p>
          </div>
        </div>
        <StatusBadge status={contest.status} />
      </div>

      <p className="text-neutral-mid text-sm line-clamp-2 mb-4">{contest.description}</p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-mid">
        {contest.end_date && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Ends {format(new Date(contest.end_date), 'MMM d, yyyy')}
          </span>
        )}
        {contest.entry_count ? (
          <span className="inline-flex items-center gap-1">
            <Users className="w-3 h-3" />
            {contest.entry_count} entries
          </span>
        ) : null}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Contest['status'] }) {
  switch (status) {
    case 'open':
      return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Open</span>;
    case 'upcoming':
      return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Upcoming</span>;
    case 'completed':
    case 'closed':
      return <span className="px-3 py-1 bg-neutral-light text-neutral-dark text-xs font-medium rounded-full">Closed</span>;
    default:
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">In Review</span>;
  }
}

function ContestDetailModal({
  contest,
  onClose,
  onEnter,
}: {
  contest: Contest;
  onClose: () => void;
  onEnter: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-orange" />
              <h2 className="text-xl font-display font-bold">{contest.title}</h2>
            </div>
            {contest.end_date && (
              <p className="text-sm text-neutral-mid mt-1">
                Closes {format(new Date(contest.end_date), 'MMM d, yyyy')}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-neutral-mid hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-neutral-mid">{contest.description}</p>

          {contest.requirements.length > 0 && (
            <div>
              <h4 className="font-display font-bold mb-3">What to submit</h4>
              <ul className="space-y-2">
                {contest.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-neutral-mid">
                    <CheckCircle2 className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contest.timeline && contest.timeline.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-display font-bold">Timeline</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contest.timeline.map((item, idx) => (
                  <div key={idx} className="p-3 bg-neutral-light/30 rounded">
                    <p className="text-sm font-medium">{item.stage}</p>
                    <p className="text-xs text-neutral-mid">{format(new Date(item.date), 'MMM d, yyyy')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contest.prizes && contest.prizes.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-display font-bold">Prizes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contest.prizes.map((prize, idx) => (
                  <div key={idx} className="p-3 bg-orange/5 border border-orange/20 rounded">
                    <p className="font-semibold text-orange">{prize.place}</p>
                    <p className="text-sm">{prize.reward}</p>
                    {prize.description && (
                      <p className="text-xs text-neutral-mid mt-1">{prize.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-neutral-light p-6 flex gap-3">
          {contest.external_link ? (
            <a
              href={contest.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-orange text-surface px-6 py-3 font-medium rounded-lg hover:bg-orange/90 transition-colors"
            >
              View Details <ArrowRight className="w-4 h-4" />
            </a>
          ) : contest.status === 'open' ? (
            <button
              onClick={onEnter}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-orange text-surface px-6 py-3 font-medium rounded-lg hover:bg-orange/90 transition-colors"
            >
              Enter Contest <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex-1 text-center text-neutral-mid py-3">Contest is closed</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContestRegistrationModal({
  contest,
  onClose,
}: {
  contest: Contest;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    portfolio: '',
    howHeard: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationCode, setRegistrationCode] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const generateCode = () => {
    const prefix = contest.slug.slice(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
    return `${prefix}-${random}-${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    const code = generateCode();

    const { error } = await supabase.from('applications').insert([
      {
        opportunity_id: contest.id,
        submission_type: 'contest',
        full_name: formData.name,
        email: formData.email,
        country: formData.country || null,
        portfolio_link: formData.portfolio || null,
        how_heard: formData.howHeard || null,
        registration_code: code,
        status: 'pending',
      },
    ]);

    if (error) {
      setSubmitError(error.message);
      setIsSubmitting(false);
      return;
    }

    setRegistrationCode(code);
    setIsSubmitting(false);
  };

  const copyCode = () => navigator.clipboard.writeText(registrationCode);

  if (registrationCode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
        <div className="bg-surface rounded-lg w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-br from-orange to-orange/80 p-8 text-center text-surface">
            <div className="w-20 h-20 bg-surface/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">You're Registered!</h2>
            <p className="text-surface/80">Welcome to {contest.title}</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center">
              <p className="text-sm text-neutral-mid mb-2">Your unique registration code</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-2xl font-mono font-bold text-primary bg-neutral-light/50 px-4 py-2 rounded-lg">
                  {registrationCode}
                </code>
                <button
                  onClick={copyCode}
                  className="p-2 text-neutral-mid hover:text-orange transition-colors"
                  title="Copy code"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-neutral-mid mt-2">Save this code - you'll need it to submit your work</p>
            </div>

            {contest.telegram_channel && (
              <a
                href={contest.telegram_channel}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 bg-[#0088cc] text-surface px-6 py-4 font-medium rounded-lg hover:bg-[#0077b5] transition-colors"
              >
                Join Telegram Channel
              </a>
            )}

            <button
              onClick={onClose}
              className="w-full bg-primary text-surface px-6 py-3 font-medium rounded-lg hover:bg-neutral-dark transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold">Register for Contest</h2>
            <p className="text-sm text-neutral-mid">{contest.title}</p>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-mid hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Portfolio</label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">How did you hear about this contest?</label>
            <input
              type="text"
              value={formData.howHeard}
              onChange={(e) => setFormData({ ...formData, howHeard: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              placeholder="Social media, friend, newsletter..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange text-surface px-6 py-3 font-medium rounded-lg hover:bg-orange/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Get Registration Code'}
          </button>
          {submitError && <p className="text-sm text-red-600 text-center">{submitError}</p>}
        </form>
      </div>
    </div>
  );
}
