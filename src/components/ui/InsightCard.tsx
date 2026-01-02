import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';
import { Insight } from '../../lib/supabase';

type InsightCardProps = {
  insight: Insight;
  variant?: 'default' | 'featured';
};

export function InsightCard({ insight, variant = 'default' }: InsightCardProps) {
  const publishDate = insight.published_at
    ? format(new Date(insight.published_at), 'MMM d, yyyy')
    : format(new Date(insight.created_at), 'MMM d, yyyy');

  if (variant === 'featured') {
    return (
      <Link to={`/insights/${insight.slug}`} className="group block">
        <article className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="aspect-[16/10] bg-neutral-light overflow-hidden">
            {insight.featured_image ? (
              <img
                src={insight.featured_image}
                alt={insight.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-neutral-mid text-sm">No image</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="caption mb-3">{publishDate}</p>
            <h3 className="font-display text-2xl md:text-3xl font-semibold group-hover:text-neutral-mid transition-colors">
              {insight.title}
            </h3>
            {insight.excerpt && (
              <p className="text-neutral-mid mt-4 line-clamp-3">{insight.excerpt}</p>
            )}
            {insight.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {insight.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/insights/${insight.slug}`} className="group block">
      <article>
        <div className="aspect-[16/10] bg-neutral-light overflow-hidden mb-4">
          {insight.featured_image ? (
            <img
              src={insight.featured_image}
              alt={insight.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-neutral-mid text-sm">No image</span>
            </div>
          )}
        </div>

        <p className="caption mb-2">{publishDate}</p>
        <h3 className="font-display text-xl font-semibold group-hover:text-neutral-mid transition-colors flex items-start gap-2">
          {insight.title}
          <ArrowUpRight className="w-4 h-4 shrink-0 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
        </h3>
        {insight.excerpt && (
          <p className="text-sm text-neutral-mid mt-2 line-clamp-2">{insight.excerpt}</p>
        )}
      </article>
    </Link>
  );
}
