import { useState } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Award,
  ArrowRight,
  ExternalLink,
  X,
  CheckCircle2,
  Star,
  Zap,
  Target,
  Gift,
  Upload,
} from 'lucide-react';
import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';

export interface Contest {
  id: string;
  title: string;
  slug: string;
  category: 'design' | 'development' | 'content' | 'strategy' | 'mixed';
  description: string;
  brief: string;
  prizes: { place: string; reward: string; description?: string }[];
  judges: { name: string; title: string; photo?: string }[];
  timeline: { stage: string; date: string }[];
  requirements: string[];
  submission_guidelines: string[];
  eligibility: string[];
  sponsors: { name: string; logo?: string }[];
  status: 'upcoming' | 'open' | 'judging' | 'completed';
  entry_count: number;
  start_date: string;
  end_date: string;
  results_date?: string;
  featured_image?: string;
  is_featured: boolean;
  external_link?: string;
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

const mockContests: Contest[] = [
  {
    id: '1',
    title: 'Brand Identity Challenge 2026',
    slug: 'brand-identity-challenge-2026',
    category: 'design',
    description: 'Create a complete brand identity system for a fictional sustainable fashion startup. Show us your vision for the future of ethical fashion branding.',
    brief: 'Design a comprehensive brand identity including logo, color palette, typography, and brand guidelines for "EcoThread" - a sustainable fashion brand targeting Gen Z consumers.',
    prizes: [
      { place: '1st Place', reward: '$5,000', description: 'Plus mentorship session with industry leaders' },
      { place: '2nd Place', reward: '$2,500', description: 'Plus premium design tool subscriptions' },
      { place: '3rd Place', reward: '$1,000', description: 'Plus feature in our Insights publication' },
    ],
    judges: [
      { name: 'Sarah Chen', title: 'Creative Director, Brand Studio' },
      { name: 'Michael Torres', title: 'Head of Design, TechCorp' },
      { name: 'Emma Williams', title: 'Founder, Design Collective' },
    ],
    timeline: [
      { stage: 'Registration Opens', date: '2026-01-01' },
      { stage: 'Submissions Open', date: '2026-01-15' },
      { stage: 'Submissions Close', date: '2026-02-15' },
      { stage: 'Winners Announced', date: '2026-03-01' },
    ],
    requirements: [
      'Logo design (multiple variations)',
      'Color palette with rationale',
      'Typography system',
      'Brand guidelines document',
      'Three mockup applications',
    ],
    submission_guidelines: [
      'Submit as a single PDF (max 20 pages)',
      'Include a 200-word design rationale',
      'All work must be original',
      'No AI-generated content',
    ],
    eligibility: [
      'Open to designers worldwide',
      'Must be 18 years or older',
      'Individual or team entries accepted',
    ],
    sponsors: [
      { name: 'Figma' },
      { name: 'Adobe' },
      { name: 'Optal Creative' },
    ],
    status: 'open',
    entry_count: 247,
    start_date: '2026-01-15T00:00:00Z',
    end_date: '2026-02-15T23:59:59Z',
    results_date: '2026-03-01T12:00:00Z',
    featured_image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_featured: true,
  },
  {
    id: '2',
    title: 'Code for Good Hackathon',
    slug: 'code-for-good-hackathon',
    category: 'development',
    description: 'Build solutions that address social impact challenges. Focus on accessibility, sustainability, or community support.',
    brief: 'Develop a working prototype that addresses one of three challenge tracks: Accessibility, Environmental Impact, or Community Support.',
    prizes: [
      { place: '1st Place', reward: '$10,000', description: 'Plus cloud credits and mentorship' },
      { place: '2nd Place', reward: '$5,000' },
      { place: '3rd Place', reward: '$2,500' },
    ],
    judges: [
      { name: 'Alex Rivera', title: 'CTO, ImpactTech' },
      { name: 'Dr. Lisa Park', title: 'Professor, MIT Media Lab' },
    ],
    timeline: [
      { stage: 'Registration', date: '2026-02-01' },
      { stage: 'Hackathon Weekend', date: '2026-02-20' },
      { stage: 'Winners Announced', date: '2026-02-22' },
    ],
    requirements: [
      'Working prototype',
      'Source code repository',
      'Demo video (3 min max)',
      'Technical documentation',
    ],
    submission_guidelines: [
      'Team size: 1-4 members',
      'Must use open-source technologies',
      'Include setup instructions',
    ],
    eligibility: [
      'Open to developers globally',
      'Students and professionals welcome',
    ],
    sponsors: [
      { name: 'Google Cloud' },
      { name: 'GitHub' },
    ],
    status: 'upcoming',
    entry_count: 0,
    start_date: '2026-02-20T09:00:00Z',
    end_date: '2026-02-22T18:00:00Z',
    is_featured: true,
  },
  {
    id: '3',
    title: 'Communications Excellence Awards',
    slug: 'communications-excellence-awards',
    category: 'strategy',
    description: 'Showcase your best communications campaigns from the past year. Categories include Crisis Communications, Internal Communications, and PR Campaign.',
    brief: 'Submit case studies demonstrating exceptional communications strategy and execution.',
    prizes: [
      { place: 'Gold Award', reward: 'Trophy + $3,000' },
      { place: 'Silver Award', reward: 'Trophy + $1,500' },
      { place: 'Bronze Award', reward: 'Trophy + $750' },
    ],
    judges: [
      { name: 'Jennifer Walsh', title: 'VP Communications, Fortune 500' },
      { name: 'Robert Kim', title: 'PR Agency Founder' },
    ],
    timeline: [
      { stage: 'Entries Open', date: '2025-11-01' },
      { stage: 'Entries Close', date: '2025-12-15' },
      { stage: 'Awards Ceremony', date: '2026-01-20' },
    ],
    requirements: [
      'Case study document',
      'Campaign metrics',
      'Supporting materials',
    ],
    submission_guidelines: [
      'Max 10-page case study',
      'Include measurable results',
    ],
    eligibility: [
      'Communications professionals',
      'Agencies and in-house teams',
    ],
    sponsors: [],
    status: 'completed',
    entry_count: 156,
    start_date: '2025-11-01T00:00:00Z',
    end_date: '2025-12-15T23:59:59Z',
    results_date: '2026-01-20T18:00:00Z',
    is_featured: false,
  },
];

const mockWinners: Winner[] = [
  {
    id: '1',
    contest_id: '3',
    contest_title: 'Communications Excellence Awards',
    name: 'Marina Gonzalez',
    photo: 'https://images.pexels.com/photos/3776166/pexels-photo-3776166.jpeg?auto=compress&cs=tinysrgb&w=200',
    place: 1,
    project_title: 'Climate Action Campaign',
    project_image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=400',
    testimonial: 'Winning this award validated our team\'s innovative approach to sustainability communications.',
    awarded_at: '2026-01-20T18:00:00Z',
  },
  {
    id: '2',
    contest_id: '3',
    contest_title: 'Communications Excellence Awards',
    name: 'David Chen',
    photo: 'https://images.pexels.com/photos/3777564/pexels-photo-3777564.jpeg?auto=compress&cs=tinysrgb&w=200',
    place: 2,
    project_title: 'Internal Engagement Revolution',
    project_image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    testimonial: 'The recognition from industry peers means everything to our team.',
    awarded_at: '2026-01-20T18:00:00Z',
  },
];

const categoryColors = {
  design: 'bg-pink-100 text-pink-700',
  development: 'bg-blue-100 text-blue-700',
  content: 'bg-green-100 text-green-700',
  strategy: 'bg-yellow-100 text-yellow-700',
  mixed: 'bg-neutral-light text-neutral-mid',
};

const statusBadges = {
  upcoming: { label: 'Coming Soon', color: 'bg-blue-100 text-blue-700' },
  open: { label: 'Open for Entries', color: 'bg-green-100 text-green-700' },
  judging: { label: 'Judging in Progress', color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Completed', color: 'bg-neutral-light text-neutral-mid' },
};

export function ContestsTab() {
  const [contests] = useState<Contest[]>(mockContests);
  const [winners] = useState<Winner[]>(mockWinners);
  const [activeView, setActiveView] = useState<'active' | 'past' | 'winners'>('active');
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const activeContests = contests.filter((c) => c.status === 'open' || c.status === 'upcoming');
  const pastContests = contests.filter((c) => c.status === 'completed' || c.status === 'judging');

  return (
    <div className="space-y-8">
      <div className="flex gap-2 flex-wrap border-b border-neutral-light pb-4">
        {[
          { id: 'active', label: 'Active Contests', count: activeContests.length },
          { id: 'past', label: 'Past Contests', count: pastContests.length },
          { id: 'winners', label: 'Winner Showcase', count: winners.length },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id as typeof activeView)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeView === view.id
                ? 'text-orange border-b-2 border-orange'
                : 'text-neutral-mid hover:text-primary'
            }`}
          >
            {view.label} ({view.count})
          </button>
        ))}
      </div>

      {activeView === 'active' && (
        <div className="space-y-6">
          {activeContests.map((contest) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              onSelect={() => setSelectedContest(contest)}
            />
          ))}
          {activeContests.length === 0 && (
            <div className="text-center py-16 bg-neutral-light/20 rounded-lg">
              <Trophy className="w-12 h-12 text-neutral-light mx-auto mb-4" />
              <p className="text-neutral-mid text-lg">No active contests at the moment.</p>
              <p className="text-neutral-mid text-sm mt-2">Check back soon for new challenges!</p>
            </div>
          )}
        </div>
      )}

      {activeView === 'past' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastContests.map((contest) => (
            <div
              key={contest.id}
              className="p-6 bg-surface border border-neutral-light rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded ${categoryColors[contest.category]}`}>
                  {contest.category}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${statusBadges[contest.status].color}`}>
                  {statusBadges[contest.status].label}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{contest.title}</h3>
              <p className="text-sm text-neutral-mid mb-4 line-clamp-2">{contest.description}</p>
              <div className="flex items-center justify-between text-sm text-neutral-mid">
                <span>{contest.entry_count} entries</span>
                <span>Ended {format(new Date(contest.end_date), 'MMM d, yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeView === 'winners' && (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display font-bold mb-2">Celebrating Excellence</h3>
            <p className="text-neutral-mid">Recognizing outstanding talent from our creative community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {winners.map((winner) => (
              <WinnerCard key={winner.id} winner={winner} />
            ))}
          </div>

          {winners.length === 0 && (
            <div className="text-center py-16 bg-neutral-light/20 rounded-lg">
              <Award className="w-12 h-12 text-neutral-light mx-auto mb-4" />
              <p className="text-neutral-mid text-lg">No winners to display yet.</p>
            </div>
          )}
        </div>
      )}

      {selectedContest && (
        <ContestDetailModal
          contest={selectedContest}
          onClose={() => setSelectedContest(null)}
          onEnter={() => setShowSubmissionForm(true)}
        />
      )}

      {showSubmissionForm && selectedContest && (
        <ContestSubmissionModal
          contest={selectedContest}
          onClose={() => {
            setShowSubmissionForm(false);
            setSelectedContest(null);
          }}
        />
      )}
    </div>
  );
}

function ContestCard({
  contest,
  onSelect,
}: {
  contest: Contest;
  onSelect: () => void;
}) {
  const isOpen = contest.status === 'open';
  const timeLeft = isOpen ? formatDistanceToNow(new Date(contest.end_date), { addSuffix: true }) : null;

  return (
    <div
      onClick={onSelect}
      className={`relative bg-surface border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${
        contest.is_featured ? 'border-orange' : 'border-neutral-light hover:border-primary'
      }`}
    >
      {contest.featured_image && (
        <div className="h-48 overflow-hidden">
          <img
            src={contest.featured_image}
            alt={contest.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-1 text-xs font-medium rounded ${categoryColors[contest.category]}`}>
            {contest.category}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded ${statusBadges[contest.status].color}`}>
            {statusBadges[contest.status].label}
          </span>
        </div>

        <h3 className="text-xl font-display font-bold mb-3">{contest.title}</h3>
        <p className="text-neutral-mid text-sm mb-4 line-clamp-2">{contest.description}</p>

        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          {isOpen && timeLeft && (
            <span className="inline-flex items-center gap-1 text-orange font-medium">
              <Clock className="w-4 h-4" /> Ends {timeLeft}
            </span>
          )}
          {contest.status === 'upcoming' && (
            <span className="inline-flex items-center gap-1 text-neutral-mid">
              <Calendar className="w-4 h-4" /> Starts {format(new Date(contest.start_date), 'MMM d')}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-neutral-mid">
            <Users className="w-4 h-4" /> {contest.entry_count} entries
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-neutral-mid mb-1">Grand Prize</p>
            <p className="font-display font-bold text-orange">{contest.prizes[0]?.reward}</p>
          </div>
          <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
            View Details <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {contest.is_featured && (
        <div className="absolute top-4 left-4 px-3 py-1 bg-orange text-surface text-xs font-bold rounded-full flex items-center gap-1">
          <Star className="w-3 h-3" /> Featured
        </div>
      )}
    </div>
  );
}

function WinnerCard({ winner }: { winner: Winner }) {
  const placeLabels = ['1st Place', '2nd Place', '3rd Place'];
  const placeColors = ['text-yellow-600', 'text-neutral-mid', 'text-orange'];

  return (
    <div className="bg-surface border border-neutral-light rounded-lg overflow-hidden">
      {winner.project_image && (
        <div className="h-48 overflow-hidden">
          <img src={winner.project_image} alt={winner.project_title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {winner.photo ? (
            <img src={winner.photo} alt={winner.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-orange" />
            </div>
          )}
          <div>
            <h4 className="font-display font-bold">{winner.name}</h4>
            <p className={`text-sm font-medium ${placeColors[winner.place - 1] || 'text-neutral-mid'}`}>
              {placeLabels[winner.place - 1] || `${winner.place}th Place`}
            </p>
          </div>
        </div>

        <h5 className="font-medium mb-2">{winner.project_title}</h5>
        <p className="text-xs text-neutral-mid mb-3">{winner.contest_title}</p>

        {winner.testimonial && (
          <blockquote className="text-sm text-neutral-mid italic border-l-2 border-orange pl-3">
            "{winner.testimonial}"
          </blockquote>
        )}
      </div>
    </div>
  );
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
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-display font-bold">{contest.title}</h2>
          <button onClick={onClose} className="p-2 text-neutral-mid hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {contest.featured_image && (
            <img
              src={contest.featured_image}
              alt={contest.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-neutral-light/30 rounded-lg text-center">
              <Trophy className="w-6 h-6 text-orange mx-auto mb-2" />
              <p className="text-xs text-neutral-mid">Grand Prize</p>
              <p className="font-display font-bold">{contest.prizes[0]?.reward}</p>
            </div>
            <div className="p-4 bg-neutral-light/30 rounded-lg text-center">
              <Users className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-neutral-mid">Entries</p>
              <p className="font-display font-bold">{contest.entry_count}</p>
            </div>
            <div className="p-4 bg-neutral-light/30 rounded-lg text-center">
              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-neutral-mid">Deadline</p>
              <p className="font-display font-bold">{format(new Date(contest.end_date), 'MMM d')}</p>
            </div>
            <div className="p-4 bg-neutral-light/30 rounded-lg text-center">
              <Target className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-neutral-mid">Category</p>
              <p className="font-display font-bold capitalize">{contest.category}</p>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange" /> The Brief
            </h3>
            <p className="text-neutral-mid">{contest.brief}</p>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
              <Gift className="w-5 h-5 text-orange" /> Prizes
            </h3>
            <div className="space-y-3">
              {contest.prizes.map((prize, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-orange/5 rounded-lg">
                  <div>
                    <p className="font-medium">{prize.place}</p>
                    {prize.description && <p className="text-sm text-neutral-mid">{prize.description}</p>}
                  </div>
                  <p className="font-display font-bold text-orange">{prize.reward}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-3">Timeline</h3>
            <div className="space-y-2">
              {contest.timeline.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-neutral-mid">{format(new Date(item.date), 'MMM d')}</div>
                  <div className="w-3 h-3 rounded-full bg-orange" />
                  <div className="text-sm">{item.stage}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-3">Requirements</h3>
            <ul className="space-y-2">
              {contest.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-neutral-mid">
                  <CheckCircle2 className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {contest.judges.length > 0 && (
            <div>
              <h3 className="font-display font-bold text-lg mb-3">Judges</h3>
              <div className="flex flex-wrap gap-4">
                {contest.judges.map((judge, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-neutral-light/30 rounded-lg">
                    <div className="w-10 h-10 bg-orange/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-orange" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{judge.name}</p>
                      <p className="text-xs text-neutral-mid">{judge.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-surface border-t border-neutral-light p-6">
          {contest.status === 'open' ? (
            <button
              onClick={onEnter}
              className="w-full inline-flex items-center justify-center gap-2 bg-orange text-surface px-6 py-4 font-medium rounded-lg hover:bg-orange/90 transition-colors"
            >
              Enter This Contest <ArrowRight className="w-4 h-4" />
            </button>
          ) : contest.status === 'upcoming' ? (
            <div className="text-center">
              <p className="text-neutral-mid">
                Entries open {format(new Date(contest.start_date), 'MMMM d, yyyy')}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-neutral-mid">This contest has ended</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContestSubmissionModal({
  contest,
  onClose,
}: {
  contest: Contest;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    portfolio: '',
    projectTitle: '',
    projectDescription: '',
    files: [] as File[],
    agreeToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
        <div className="bg-surface rounded-lg w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">Entry Submitted!</h2>
          <p className="text-neutral-mid mb-6">
            Thank you for entering {contest.title}. You'll receive a confirmation email shortly.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-primary text-surface px-6 py-3 font-medium rounded-lg hover:bg-neutral-dark transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50">
      <div className="bg-surface rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-neutral-light p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-display font-bold">Submit Entry</h2>
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

          <div>
            <label className="block text-sm font-medium mb-1">Portfolio / Website</label>
            <input
              type="url"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Project Description *</label>
            <textarea
              required
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:border-orange focus:outline-none resize-none"
              placeholder="Describe your submission..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Files</label>
            <div className="border-2 border-dashed border-neutral-light rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-neutral-mid mx-auto mb-2" />
              <p className="text-sm text-neutral-mid">Drag files here or click to upload</p>
              <p className="text-xs text-neutral-mid mt-1">PDF, ZIP, or images (max 50MB)</p>
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              className="mt-1"
            />
            <span className="text-sm text-neutral-mid">
              I confirm this is my original work and I agree to the contest terms and conditions.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange text-surface px-6 py-3 font-medium rounded-lg hover:bg-orange/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}
