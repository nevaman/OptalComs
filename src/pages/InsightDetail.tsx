import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { supabase, Insight } from '../lib/supabase';
import { InsightCard } from '../components/ui/InsightCard';

export function InsightDetail() {
  const { slug } = useParams();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [relatedInsights, setRelatedInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInsight() {
      if (!slug) return;

      const { data } = await supabase
        .from('insights')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (data) {
        setInsight(data);

        const { data: related } = await supabase
          .from('insights')
          .select('*')
          .eq('is_published', true)
          .neq('id', data.id)
          .limit(3);

        if (related) {
          setRelatedInsights(related);
        }
      }

      setIsLoading(false);
    }

    fetchInsight();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="section-padding">
        <div className="container-grid">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-4 bg-neutral-light w-24 mb-8" />
            <div className="h-12 bg-neutral-light w-3/4 mb-4" />
            <div className="h-6 bg-neutral-light w-1/2 mb-8" />
            <div className="aspect-[16/9] bg-neutral-light mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-neutral-light w-full" />
              <div className="h-4 bg-neutral-light w-full" />
              <div className="h-4 bg-neutral-light w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="section-padding">
        <div className="container-grid">
          <div className="text-center">
            <h1 className="text-2xl font-display">Article not found</h1>
            <Link to="/insights" className="text-orange mt-4 inline-block hover:opacity-80">
              Back to Insights
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const publishDate = insight.published_at
    ? format(new Date(insight.published_at), 'MMMM d, yyyy')
    : format(new Date(insight.created_at), 'MMMM d, yyyy');

  return (
    <>
      <article className="section-padding">
        <div className="container-grid">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 text-sm text-neutral-mid hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Insights
            </Link>

            <header className="mb-12">
              <div className="flex items-center gap-4 text-sm text-neutral-mid mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {publishDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />5 min read
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl">{insight.title}</h1>

              {insight.excerpt && (
                <p className="text-xl text-neutral-mid mt-6">{insight.excerpt}</p>
              )}

              {insight.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {insight.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {insight.featured_image && (
              <div className="aspect-[16/9] bg-neutral-light mb-12">
                <img
                  src={insight.featured_image}
                  alt={insight.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="prose-editorial">
              {insight.content && Array.isArray(insight.content) ? (
                insight.content.map((block: Record<string, unknown>, index: number) => {
                  if (block.type === 'paragraph') {
                    return <p key={index}>{String(block.text || '')}</p>;
                  }
                  if (block.type === 'heading') {
                    return <h2 key={index}>{String(block.text || '')}</h2>;
                  }
                  if (block.type === 'image') {
                    return (
                      <figure key={index} className="my-8">
                        <img
                          src={String(block.url || '')}
                          alt={String(block.caption || '')}
                          className="w-full"
                        />
                        {block.caption && (
                          <figcaption className="text-sm text-neutral-mid mt-2 text-center">
                            {String(block.caption)}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }
                  if (block.type === 'quote') {
                    return (
                      <blockquote key={index}>
                        {String(block.text || '')}
                        {block.author && (
                          <footer className="text-sm text-neutral-mid mt-2">
                            - {String(block.author)}
                          </footer>
                        )}
                      </blockquote>
                    );
                  }
                  return null;
                })
              ) : (
                <p className="text-neutral-mid">Content coming soon.</p>
              )}
            </div>
          </div>
        </div>
      </article>

      {relatedInsights.length > 0 && (
        <section className="section-padding border-t border-neutral-light">
          <div className="container-grid">
            <h2 className="text-2xl md:text-3xl mb-12">More Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedInsights.map((related) => (
                <InsightCard key={related.id} insight={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
