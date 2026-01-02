import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, EyeOff, Star, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { supabase, Insight } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

export function InsightsList() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  async function fetchInsights() {
    const { data } = await supabase
      .from('insights')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setInsights(data);
    }
    setIsLoading(false);
  }

  const filteredInsights = insights.filter((insight) => {
    const matchesSearch =
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'published' && insight.is_published) ||
      (filter === 'draft' && !insight.is_published);

    return matchesSearch && matchesFilter;
  });

  async function togglePublish(insight: Insight) {
    const { error } = await supabase
      .from('insights')
      .update({
        is_published: !insight.is_published,
        published_at: !insight.is_published ? new Date().toISOString() : null,
      })
      .eq('id', insight.id);

    if (!error) {
      setInsights((prev) =>
        prev.map((i) =>
          i.id === insight.id
            ? { ...i, is_published: !i.is_published, published_at: !i.is_published ? new Date().toISOString() : null }
            : i
        )
      );
    }
    setOpenMenu(null);
  }

  async function toggleFeatured(insight: Insight) {
    const { error } = await supabase
      .from('insights')
      .update({ is_featured: !insight.is_featured })
      .eq('id', insight.id);

    if (!error) {
      setInsights((prev) =>
        prev.map((i) => (i.id === insight.id ? { ...i, is_featured: !i.is_featured } : i))
      );
    }
    setOpenMenu(null);
  }

  async function deleteInsight(insight: Insight) {
    if (!confirm(`Are you sure you want to delete "${insight.title}"?`)) {
      return;
    }

    const { error } = await supabase.from('insights').delete().eq('id', insight.id);

    if (!error) {
      setInsights((prev) => prev.filter((i) => i.id !== insight.id));
    }
    setOpenMenu(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Insights</h1>
          <p className="text-neutral-mid mt-1">Manage your blog posts and articles</p>
        </div>
        <Button href="/admin/insights/new" variant="primary" icon>
          <Plus className="w-4 h-4 mr-2" />
          New Insight
        </Button>
      </div>

      <div className="bg-surface rounded border border-neutral-light">
        <div className="p-4 border-b border-neutral-light flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-mid" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'published', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  filter === f
                    ? 'bg-primary text-surface'
                    : 'bg-neutral-light/50 text-neutral-mid hover:bg-neutral-light'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-neutral-light rounded" />
              ))}
            </div>
          </div>
        ) : filteredInsights.length > 0 ? (
          <div className="divide-y divide-neutral-light">
            {filteredInsights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-center justify-between p-4 hover:bg-neutral-light/20 transition-colors"
              >
                <Link
                  to={`/admin/insights/${insight.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <div className="w-16 h-12 bg-neutral-light rounded overflow-hidden shrink-0">
                    {insight.featured_image && (
                      <img
                        src={insight.featured_image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{insight.title}</p>
                      {insight.is_featured && (
                        <Star className="w-4 h-4 text-orange fill-orange shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {insight.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs text-neutral-mid">
                          {tag}
                        </span>
                      ))}
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          insight.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-neutral-light text-neutral-mid'
                        }`}
                      >
                        {insight.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-neutral-mid hidden md:block">
                    {format(new Date(insight.created_at), 'MMM d, yyyy')}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === insight.id ? null : insight.id)}
                      className="p-2 text-neutral-mid hover:text-primary transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenu === insight.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenu(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 bg-surface border border-neutral-light rounded shadow-lg z-20 min-w-[160px]">
                          <button
                            onClick={() => togglePublish(insight)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-neutral-light/50 transition-colors"
                          >
                            {insight.is_published ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                Publish
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => toggleFeatured(insight)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-neutral-light/50 transition-colors"
                          >
                            <Star className={`w-4 h-4 ${insight.is_featured ? 'fill-orange text-orange' : ''}`} />
                            {insight.is_featured ? 'Remove Featured' : 'Mark Featured'}
                          </button>
                          <button
                            onClick={() => deleteInsight(insight)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-neutral-mid">
              {searchQuery || filter !== 'all' ? 'No insights match your search' : 'No insights yet'}
            </p>
            {!searchQuery && filter === 'all' && (
              <Button href="/admin/insights/new" variant="accent" className="mt-4">
                Write your first insight
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
