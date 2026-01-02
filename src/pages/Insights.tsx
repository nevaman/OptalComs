import { useEffect, useState } from 'react';
import { supabase, Insight } from '../lib/supabase';
import { InsightCard } from '../components/ui/InsightCard';
import { SectionHeading } from '../components/ui/SectionHeading';

export function Insights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      const { data } = await supabase
        .from('insights')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (data) {
        setInsights(data);
      }
      setIsLoading(false);
    }

    fetchInsights();
  }, []);

  const allTags = [...new Set(insights.flatMap((i) => i.tags))];

  const filteredInsights = selectedTag
    ? insights.filter((i) => i.tags.includes(selectedTag))
    : insights;

  const featuredInsight = filteredInsights.find((i) => i.is_featured) || filteredInsights[0];
  const remainingInsights = filteredInsights.filter((i) => i.id !== featuredInsight?.id);

  return (
    <div className="section-padding">
      <div className="container-grid">
        <SectionHeading
          label="Insights"
          title="Thoughts on design, branding, and building better businesses"
          description="Perspectives and lessons from our work with brands across industries."
        />

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            <button
              onClick={() => setSelectedTag(null)}
              className={`tag transition-colors ${
                !selectedTag ? 'bg-primary text-surface border-primary' : 'hover:border-primary'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`tag transition-colors ${
                  selectedTag === tag
                    ? 'bg-primary text-surface border-primary'
                    : 'hover:border-primary'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-12">
            <div className="animate-pulse grid md:grid-cols-2 gap-8">
              <div className="aspect-[16/10] bg-neutral-light" />
              <div>
                <div className="h-4 bg-neutral-light w-24 mb-4" />
                <div className="h-8 bg-neutral-light w-3/4 mb-4" />
                <div className="h-4 bg-neutral-light w-full" />
                <div className="h-4 bg-neutral-light w-2/3 mt-2" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/10] bg-neutral-light mb-4" />
                  <div className="h-4 bg-neutral-light w-24 mb-2" />
                  <div className="h-6 bg-neutral-light w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ) : filteredInsights.length > 0 ? (
          <div className="space-y-16">
            {featuredInsight && (
              <InsightCard insight={featuredInsight} variant="featured" />
            )}

            {remainingInsights.length > 0 && (
              <div className="border-t border-neutral-light pt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {remainingInsights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-mid">
              {selectedTag ? 'No insights match this tag.' : 'Insights coming soon.'}
            </p>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-orange hover:opacity-80 transition-opacity mt-4"
              >
                View all insights
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
