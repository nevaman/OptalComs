import type { CareerListing } from '../components/opportunities/CareersTab';
import type { Contest, Winner } from '../components/opportunities/ContestsTab';
import type { Grant } from '../components/opportunities/GrantsTab';

export interface ContestRegistration {
  id: string;
  contest_id: string;
  contest_title: string;
  registration_code: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  occupation: string;
  experience: string;
  portfolio: string;
  how_heard: string;
  registered_at: string;
  status: 'registered' | 'submitted' | 'disqualified';
  notes?: string;
}

export interface JobApplication {
  id: string;
  career_id: string;
  career_title: string;
  name: string;
  email: string;
  phone: string;
  resume_url?: string;
  cover_letter?: string;
  portfolio_url?: string;
  applied_at: string;
  status: 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'rejected';
}

export interface GrantApplication {
  id: string;
  grant_id: string;
  grant_title: string;
  applicant_name: string;
  organization_name?: string;
  email: string;
  phone: string;
  project_title: string;
  project_description: string;
  requested_amount: number;
  applied_at: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
}

const initialCareers: CareerListing[] = [
  {
    id: '1',
    title: 'Senior UI/UX Designer',
    company: 'Optal Creative',
    location: 'Remote',
    type: 'full-time',
    experience_level: 'senior',
    salary_range: '$90k - $120k',
    description: 'We are looking for a Senior UI/UX Designer to join our growing team and help shape the future of digital experiences for our clients.',
    requirements: ['5+ years of UI/UX design experience', 'Strong Figma proficiency', 'Experience with design systems', 'Excellent communication skills'],
    benefits: ['Remote work flexibility', 'Health insurance', 'Professional development budget', 'Unlimited PTO'],
    is_internal: true,
    posted_at: '2026-01-02T10:00:00Z',
    is_featured: true,
    category: 'Design',
  },
  {
    id: '2',
    title: 'Brand Strategist',
    company: 'Optal Creative',
    location: 'Addis Ababa, Ethiopia',
    type: 'full-time',
    experience_level: 'mid',
    salary_range: 'Competitive',
    description: 'Join our strategy team to develop compelling brand narratives and positioning for clients across various industries.',
    requirements: ['3+ years in brand strategy', 'Strong research skills', 'Presentation abilities'],
    benefits: ['Hybrid work', 'Training programs', 'Team retreats'],
    is_internal: true,
    posted_at: '2026-01-01T09:00:00Z',
    is_featured: false,
    category: 'Strategy',
  },
  {
    id: '3',
    title: 'Communications Manager',
    company: 'TechCorp Inc',
    location: 'New York, NY',
    type: 'full-time',
    experience_level: 'senior',
    salary_range: '$100k - $140k',
    description: 'Lead communications strategy for a fast-growing tech company.',
    requirements: ['7+ years experience', 'Tech industry background', 'Crisis communications experience'],
    benefits: ['Equity package', 'Premium healthcare', '401k matching'],
    is_internal: false,
    external_link: 'https://example.com/jobs/communications-manager',
    posted_at: '2025-12-28T09:00:00Z',
    is_featured: false,
    category: 'Marketing',
  },
];

const initialContests: Contest[] = [
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
    sponsors: [{ name: 'Figma' }, { name: 'Adobe' }],
    status: 'open',
    entry_count: 247,
    start_date: '2026-01-15T00:00:00Z',
    end_date: '2026-02-15T23:59:59Z',
    results_date: '2026-03-01T12:00:00Z',
    is_featured: true,
    telegram_channel: 'https://t.me/optalcontests',
  },
  {
    id: '2',
    title: 'Motion Design Showdown',
    slug: 'motion-design-showdown',
    category: 'design',
    description: 'Show off your animation skills in this exciting motion design competition.',
    brief: 'Create a 15-30 second motion graphics piece that tells a story about innovation and progress.',
    prizes: [
      { place: '1st Place', reward: '$3,000' },
      { place: '2nd Place', reward: '$1,500' },
    ],
    judges: [
      { name: 'Alex Rivera', title: 'Motion Director' },
    ],
    timeline: [
      { stage: 'Registration Opens', date: '2026-02-01' },
      { stage: 'Submissions Close', date: '2026-03-15' },
    ],
    requirements: ['15-30 second video', 'MP4 format', 'Original audio or licensed music'],
    submission_guidelines: ['Upload to designated platform', 'Include project files'],
    eligibility: ['Open worldwide', 'Professional and student categories'],
    sponsors: [],
    status: 'upcoming',
    entry_count: 0,
    start_date: '2026-02-01T00:00:00Z',
    end_date: '2026-03-15T23:59:59Z',
    is_featured: false,
  },
];

const initialGrants: Grant[] = [
  {
    id: '1',
    title: 'Creative Innovation Fund',
    organization: 'National Arts Foundation',
    amount_min: 10000,
    amount_max: 50000,
    description: 'Supporting innovative creative projects that push the boundaries of art, design, and technology.',
    focus_areas: ['Digital Art', 'Interactive Media', 'Cross-disciplinary Projects'],
    eligibility: ['Individual artists', 'Emerging creatives', 'Non-profit organizations'],
    requirements: ['Project proposal', 'Portfolio', 'Budget breakdown', 'Timeline'],
    application_process: ['Submit online application', 'Panel review', 'Interview for finalists'],
    deadline: '2026-03-15T23:59:59Z',
    status: 'open',
    is_featured: true,
    category: 'creative',
    funding_type: 'grant',
    posted_at: '2026-01-01T10:00:00Z',
    external_link: 'https://example.com/grants/creative-innovation',
  },
  {
    id: '2',
    title: 'Tech for Good Fellowship',
    organization: 'Impact Foundation',
    amount_min: 25000,
    amount_max: 75000,
    description: 'A 12-month fellowship for technologists working on solutions to social and environmental challenges.',
    focus_areas: ['Climate Tech', 'Healthcare Access', 'Education Technology'],
    eligibility: ['Tech professionals', '5+ years experience', 'Committed to social impact'],
    requirements: ['Application essay', 'Project concept', 'References'],
    application_process: ['Application review', 'Virtual interview', 'Demo day'],
    deadline: '2026-02-28T23:59:59Z',
    status: 'open',
    is_featured: false,
    category: 'technology',
    funding_type: 'fellowship',
    posted_at: '2025-12-15T10:00:00Z',
  },
];

const initialRegistrations: ContestRegistration[] = [
  {
    id: '1',
    contest_id: '1',
    contest_title: 'Brand Identity Challenge 2026',
    registration_code: 'BRA-X7K2M9-4FGH',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 555 123 4567',
    country: 'United States',
    occupation: 'Graphic Designer',
    experience: 'mid',
    portfolio: 'https://johndoe.design',
    how_heard: 'social_media',
    registered_at: '2026-01-03T14:30:00Z',
    status: 'registered',
  },
  {
    id: '2',
    contest_id: '1',
    contest_title: 'Brand Identity Challenge 2026',
    registration_code: 'BRA-P9R3K7-2XYZ',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+44 20 7946 0958',
    country: 'United Kingdom',
    occupation: 'Brand Designer',
    experience: 'senior',
    portfolio: 'https://janesmith.co.uk',
    how_heard: 'friend',
    registered_at: '2026-01-03T16:45:00Z',
    status: 'submitted',
  },
  {
    id: '3',
    contest_id: '1',
    contest_title: 'Brand Identity Challenge 2026',
    registration_code: 'BRA-M4N8Q2-9ABC',
    name: 'Ahmed Hassan',
    email: 'ahmed.h@email.com',
    phone: '+971 50 123 4567',
    country: 'United Arab Emirates',
    occupation: 'Creative Director',
    experience: 'lead',
    portfolio: 'https://ahmedhassan.design',
    how_heard: 'newsletter',
    registered_at: '2026-01-04T09:15:00Z',
    status: 'registered',
  },
];

const initialWinners: Winner[] = [];

const initialJobApplications: JobApplication[] = [
  {
    id: '1',
    career_id: '1',
    career_title: 'Senior UI/UX Designer',
    name: 'Emily Chen',
    email: 'emily.chen@email.com',
    phone: '+1 415 555 0123',
    resume_url: 'https://example.com/resumes/emily-chen.pdf',
    cover_letter: 'I am excited to apply for the Senior UI/UX Designer position...',
    portfolio_url: 'https://emilychen.design',
    applied_at: '2026-01-03T10:30:00Z',
    status: 'reviewing',
  },
  {
    id: '2',
    career_id: '1',
    career_title: 'Senior UI/UX Designer',
    name: 'Marcus Johnson',
    email: 'marcus.j@email.com',
    phone: '+1 312 555 0456',
    resume_url: 'https://example.com/resumes/marcus-johnson.pdf',
    portfolio_url: 'https://marcusjohnson.co',
    applied_at: '2026-01-02T15:45:00Z',
    status: 'pending',
  },
];

const initialGrantApplications: GrantApplication[] = [];

class OpportunitiesStore {
  private careers: CareerListing[] = initialCareers;
  private contests: Contest[] = initialContests;
  private grants: Grant[] = initialGrants;
  private contestRegistrations: ContestRegistration[] = initialRegistrations;
  private winners: Winner[] = initialWinners;
  private jobApplications: JobApplication[] = initialJobApplications;
  private grantApplications: GrantApplication[] = initialGrantApplications;
  private listeners: Set<() => void> = new Set();

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  getCareers() {
    return [...this.careers];
  }

  getCareerById(id: string) {
    return this.careers.find((c) => c.id === id);
  }

  addCareer(career: Omit<CareerListing, 'id'>) {
    const newCareer = { ...career, id: Date.now().toString() };
    this.careers = [newCareer, ...this.careers];
    this.notify();
    return newCareer;
  }

  updateCareer(id: string, updates: Partial<CareerListing>) {
    this.careers = this.careers.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.notify();
  }

  deleteCareer(id: string) {
    this.careers = this.careers.filter((c) => c.id !== id);
    this.notify();
  }

  getContests() {
    return [...this.contests];
  }

  getContestById(id: string) {
    return this.contests.find((c) => c.id === id);
  }

  getContestBySlug(slug: string) {
    return this.contests.find((c) => c.slug === slug);
  }

  addContest(contest: Omit<Contest, 'id'>) {
    const newContest = { ...contest, id: Date.now().toString() };
    this.contests = [newContest, ...this.contests];
    this.notify();
    return newContest;
  }

  updateContest(id: string, updates: Partial<Contest>) {
    this.contests = this.contests.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.notify();
  }

  deleteContest(id: string) {
    this.contests = this.contests.filter((c) => c.id !== id);
    this.notify();
  }

  getGrants() {
    return [...this.grants];
  }

  getGrantById(id: string) {
    return this.grants.find((g) => g.id === id);
  }

  addGrant(grant: Omit<Grant, 'id'>) {
    const newGrant = { ...grant, id: Date.now().toString() };
    this.grants = [newGrant, ...this.grants];
    this.notify();
    return newGrant;
  }

  updateGrant(id: string, updates: Partial<Grant>) {
    this.grants = this.grants.map((g) => (g.id === id ? { ...g, ...updates } : g));
    this.notify();
  }

  deleteGrant(id: string) {
    this.grants = this.grants.filter((g) => g.id !== id);
    this.notify();
  }

  getContestRegistrations(contestId?: string) {
    if (contestId) {
      return this.contestRegistrations.filter((r) => r.contest_id === contestId);
    }
    return [...this.contestRegistrations];
  }

  getRegistrationById(id: string) {
    return this.contestRegistrations.find((r) => r.id === id);
  }

  getRegistrationByCode(code: string) {
    return this.contestRegistrations.find((r) => r.registration_code === code);
  }

  addRegistration(registration: Omit<ContestRegistration, 'id'>) {
    const newReg = { ...registration, id: Date.now().toString() };
    this.contestRegistrations = [newReg, ...this.contestRegistrations];
    const contest = this.contests.find((c) => c.id === registration.contest_id);
    if (contest) {
      this.updateContest(contest.id, { entry_count: (contest.entry_count || 0) + 1 });
    }
    this.notify();
    return newReg;
  }

  updateRegistration(id: string, updates: Partial<ContestRegistration>) {
    this.contestRegistrations = this.contestRegistrations.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    );
    this.notify();
  }

  deleteRegistration(id: string) {
    const reg = this.contestRegistrations.find((r) => r.id === id);
    if (reg) {
      const contest = this.contests.find((c) => c.id === reg.contest_id);
      if (contest && contest.entry_count > 0) {
        this.updateContest(contest.id, { entry_count: contest.entry_count - 1 });
      }
    }
    this.contestRegistrations = this.contestRegistrations.filter((r) => r.id !== id);
    this.notify();
  }

  getWinners(contestId?: string) {
    if (contestId) {
      return this.winners.filter((w) => w.contest_id === contestId);
    }
    return [...this.winners];
  }

  addWinner(winner: Omit<Winner, 'id'>) {
    const newWinner = { ...winner, id: Date.now().toString() };
    this.winners = [newWinner, ...this.winners];
    this.notify();
    return newWinner;
  }

  getJobApplications(careerId?: string) {
    if (careerId) {
      return this.jobApplications.filter((a) => a.career_id === careerId);
    }
    return [...this.jobApplications];
  }

  updateJobApplication(id: string, updates: Partial<JobApplication>) {
    this.jobApplications = this.jobApplications.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    );
    this.notify();
  }

  getGrantApplications(grantId?: string) {
    if (grantId) {
      return this.grantApplications.filter((a) => a.grant_id === grantId);
    }
    return [...this.grantApplications];
  }

  addGrantApplication(application: Omit<GrantApplication, 'id'>) {
    const newApp = { ...application, id: Date.now().toString() };
    this.grantApplications = [newApp, ...this.grantApplications];
    this.notify();
    return newApp;
  }

  updateGrantApplication(id: string, updates: Partial<GrantApplication>) {
    this.grantApplications = this.grantApplications.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    );
    this.notify();
  }
}

export const opportunitiesStore = new OpportunitiesStore();
