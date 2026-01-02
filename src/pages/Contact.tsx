import { useState, FormEvent } from 'react';
import { Send, Check, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const budgetOptions = [
  { value: '', label: 'Select budget range' },
  { value: '$500-$2k', label: '$500 - $2,000' },
  { value: '$2k-$5k', label: '$2,000 - $5,000' },
  { value: '$5k-$10k', label: '$5,000 - $10,000' },
  { value: '$10k+', label: '$10,000+' },
];

const projectTypeOptions = [
  { value: '', label: 'Select project type' },
  { value: 'Brand Identity', label: 'Brand Identity' },
  { value: 'Web Design', label: 'Web Design & Development' },
  { value: 'Campaign', label: 'Campaign & Content' },
  { value: 'Print', label: 'Print & Packaging' },
  { value: 'Strategy', label: 'Strategy & Consulting' },
  { value: 'Other', label: 'Other' },
];

const faqs = [
  {
    question: 'What is your typical timeline?',
    answer:
      'Timelines vary by project scope. Brand identity projects typically take 4-8 weeks, while websites can take 6-12 weeks. We will provide a detailed timeline during our initial consultation.',
  },
  {
    question: 'Do you work with international clients?',
    answer:
      'We work with clients globally. Most of our communication happens via video calls and collaborative tools, making remote collaboration seamless.',
  },
  {
    question: 'What is your payment structure?',
    answer:
      'We typically work with a 50% deposit to begin, with the remaining balance due upon project completion. For larger projects, we can arrange milestone-based payments.',
  },
  {
    question: 'Can you work within my budget?',
    answer:
      'We\'re transparent about pricing and will let you know early if a project isn\'t a fit. We can often adjust scope to work within budget constraints.',
  },
];

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget_range: '',
    project_type: '',
    message: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { error: submitError } = await supabase.from('contact_submissions').insert([formData]);

    if (submitError) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isSubmitted) {
    return (
      <div className="section-padding">
        <div className="container-grid">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-surface" />
            </div>
            <h1 className="text-3xl md:text-4xl">Thank you for reaching out</h1>
            <p className="text-neutral-mid mt-4">
              We've received your message and will get back to you within 24-48 hours.
            </p>
            <Button href="/" variant="secondary" className="mt-8">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="section-padding">
        <div className="container-grid">
          <div className="grid-12">
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <p className="caption mb-4">Contact</p>
              <h1 className="text-4xl md:text-5xl">Let's build something great together</h1>
              <p className="text-lg text-neutral-mid mt-6">
                Tell us about your project, and we'll get back to you within 24-48 hours.
              </p>

              <div className="mt-12 space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-neutral-mid font-medium mb-2">
                    Email
                  </h3>
                  <a
                    href="mailto:hello@optal.co"
                    className="text-lg font-medium hover:text-orange transition-colors"
                  >
                    hello@optal.co
                  </a>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider text-neutral-mid font-medium mb-2">
                    Phone
                  </h3>
                  <a
                    href="tel:+251912345678"
                    className="text-lg font-medium hover:text-orange transition-colors"
                  >
                    +251 91 234 5678
                  </a>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider text-neutral-mid font-medium mb-2">
                    Location
                  </h3>
                  <p className="text-lg">Addis Ababa, Ethiopia</p>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <a
                  href="https://wa.me/251912345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 border border-neutral-light hover:border-primary transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
                <a
                  href="https://t.me/optalcomms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 border border-neutral-light hover:border-primary transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span className="text-sm font-medium">Telegram</span>
                </a>
              </div>
            </div>

            <div className="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7 mt-12 md:mt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@company.com"
                  />
                </div>

                <Input
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name (optional)"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Budget Range"
                    name="budget_range"
                    value={formData.budget_range}
                    onChange={handleChange}
                    options={budgetOptions}
                  />
                  <Select
                    label="Project Type"
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleChange}
                    options={projectTypeOptions}
                  />
                </div>

                <Textarea
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your project, goals, and timeline..."
                  rows={5}
                />

                {error && <p className="text-orange text-sm">{error}</p>}

                <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
                  Send Message
                </Button>

                <p className="text-xs text-neutral-mid text-center">
                  By submitting, you agree to our privacy policy. We'll respond within 24-48 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-neutral-light">
        <div className="container-grid">
          <div className="grid-12">
            <div className="col-span-4 md:col-span-3 lg:col-span-4">
              <h2 className="text-2xl md:text-3xl">Frequently asked questions</h2>
            </div>

            <div className="col-span-4 md:col-span-5 lg:col-span-7 lg:col-start-6 mt-8 md:mt-0">
              <div className="space-y-8">
                {faqs.map((faq, index) => (
                  <article
                    key={index}
                    className="border-t border-neutral-light pt-6 first:border-0 first:pt-0"
                  >
                    <h3 className="font-display text-lg font-semibold">{faq.question}</h3>
                    <p className="text-neutral-mid mt-2">{faq.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
