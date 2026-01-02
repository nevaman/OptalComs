import { useEffect, useState } from 'react';
import { supabase, TeamMember } from '../lib/supabase';
import { TeamCard } from '../components/ui/TeamCard';
import { Button } from '../components/ui/Button';

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

      if (data) {
        setMembers(data);
      }
      setIsLoading(false);
    }

    fetchTeam();
  }, []);

  return (
    <>
      <section className="section-padding">
        <div className="container-grid">
          <div className="grid-12">
            <div className="col-span-4 md:col-span-6 lg:col-span-7">
              <p className="caption mb-4">Our Team</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl">The people behind the work</h1>
              <p className="text-lg text-neutral-mid mt-6 max-w-lg">
                A small, focused team of designers, developers, and strategists committed to
                delivering exceptional work.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-grid">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-neutral-light" />
                  <div className="mt-4 h-6 bg-neutral-light w-3/4" />
                  <div className="mt-2 h-4 bg-neutral-light w-1/2" />
                </div>
              ))}
            </div>
          ) : members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {members.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-mid">Team profiles coming soon.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 border-t border-neutral-light">
        <div className="container-grid">
          <div className="grid-12 items-center">
            <div className="col-span-4 md:col-span-6">
              <h2 className="text-3xl md:text-4xl">Extended network</h2>
              <p className="text-neutral-mid mt-4 max-w-lg">
                Beyond our core team, we collaborate with a network of trusted specialists including
                photographers, copywriters, developers, and motion designers to scale for larger
                projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-surface">
        <div className="container-grid">
          <div className="grid-12 items-center">
            <div className="col-span-4 md:col-span-6 lg:col-span-7">
              <h2 className="text-3xl md:text-4xl text-surface">Want to join our team?</h2>
              <p className="text-surface/70 mt-4 max-w-lg">
                We're always looking for talented individuals who share our passion for design and
                craft. If you think you'd be a good fit, we'd love to hear from you.
              </p>
              <Button
                href="mailto:careers@optal.co"
                variant="secondary"
                className="mt-8 border-surface/30 text-surface hover:bg-surface hover:text-primary"
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
