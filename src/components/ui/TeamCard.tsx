import { Linkedin, Twitter, Mail } from 'lucide-react';
import { TeamMember } from '../../lib/supabase';

type TeamCardProps = {
  member: TeamMember;
};

export function TeamCard({ member }: TeamCardProps) {
  return (
    <article className="group">
      <div className="aspect-[3/4] bg-neutral-light overflow-hidden mb-4">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-display text-neutral-mid">
              {member.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <h3 className="font-display text-lg font-semibold">{member.name}</h3>
      <p className="text-sm text-orange mt-1">{member.role}</p>

      {member.bio && (
        <p className="text-sm text-neutral-mid mt-3 line-clamp-3">{member.bio}</p>
      )}

      <div className="flex gap-3 mt-4">
        {member.linkedin_url && (
          <a
            href={member.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-mid hover:text-primary transition-colors"
            aria-label={`${member.name}'s LinkedIn`}
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {member.twitter_url && (
          <a
            href={member.twitter_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-mid hover:text-primary transition-colors"
            aria-label={`${member.name}'s Twitter`}
          >
            <Twitter className="w-4 h-4" />
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="text-neutral-mid hover:text-primary transition-colors"
            aria-label={`Email ${member.name}`}
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  );
}
