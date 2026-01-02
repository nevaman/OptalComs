/*
  # Seed Sample Data for Optal Communications Portfolio

  ## Overview
  This migration populates the database with realistic sample content including:
  - 10 portfolio projects with Ethiopian and international relevance
  - 5 team members
  - 6 blog/insight articles
  - Global site settings

  ## Data Created
  - Projects spanning brand identity, web design, campaigns, and strategy
  - Team members representing different roles
  - Blog posts about design and branding
*/

-- Sample Projects
INSERT INTO projects (title, slug, year, industry, disciplines, tags, summary, services, outcomes, hero_image, thumbnail_image, hover_image, client_name, challenge, insight, solution, results, credits, is_published, is_featured, sort_order)
VALUES
(
  'Sheba Coffee Rebrand',
  'sheba-coffee-rebrand',
  2024,
  'Retail',
  ARRAY['Brand Identity', 'Packaging'],
  ARRAY['Coffee', 'FMCG', 'Ethiopia'],
  'Complete brand transformation for Ethiopia''s leading coffee exporter, positioning them for the international specialty market.',
  ARRAY['Brand Strategy', 'Visual Identity', 'Packaging Design', 'Brand Guidelines'],
  ARRAY['40% increase in export orders', 'Entry into 12 new markets', 'Premium positioning achieved'],
  'https://images.pexels.com/photos/4264049/pexels-photo-4264049.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/4264049/pexels-photo-4264049.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Sheba Coffee',
  'Sheba Coffee had 30 years of heritage but their brand felt dated and couldn''t compete in the specialty coffee market where Ethiopian origins command premium prices.',
  'The brand''s greatest asset was authenticity - real Ethiopian coffee farmers, real heritage, real quality. We needed to let that truth shine through modern design.',
  'We created a sophisticated visual system rooted in Ethiopian patterns and typography, with premium packaging that tells the story of origin while meeting international retail standards.',
  'The rebrand launched across 200+ retail locations and positioned Sheba as the authentic Ethiopian choice in specialty coffee.',
  '[{"name": "Dawit Bekele", "role": "Creative Director"}, {"name": "Sara Hailu", "role": "Brand Designer"}]',
  true,
  true,
  1
),
(
  'Addis Tech Hub Digital Platform',
  'addis-tech-hub',
  2024,
  'Technology',
  ARRAY['Web Design', 'Digital Products'],
  ARRAY['Tech', 'Startup', 'Platform'],
  'Designing the digital home for East Africa''s largest technology incubator and startup ecosystem.',
  ARRAY['UX Research', 'Web Design', 'Frontend Development', 'CMS Integration'],
  ARRAY['300% increase in applications', '45,000 monthly active users', 'Featured in TechCrunch'],
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Addis Tech Hub',
  'The hub needed a platform that could serve multiple audiences - startups seeking resources, investors looking for deals, and corporates exploring partnerships.',
  'Rather than building separate experiences, we designed a unified platform where these audiences naturally intersect and discover value.',
  'A dynamic web platform with personalized dashboards, event management, and community features that connect the ecosystem.',
  'The platform has become the central hub for East African tech, hosting 50+ events and connecting hundreds of startups with investors.',
  '[{"name": "Michael Chen", "role": "UX Lead"}, {"name": "Frehiwot Tadesse", "role": "Developer"}]',
  true,
  true,
  2
),
(
  'Ethiopian Airlines Anniversary Campaign',
  'ethiopian-airlines-anniversary',
  2023,
  'Travel',
  ARRAY['Campaign', 'Brand Identity'],
  ARRAY['Aviation', 'Anniversary', 'Africa'],
  'Celebrating 75 years of connecting Africa to the world with a pan-African campaign.',
  ARRAY['Campaign Strategy', 'Visual Identity', 'Digital Advertising', 'Print Collateral'],
  ARRAY['2.3M social impressions', 'Featured in international press', 'Record booking week'],
  'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Ethiopian Airlines',
  'Marking 75 years required celebrating heritage while positioning the airline as Africa''s modern, forward-looking carrier.',
  '75 years of Ethiopian Airlines isn''t just airline history - it''s the story of Africa''s rising connectivity and the continent''s emergence on the global stage.',
  'A multi-channel campaign showcasing 75 stories of connection across 75 African destinations, featuring real passengers and crew.',
  'The campaign generated unprecedented engagement and contributed to a record booking period.',
  '[{"name": "Dawit Bekele", "role": "Creative Director"}, {"name": "Yonas Assefa", "role": "Campaign Lead"}]',
  true,
  true,
  3
),
(
  'Dashen Bank Digital Transformation',
  'dashen-bank-digital',
  2023,
  'Finance',
  ARRAY['Web Design', 'Digital Products', 'Brand Identity'],
  ARRAY['Banking', 'Fintech', 'Mobile'],
  'Reimagining Ethiopia''s oldest private bank for the mobile-first generation.',
  ARRAY['Digital Strategy', 'App Design', 'Web Platform', 'Brand Refresh'],
  ARRAY['500K app downloads in 3 months', '40% digital transaction increase', 'Best Banking App 2023'],
  'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Dashen Bank',
  'With mobile money disrupting traditional banking, Dashen needed to rapidly modernize its digital presence while maintaining trust.',
  'Ethiopian consumers don''t need another mobile money app - they need a bank they can trust in their pocket.',
  'We designed a comprehensive digital ecosystem including mobile banking app, web platform, and refreshed visual identity.',
  'Dashen''s digital transformation established them as the most innovative traditional bank in the market.',
  '[{"name": "Sara Hailu", "role": "Lead Designer"}, {"name": "Frehiwot Tadesse", "role": "UX Designer"}]',
  true,
  true,
  4
),
(
  'Lalibela Heritage Foundation',
  'lalibela-heritage',
  2023,
  'Non-profit',
  ARRAY['Brand Identity', 'Web Design'],
  ARRAY['Heritage', 'UNESCO', 'Tourism'],
  'Creating a visual identity for the foundation protecting Ethiopia''s rock-hewn churches.',
  ARRAY['Brand Strategy', 'Visual Identity', 'Website Design', 'Fundraising Materials'],
  ARRAY['$2.1M raised in first year', 'Global press coverage', 'UNESCO partnership formalized'],
  'https://images.pexels.com/photos/5273044/pexels-photo-5273044.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/5273044/pexels-photo-5273044.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Lalibela Heritage Foundation',
  'The foundation needed credibility and visibility to attract international donors for urgent conservation work.',
  'Lalibela isn''t just Ethiopian heritage - it''s human heritage. The brand needed to speak to that universal significance.',
  'A dignified, internationally-minded identity that positions the foundation alongside major global heritage organizations.',
  'The new brand launched the foundation onto the international stage, securing major partnerships.',
  '[{"name": "Dawit Bekele", "role": "Creative Director"}, {"name": "Helen Girma", "role": "Strategist"}]',
  true,
  false,
  5
),
(
  'Tomoca Coffee Experience',
  'tomoca-coffee-experience',
  2024,
  'Hospitality',
  ARRAY['Brand Identity', 'Print'],
  ARRAY['Coffee', 'Hospitality', 'Retail'],
  'Evolving Addis Ababa''s legendary coffee house for a new generation while honoring 70 years of tradition.',
  ARRAY['Brand Evolution', 'Interior Signage', 'Menu Design', 'Merchandise'],
  ARRAY['25% increase in foot traffic', 'Successful franchise expansion', 'Featured in Monocle magazine'],
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Tomoca Coffee',
  'Tomoca is an Addis institution, but younger customers saw it as their grandparents'' coffee shop.',
  'The magic of Tomoca is the experience - the ritual, the aroma, the social gathering. We needed to celebrate this while making it relevant.',
  'A respectful brand evolution that modernizes without erasing, introducing contemporary touches while preserving beloved traditions.',
  'The refreshed Tomoca experience attracts new customers while longtime patrons feel their favorite spot has only gotten better.',
  '[{"name": "Sara Hailu", "role": "Lead Designer"}, {"name": "Dawit Bekele", "role": "Creative Direction"}]',
  true,
  false,
  6
),
(
  'Habesha Breweries Limited Edition',
  'habesha-breweries-limited',
  2023,
  'Retail',
  ARRAY['Packaging', 'Campaign'],
  ARRAY['Beverage', 'FMCG', 'Seasonal'],
  'Limited edition packaging celebrating Ethiopian cultural festivals.',
  ARRAY['Packaging Design', 'Campaign Strategy', 'Point of Sale Materials'],
  ARRAY['Sold out in 3 weeks', '15% sales lift during campaign', 'Award-winning packaging'],
  'https://images.pexels.com/photos/1269025/pexels-photo-1269025.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/1269025/pexels-photo-1269025.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Habesha Breweries',
  'Create collectible packaging that celebrates Ethiopian culture while driving seasonal sales.',
  'Limited editions work when they tell a story worth collecting. Ethiopian festivals offer rich visual narratives.',
  'A series of four limited edition designs, each celebrating a major Ethiopian festival with authentic artistic interpretation.',
  'The limited editions became collector items and established a successful annual tradition.',
  '[{"name": "Yonas Assefa", "role": "Art Director"}, {"name": "Sara Hailu", "role": "Illustrator"}]',
  true,
  false,
  7
),
(
  'Global Partners Investment Website',
  'global-partners-investment',
  2024,
  'Finance',
  ARRAY['Web Design'],
  ARRAY['Investment', 'B2B', 'Corporate'],
  'Professional web presence for a pan-African private equity firm.',
  ARRAY['Web Design', 'Content Strategy', 'Frontend Development'],
  ARRAY['60% increase in qualified leads', 'Improved investor confidence', 'Streamlined due diligence process'],
  'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Global Partners Investment',
  'The firm needed a digital presence that instills confidence while efficiently sharing deal information.',
  'Investment websites are often generic. Authentic storytelling about portfolio companies differentiates.',
  'A sophisticated platform showcasing portfolio companies, team expertise, and investment thesis with integrated deal room.',
  'The website has become a key tool for investor relations and deal sourcing.',
  '[{"name": "Frehiwot Tadesse", "role": "Developer"}, {"name": "Helen Girma", "role": "Content Strategy"}]',
  true,
  false,
  8
),
(
  'Entoto Natural Park Wayfinding',
  'entoto-natural-park',
  2023,
  'Hospitality',
  ARRAY['Brand Identity', 'Print'],
  ARRAY['Tourism', 'Environmental', 'Signage'],
  'Complete wayfinding and signage system for Addis Ababa''s premier urban nature reserve.',
  ARRAY['Wayfinding Strategy', 'Signage Design', 'Environmental Graphics', 'Map Design'],
  ARRAY['Improved visitor experience', '30% reduction in lost visitors', 'Sustainable material implementation'],
  'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Addis Ababa City Parks',
  'The park lacked cohesive navigation, with visitors often lost and missing key attractions.',
  'Good wayfinding is invisible when it works. The system needed to guide without intruding on the natural experience.',
  'A comprehensive signage system using sustainable materials and bilingual content (Amharic/English) that blends with the environment.',
  'The wayfinding system transformed visitor experience and supported the park''s conservation mission.',
  '[{"name": "Sara Hailu", "role": "Lead Designer"}, {"name": "Dawit Bekele", "role": "Creative Direction"}]',
  true,
  false,
  9
),
(
  'Addis Restaurant Group',
  'addis-restaurant-group',
  2024,
  'Hospitality',
  ARRAY['Brand Identity', 'Web Design'],
  ARRAY['F&B', 'Hospitality', 'Multi-brand'],
  'Unified brand architecture for a restaurant group spanning fine dining to casual concepts.',
  ARRAY['Brand Architecture', 'Visual Identity', 'Menu Design', 'Website'],
  ARRAY['Successful launch of 3 new concepts', 'Consistent brand experience', 'Investor-ready presentation'],
  'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Addis Restaurant Group',
  'Managing multiple restaurant brands without a cohesive strategy was diluting the group''s market presence.',
  'Each restaurant needs its own personality, but the group benefits from visible connection and shared values.',
  'A flexible brand architecture allowing individual restaurant identities while establishing clear group association.',
  'The unified approach supported successful expansion and attracted investment interest.',
  '[{"name": "Dawit Bekele", "role": "Creative Director"}, {"name": "Sara Hailu", "role": "Designer"}, {"name": "Helen Girma", "role": "Strategist"}]',
  true,
  true,
  10
);

-- Sample Team Members
INSERT INTO team_members (name, role, bio, photo_url, linkedin_url, twitter_url, email, is_visible, sort_order)
VALUES
(
  'Dawit Bekele',
  'Founder & Creative Director',
  'Dawit founded Optal after a decade leading brand projects at international agencies in London and Nairobi. He brings Ethiopian design sensibility to global standards, with work recognized by D&AD and the Type Directors Club.',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://linkedin.com',
  'https://twitter.com',
  'dawit@optal.co',
  true,
  1
),
(
  'Sara Hailu',
  'Senior Designer',
  'Sara specializes in brand identity and packaging design. Before Optal, she worked with leading Ethiopian brands and completed her MFA at Central Saint Martins. Her work balances Ethiopian aesthetics with contemporary design.',
  'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://linkedin.com',
  null,
  'sara@optal.co',
  true,
  2
),
(
  'Frehiwot Tadesse',
  'Lead Developer',
  'Frehiwot bridges design and technology, building digital experiences that work as beautifully as they look. She previously led engineering at a Nairobi-based fintech before joining Optal.',
  'https://images.pexels.com/photos/3776239/pexels-photo-3776239.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://linkedin.com',
  'https://twitter.com',
  'frehiwot@optal.co',
  true,
  3
),
(
  'Helen Girma',
  'Strategy Director',
  'Helen ensures every creative decision is grounded in strategic thinking. With a background in brand consulting and an MBA from INSEAD, she helps clients connect design to business outcomes.',
  'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://linkedin.com',
  null,
  'helen@optal.co',
  true,
  4
),
(
  'Yonas Assefa',
  'Art Director',
  'Yonas brings campaigns to life through illustration, motion, and art direction. His distinctive style draws from Ethiopian traditional art while speaking to contemporary audiences.',
  'https://images.pexels.com/photos/2406949/pexels-photo-2406949.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://linkedin.com',
  'https://twitter.com',
  'yonas@optal.co',
  true,
  5
);

-- Sample Insights/Blog Posts
INSERT INTO insights (title, slug, excerpt, content, featured_image, tags, is_published, is_featured, published_at)
VALUES
(
  'Why Ethiopian Brands Should Think Global From Day One',
  'ethiopian-brands-think-global',
  'The global market is more accessible than ever, and Ethiopian brands have unique advantages they''re not fully leveraging.',
  '[{"type": "paragraph", "text": "When we work with Ethiopian clients, we often hear the same concern: We need to establish ourselves locally before thinking about international markets. This thinking, while understandable, may be holding Ethiopian brands back from their true potential."}, {"type": "heading", "text": "The Digital Border Has Disappeared"}, {"type": "paragraph", "text": "Thanks to e-commerce and digital marketing, a brand in Addis Ababa can reach customers in Berlin or San Francisco as easily as in Bahir Dar. The question isn''t whether you can reach global markets - it''s whether your brand is ready for them."}, {"type": "paragraph", "text": "Ethiopian brands have something many global competitors lack: authenticity. Ethiopian coffee, textiles, and craftsmanship carry genuine cultural heritage that international consumers increasingly value."}, {"type": "heading", "text": "Building for Scale"}, {"type": "paragraph", "text": "This doesn''t mean every Ethiopian business should immediately target international markets. But it does mean that brand foundations - visual identity, messaging, digital presence - should be built to global standards from the start."}]',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600',
  ARRAY['Strategy', 'Branding', 'Ethiopia'],
  true,
  true,
  NOW() - INTERVAL '3 days'
),
(
  'The Case for Editorial Design in Digital Spaces',
  'editorial-design-digital-spaces',
  'What magazine design principles can teach us about creating more engaging digital experiences.',
  '[{"type": "paragraph", "text": "Scroll through most business websites and you''ll find the same patterns: hero image, three-column feature grid, testimonial carousel, contact form. Functional, yes. Memorable? Rarely."}, {"type": "paragraph", "text": "Magazine designers have spent decades perfecting the art of engaging readers - creating visual hierarchy, managing pace, building anticipation. These principles translate powerfully to digital spaces, yet most web design ignores them entirely."}, {"type": "heading", "text": "Lessons from Print"}, {"type": "paragraph", "text": "Consider how magazines use whitespace not as emptiness but as a design element. How typography creates rhythm and emphasis. How spreads alternate between dense information and visual breathing room."}, {"type": "paragraph", "text": "These techniques, applied thoughtfully to web design, create experiences that feel considered rather than templated - memorable rather than merely functional."}]',
  'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=1600',
  ARRAY['Design', 'Digital', 'Typography'],
  true,
  false,
  NOW() - INTERVAL '1 week'
),
(
  'Brand Strategy for Startups: When to Invest',
  'brand-strategy-startups-when-invest',
  'Most startups skip formal brand strategy. Here''s when that''s fine, and when it''s a costly mistake.',
  '[{"type": "paragraph", "text": "We regularly talk to startup founders who want to ''do branding properly'' but aren''t sure if they''re ready. It''s a valid concern - premature investment in brand can drain resources needed elsewhere."}, {"type": "heading", "text": "The Right Time to Invest"}, {"type": "paragraph", "text": "Brand strategy becomes valuable when you''re ready to scale beyond your initial customer base. If your growth depends on reaching people who don''t already know you, brand becomes critical."}, {"type": "paragraph", "text": "The early-stage founder can usually convey brand through personal presence. But that doesn''t scale. At some point, your brand needs to speak for itself."}, {"type": "heading", "text": "Start With Strategy"}, {"type": "paragraph", "text": "When you do invest, start with strategy before jumping to visual design. Understanding your positioning, audience, and message prevents costly redesigns later."}]',
  'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1600',
  ARRAY['Strategy', 'Startups', 'Branding'],
  true,
  false,
  NOW() - INTERVAL '2 weeks'
),
(
  'Typography as Brand: Beyond the Logo',
  'typography-as-brand',
  'How typographic choices shape brand perception in ways most businesses overlook.',
  '[{"type": "paragraph", "text": "When businesses think about brand identity, they usually focus on the logo. But typography often has a greater impact on how your brand feels day-to-day."}, {"type": "paragraph", "text": "Your logo might appear on business cards and websites. Your typography appears everywhere - emails, documents, presentations, signage. It''s the constant visual thread that ties your communications together."}, {"type": "heading", "text": "Choosing Type Thoughtfully"}, {"type": "paragraph", "text": "Typography choice isn''t about personal preference - it''s about strategic fit. A law firm and a tech startup need different typographic voices, even if both want to appear ''modern and professional''."}, {"type": "paragraph", "text": "The details matter: letter-spacing, line-height, weight hierarchy. These subtle choices accumulate to create either a cohesive brand experience or visual noise."}]',
  'https://images.pexels.com/photos/5412270/pexels-photo-5412270.jpeg?auto=compress&cs=tinysrgb&w=1600',
  ARRAY['Typography', 'Design', 'Branding'],
  true,
  false,
  NOW() - INTERVAL '3 weeks'
),
(
  'Working With Remote Design Teams: A Client Guide',
  'working-remote-design-teams',
  'Practical advice for getting the best results when your design team is halfway around the world.',
  '[{"type": "paragraph", "text": "More businesses are working with design teams across borders. The good news: you can access exceptional talent regardless of location. The challenge: remote collaboration requires different practices than in-person work."}, {"type": "heading", "text": "Communication Is Everything"}, {"type": "paragraph", "text": "Remote projects fail when communication fails. Establish clear channels, regular check-ins, and documentation practices from the start."}, {"type": "paragraph", "text": "Async communication often works better than trying to schedule frequent calls across time zones. Tools like Loom for video feedback can bridge the gap effectively."}, {"type": "heading", "text": "Trust the Process"}, {"type": "paragraph", "text": "Resist the urge to micromanage. If you''ve chosen a good team, give them space to work. Frequent interruptions for ''quick checks'' usually slow everyone down."}]',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1600',
  ARRAY['Process', 'Remote Work', 'Client Relations'],
  true,
  false,
  NOW() - INTERVAL '1 month'
),
(
  'The Hidden Cost of Template Websites',
  'hidden-cost-template-websites',
  'Template websites seem like a bargain. Here''s what they actually cost your business.',
  '[{"type": "paragraph", "text": "When budget is tight, template websites are tempting. For a few hundred dollars, you can have something online quickly. But the real cost extends far beyond the purchase price."}, {"type": "heading", "text": "The Differentiation Problem"}, {"type": "paragraph", "text": "When you use a popular template, your business looks like thousands of others. You''re actively working against differentiation - the very thing that makes brands memorable."}, {"type": "paragraph", "text": "Your competitors may be using the same template. Are you comfortable looking interchangeable with them?"}, {"type": "heading", "text": "Technical Debt"}, {"type": "paragraph", "text": "Templates come with limitations. As your business grows, you''ll hit walls - features you can''t add, performance you can''t improve, customizations you can''t make. Eventually, you''ll need to rebuild anyway."}, {"type": "paragraph", "text": "Sometimes a template is genuinely the right choice for early-stage businesses. But go in with clear eyes about the tradeoffs."}]',
  'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1600',
  ARRAY['Web Design', 'Strategy', 'Business'],
  true,
  false,
  NOW() - INTERVAL '5 weeks'
);

-- Global Settings
INSERT INTO global_settings (key, value)
VALUES
(
  'site_settings',
  '{"studio_name": "Optal Communications", "tagline": "Ethiopian creatives, global clients", "email": "hello@optal.co", "phone": "+251 91 234 5678", "address": "Addis Ababa, Ethiopia", "social_linkedin": "https://linkedin.com/company/optalcomms", "social_twitter": "https://twitter.com/optalcomms", "social_instagram": "https://instagram.com/optalcomms", "social_behance": "https://behance.net/optalcomms", "footer_text": "Ethiopian creatives serving global clients. We craft distinctive brand identities and digital experiences."}'
);