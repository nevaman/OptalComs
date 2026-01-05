-- Seed Careers
INSERT INTO careers (id, title, company, location, type, experience_level, salary_range, description, requirements, benefits, is_internal, posted_at, is_featured, category)
VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Senior UI/UX Designer', 'Optal Creative', 'Remote', 'full-time', 'senior', '$90k - $120k', 'We are looking for a Senior UI/UX Designer to join our growing team and help shape the future of digital experiences for our clients.', ARRAY['5+ years of UI/UX design experience', 'Strong Figma proficiency', 'Experience with design systems', 'Excellent communication skills'], ARRAY['Remote work flexibility', 'Health insurance', 'Professional development budget', 'Unlimited PTO'], true, '2026-01-02T10:00:00Z', true, 'Design'),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Brand Strategist', 'Optal Creative', 'Addis Ababa, Ethiopia', 'full-time', 'mid', 'Competitive', 'Join our strategy team to develop compelling brand narratives and positioning for clients across various industries.', ARRAY['3+ years in brand strategy', 'Strong research skills', 'Presentation abilities'], ARRAY['Hybrid work', 'Training programs', 'Team retreats'], true, '2026-01-01T09:00:00Z', false, 'Strategy'),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Communications Manager', 'TechCorp Inc', 'New York, NY', 'full-time', 'senior', '$100k - $140k', 'Lead communications strategy for a fast-growing tech company.', ARRAY['7+ years experience', 'Tech industry background', 'Crisis communications experience'], ARRAY['Equity package', 'Premium healthcare', '401k matching'], false, '2025-12-28T09:00:00Z', false, 'Marketing');

-- Seed Contests
INSERT INTO contests (id, title, slug, category, description, brief, prizes, judges, timeline, requirements, submission_guidelines, eligibility, sponsors, status, entry_count, start_date, end_date, results_date, is_featured, telegram_channel)
VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0861', 'Brand Identity Challenge 2026', 'brand-identity-challenge-2026', 'design', 'Create a complete brand identity system for a fictional sustainable fashion startup. Show us your vision for the future of ethical fashion branding.', 'Design a comprehensive brand identity including logo, color palette, typography, and brand guidelines for "EcoThread" - a sustainable fashion brand targeting Gen Z consumers.',
'[{"place": "1st Place", "reward": "$5,000", "description": "Plus mentorship session with industry leaders"}, {"place": "2nd Place", "reward": "$2,500", "description": "Plus premium design tool subscriptions"}, {"place": "3rd Place", "reward": "$1,000", "description": "Plus feature in our Insights publication"}]'::jsonb,
'[{"name": "Sarah Chen", "title": "Creative Director, Brand Studio"}, {"name": "Michael Torres", "title": "Head of Design, TechCorp"}, {"name": "Emma Williams", "title": "Founder, Design Collective"}]'::jsonb,
'[{"stage": "Registration Opens", "date": "2026-01-01"}, {"stage": "Submissions Open", "date": "2026-01-15"}, {"stage": "Submissions Close", "date": "2026-02-15"}, {"stage": "Winners Announced", "date": "2026-03-01"}]'::jsonb,
ARRAY['Logo design (multiple variations)', 'Color palette with rationale', 'Typography system', 'Brand guidelines document', 'Three mockup applications'],
ARRAY['Submit as a single PDF (max 20 pages)', 'Include a 200-word design rationale', 'All work must be original', 'No AI-generated content'],
ARRAY['Open to designers worldwide', 'Must be 18 years or older', 'Individual or team entries accepted'],
'[{"name": "Figma"}, {"name": "Adobe"}]'::jsonb,
'open', 247, '2026-01-15T00:00:00Z', '2026-02-15T23:59:59Z', '2026-03-01T12:00:00Z', true, 'https://t.me/optalcontests'),
('d290f1ee-6c54-4b01-90e6-d701748f0862', 'Motion Design Showdown', 'motion-design-showdown', 'design', 'Show off your animation skills in this exciting motion design competition.', 'Create a 15-30 second motion graphics piece that tells a story about innovation and progress.',
'[{"place": "1st Place", "reward": "$3,000"}, {"place": "2nd Place", "reward": "$1,500"}]'::jsonb,
'[{"name": "Alex Rivera", "title": "Motion Director"}]'::jsonb,
'[{"stage": "Registration Opens", "date": "2026-02-01"}, {"stage": "Submissions Close", "date": "2026-03-15"}]'::jsonb,
ARRAY['15-30 second video', 'MP4 format', 'Original audio or licensed music'],
ARRAY['Upload to designated platform', 'Include project files'],
ARRAY['Open worldwide', 'Professional and student categories'],
'[]'::jsonb,
'upcoming', 0, '2026-02-01T00:00:00Z', '2026-03-15T23:59:59Z', NULL, false, NULL);

-- Seed Grants
INSERT INTO grants (id, title, organization, amount_min, amount_max, description, focus_areas, eligibility, requirements, application_process, deadline, status, is_featured, category, funding_type, posted_at, external_link)
VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0871', 'Creative Innovation Fund', 'National Arts Foundation', 10000, 50000, 'Supporting innovative creative projects that push the boundaries of art, design, and technology.', ARRAY['Digital Art', 'Interactive Media', 'Cross-disciplinary Projects'], ARRAY['Individual artists', 'Emerging creatives', 'Non-profit organizations'], ARRAY['Project proposal', 'Portfolio', 'Budget breakdown', 'Timeline'], ARRAY['Submit online application', 'Panel review', 'Interview for finalists'], '2026-03-15T23:59:59Z', 'open', true, 'creative', 'grant', '2026-01-01T10:00:00Z', 'https://example.com/grants/creative-innovation'),
('d290f1ee-6c54-4b01-90e6-d701748f0872', 'Tech for Good Fellowship', 'Impact Foundation', 25000, 75000, 'A 12-month fellowship for technologists working on solutions to social and environmental challenges.', ARRAY['Climate Tech', 'Healthcare Access', 'Education Technology'], ARRAY['Tech professionals', '5+ years experience', 'Committed to social impact'], ARRAY['Application essay', 'Project concept', 'References'], ARRAY['Application review', 'Virtual interview', 'Demo day'], '2026-02-28T23:59:59Z', 'open', false, 'technology', 'fellowship', '2025-12-15T10:00:00Z', NULL);

-- Seed Contest Registrations
INSERT INTO contest_registrations (contest_id, registration_code, name, email, phone, country, occupation, experience, portfolio, how_heard, registered_at, status)
VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0861', 'BRA-X7K2M9-4FGH', 'John Doe', 'john.doe@email.com', '+1 555 123 4567', 'United States', 'Graphic Designer', 'mid', 'https://johndoe.design', 'social_media', '2026-01-03T14:30:00Z', 'registered'),
('d290f1ee-6c54-4b01-90e6-d701748f0861', 'BRA-P9R3K7-2XYZ', 'Jane Smith', 'jane.smith@email.com', '+44 20 7946 0958', 'United Kingdom', 'Brand Designer', 'senior', 'https://janesmith.co.uk', 'friend', '2026-01-03T16:45:00Z', 'submitted'),
('d290f1ee-6c54-4b01-90e6-d701748f0861', 'BRA-M4N8Q2-9ABC', 'Ahmed Hassan', 'ahmed.h@email.com', '+971 50 123 4567', 'United Arab Emirates', 'Creative Director', 'lead', 'https://ahmedhassan.design', 'newsletter', '2026-01-04T09:15:00Z', 'registered');

-- Seed Job Applications
INSERT INTO job_applications (career_id, name, email, phone, resume_url, cover_letter, portfolio_url, applied_at, status)
VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Emily Chen', 'emily.chen@email.com', '+1 415 555 0123', 'https://example.com/resumes/emily-chen.pdf', 'I am excited to apply for the Senior UI/UX Designer position...', 'https://emilychen.design', '2026-01-03T10:30:00Z', 'reviewing'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Marcus Johnson', 'marcus.j@email.com', '+1 312 555 0456', 'https://example.com/resumes/marcus-johnson.pdf', NULL, 'https://marcusjohnson.co', '2026-01-02T15:45:00Z', 'pending');

