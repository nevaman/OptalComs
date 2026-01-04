/*
  # Seed Sample Opportunities

  Seeds sample job listings, contests, and grants for the Opportunities page.
  This provides real data for the public-facing page and admin panel.

  1. Jobs - Internal and external career opportunities
  2. Contests - Creative challenges with prizes
  3. Grants - Funding opportunities for creative projects
*/

-- Sample Job Listings
INSERT INTO opportunities (type, title, slug, description, requirements, location, status, external_link, metadata, is_featured)
VALUES
(
  'job',
  'Senior UI/UX Designer',
  'senior-ui-ux-designer',
  'We are looking for a Senior UI/UX Designer to lead design initiatives and create exceptional user experiences. You will work closely with product and engineering teams to define and implement innovative solutions.',
  ARRAY[
    '5+ years of experience in UI/UX design',
    'Strong portfolio demonstrating user-centered design process',
    'Proficiency in Figma and design systems',
    'Experience with user research and usability testing',
    'Excellent communication and collaboration skills'
  ],
  'Remote (US/EU)',
  'open',
  NULL,
  jsonb_build_object(
    'company', 'Optal Creative',
    'employment_type', 'full-time',
    'experience_level', 'senior',
    'salary_range', '$120k - $160k',
    'benefits', ARRAY['Health Insurance', 'Remote Work', 'Learning Budget', 'Flexible Hours'],
    'is_internal', true,
    'category', 'Design'
  ),
  true
),
(
  'job',
  'Motion Graphics Designer',
  'motion-graphics-designer',
  'Join our creative team as a Motion Graphics Designer to create compelling animations and visual effects for our clients digital campaigns and brand content.',
  ARRAY[
    '3+ years of motion design experience',
    'Expert in After Effects and Cinema 4D',
    'Strong understanding of animation principles',
    'Ability to work on multiple projects simultaneously',
    'Creative problem-solving skills'
  ],
  'Remote',
  'open',
  NULL,
  jsonb_build_object(
    'company', 'Optal Creative',
    'employment_type', 'full-time',
    'experience_level', 'mid',
    'salary_range', '$80k - $110k',
    'benefits', ARRAY['Health Insurance', 'Remote Work', 'Equipment Allowance'],
    'is_internal', true,
    'category', 'Design'
  ),
  false
),
(
  'job',
  'Full Stack Developer',
  'full-stack-developer',
  'We are seeking a talented Full Stack Developer to build and maintain web applications. You will work with modern technologies to create scalable solutions for our diverse client base.',
  ARRAY[
    '4+ years of full-stack development experience',
    'Proficiency in React, TypeScript, and Node.js',
    'Experience with PostgreSQL and cloud services',
    'Strong understanding of software design patterns',
    'Excellent debugging and problem-solving skills'
  ],
  'Lagos, Nigeria',
  'open',
  NULL,
  jsonb_build_object(
    'company', 'Optal Creative',
    'employment_type', 'full-time',
    'experience_level', 'mid',
    'salary_range', '$60k - $90k',
    'benefits', ARRAY['Health Insurance', 'Hybrid Work', 'Training Budget'],
    'is_internal', true,
    'category', 'Engineering'
  ),
  true
),
(
  'job',
  'Brand Strategist',
  'brand-strategist-agency',
  'Leading creative agency seeking a Brand Strategist to develop compelling brand narratives and positioning strategies for major clients.',
  ARRAY[
    '5+ years in brand strategy or related field',
    'Experience with market research and consumer insights',
    'Strong presentation and storytelling skills',
    'Track record of successful brand campaigns'
  ],
  'New York, NY',
  'open',
  'https://example.com/careers/brand-strategist',
  jsonb_build_object(
    'company', 'Creative Partners Agency',
    'employment_type', 'full-time',
    'experience_level', 'senior',
    'salary_range', '$100k - $140k',
    'benefits', ARRAY['401k', 'Health Insurance', 'Bonus Structure'],
    'is_internal', false,
    'category', 'Strategy'
  ),
  false
),
(
  'job',
  'Junior Graphic Designer',
  'junior-graphic-designer',
  'Entry-level position for a creative individual looking to grow their design career. You will work alongside senior designers on branding and marketing projects.',
  ARRAY[
    '1-2 years of design experience or strong portfolio',
    'Proficiency in Adobe Creative Suite',
    'Basic understanding of typography and color theory',
    'Eagerness to learn and receive feedback'
  ],
  'Remote',
  'open',
  NULL,
  jsonb_build_object(
    'company', 'Optal Creative',
    'employment_type', 'full-time',
    'experience_level', 'entry',
    'salary_range', '$45k - $55k',
    'benefits', ARRAY['Health Insurance', 'Remote Work', 'Mentorship Program'],
    'is_internal', true,
    'category', 'Design'
  ),
  false
);

-- Sample Contests
INSERT INTO opportunities (type, title, slug, description, requirements, deadline, status, external_link, metadata, is_featured)
VALUES
(
  'contest',
  'Brand Identity Challenge 2026',
  'brand-identity-challenge-2026',
  'Design a complete brand identity for a fictional sustainable fashion startup. Show us your creative vision from logo to brand guidelines.',
  ARRAY[
    'Complete logo design with variations',
    'Color palette and typography selection',
    'Brand guidelines document (minimum 10 pages)',
    'Application mockups (minimum 5 items)',
    'Original work only - no AI-generated content'
  ],
  '2026-02-28T23:59:59Z',
  'open',
  NULL,
  jsonb_build_object(
    'category', 'design',
    'start_date', '2026-01-15T00:00:00Z',
    'end_date', '2026-02-28T23:59:59Z',
    'results_date', '2026-03-15T00:00:00Z',
    'telegram_channel', 'https://t.me/optalcontests',
    'prizes', jsonb_build_array(
      jsonb_build_object('place', '1st Place', 'reward', '$3,000', 'description', 'Plus featured portfolio spotlight'),
      jsonb_build_object('place', '2nd Place', 'reward', '$1,500', 'description', 'Plus Figma license (1 year)'),
      jsonb_build_object('place', '3rd Place', 'reward', '$500', 'description', 'Plus design resources bundle')
    ),
    'judges', jsonb_build_array(
      jsonb_build_object('name', 'Sarah Chen', 'title', 'Creative Director, Optal'),
      jsonb_build_object('name', 'Marcus Williams', 'title', 'Brand Consultant'),
      jsonb_build_object('name', 'Elena Rodriguez', 'title', 'Design Lead, TechCorp')
    ),
    'timeline', jsonb_build_array(
      jsonb_build_object('stage', 'Registration Opens', 'date', '2026-01-15'),
      jsonb_build_object('stage', 'Submission Deadline', 'date', '2026-02-28'),
      jsonb_build_object('stage', 'Judging Period', 'date', '2026-03-01'),
      jsonb_build_object('stage', 'Winners Announced', 'date', '2026-03-15')
    ),
    'entry_count', 0
  ),
  true
),
(
  'contest',
  'Motion Design Showdown',
  'motion-design-showdown',
  'Create a 30-second animated intro for our fictional streaming platform "StreamVerse". Show your motion design skills and creativity.',
  ARRAY[
    '30-second animation (1920x1080 or 4K)',
    'Include the StreamVerse logo animation',
    'Background music/sound design encouraged',
    'Submit as MP4 or MOV format',
    'Project files must be provided if selected as winner'
  ],
  '2026-03-31T23:59:59Z',
  'open',
  NULL,
  jsonb_build_object(
    'category', 'mixed',
    'start_date', '2026-02-01T00:00:00Z',
    'end_date', '2026-03-31T23:59:59Z',
    'results_date', '2026-04-15T00:00:00Z',
    'telegram_channel', 'https://t.me/optalcontests',
    'prizes', jsonb_build_array(
      jsonb_build_object('place', '1st Place', 'reward', '$5,000', 'description', 'Plus After Effects plugins bundle'),
      jsonb_build_object('place', '2nd Place', 'reward', '$2,000', 'description', 'Plus Cinema 4D license'),
      jsonb_build_object('place', '3rd Place', 'reward', '$1,000', 'description', 'Plus motion design course')
    ),
    'timeline', jsonb_build_array(
      jsonb_build_object('stage', 'Contest Opens', 'date', '2026-02-01'),
      jsonb_build_object('stage', 'Submission Deadline', 'date', '2026-03-31'),
      jsonb_build_object('stage', 'Winners Announced', 'date', '2026-04-15')
    ),
    'entry_count', 0
  ),
  true
),
(
  'contest',
  'UI Redesign Challenge',
  'ui-redesign-challenge',
  'Redesign the user interface of a popular productivity app. Focus on improving usability while maintaining brand recognition.',
  ARRAY[
    'Complete UI redesign (minimum 8 screens)',
    'Interactive prototype (Figma or similar)',
    'Design rationale document',
    'Before/after comparison',
    'Responsive design considerations'
  ],
  '2026-01-31T23:59:59Z',
  'open',
  NULL,
  jsonb_build_object(
    'category', 'design',
    'start_date', '2026-01-01T00:00:00Z',
    'end_date', '2026-01-31T23:59:59Z',
    'results_date', '2026-02-10T00:00:00Z',
    'prizes', jsonb_build_array(
      jsonb_build_object('place', '1st Place', 'reward', '$2,500', 'description', 'Plus design tool subscriptions'),
      jsonb_build_object('place', '2nd Place', 'reward', '$1,000', 'description', ''),
      jsonb_build_object('place', '3rd Place', 'reward', '$500', 'description', '')
    ),
    'entry_count', 0
  ),
  false
);

-- Sample Grants
INSERT INTO opportunities (type, title, slug, description, requirements, deadline, status, external_link, metadata, is_featured)
VALUES
(
  'grant',
  'Creative Innovation Grant',
  'creative-innovation-grant',
  'Funding for innovative creative projects that push boundaries in design, technology, or storytelling. We support bold ideas that challenge conventions.',
  ARRAY[
    'Detailed project proposal (3-5 pages)',
    'Budget breakdown and timeline',
    'Portfolio of previous work',
    'Two professional references',
    'Video pitch (optional but recommended)'
  ],
  '2026-03-15T23:59:59Z',
  'open',
  NULL,
  jsonb_build_object(
    'organization', 'Optal Communications',
    'amount_min', 5000,
    'amount_max', 25000,
    'focus_areas', ARRAY['Digital Art', 'Interactive Design', 'Creative Technology', 'Experimental Media'],
    'eligibility', ARRAY['Open to individuals and small teams', 'Must be 18+ years old', 'Project must be completed within 12 months', 'Work must be original and not previously funded'],
    'application_process', ARRAY['Submit application form', 'Initial review (2 weeks)', 'Interview with selection committee', 'Final decision notification'],
    'category', 'creative',
    'funding_type', 'grant'
  ),
  true
),
(
  'grant',
  'Emerging Artist Fellowship',
  'emerging-artist-fellowship',
  'A fellowship program for early-career artists and designers looking to develop their practice and build a sustainable creative career.',
  ARRAY[
    'Artist statement and bio',
    'Portfolio (10-20 pieces)',
    'Proposed development plan',
    'Letter of recommendation'
  ],
  '2026-04-30T23:59:59Z',
  'open',
  NULL,
  jsonb_build_object(
    'organization', 'Optal Foundation',
    'amount_min', 10000,
    'amount_max', 15000,
    'focus_areas', ARRAY['Visual Arts', 'Graphic Design', 'Illustration', 'Digital Media'],
    'eligibility', ARRAY['Less than 5 years professional experience', 'Based in Africa or working with African themes', 'Commitment to mentorship program'],
    'application_process', ARRAY['Online application', 'Portfolio review', 'Virtual interview', 'Selection announcement'],
    'category', 'creative',
    'funding_type', 'fellowship'
  ),
  true
),
(
  'grant',
  'Tech for Good Grant',
  'tech-for-good-grant',
  'Supporting technology projects that address social challenges and create positive community impact.',
  ARRAY[
    'Project proposal with impact metrics',
    'Technical implementation plan',
    'Team qualifications',
    'Sustainability plan post-funding'
  ],
  '2026-02-28T23:59:59Z',
  'open',
  'https://example.com/grants/tech-for-good',
  jsonb_build_object(
    'organization', 'Global Tech Foundation',
    'amount_min', 15000,
    'amount_max', 50000,
    'focus_areas', ARRAY['Education Technology', 'Healthcare Solutions', 'Environmental Tech', 'Accessibility'],
    'eligibility', ARRAY['Registered non-profit or social enterprise', 'Demonstrated community need', 'Technical feasibility'],
    'application_process', ARRAY['Expression of interest', 'Full proposal submission', 'Due diligence review', 'Grant agreement'],
    'category', 'technology',
    'funding_type', 'grant'
  ),
  false
);