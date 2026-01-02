import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, EyeOff, Star, Trash2, Copy, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { supabase, Project } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (data) {
      setProjects(data);
    }
    setIsLoading(false);
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.industry?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'published' && project.is_published) ||
      (filter === 'draft' && !project.is_published);

    return matchesSearch && matchesFilter;
  });

  async function togglePublish(project: Project) {
    const { error } = await supabase
      .from('projects')
      .update({
        is_published: !project.is_published,
        published_at: !project.is_published ? new Date().toISOString() : null,
      })
      .eq('id', project.id);

    if (!error) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? { ...p, is_published: !p.is_published, published_at: !p.is_published ? new Date().toISOString() : null }
            : p
        )
      );
    }
    setOpenMenu(null);
  }

  async function toggleFeatured(project: Project) {
    const { error } = await supabase
      .from('projects')
      .update({ is_featured: !project.is_featured })
      .eq('id', project.id);

    if (!error) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, is_featured: !p.is_featured } : p))
      );
    }
    setOpenMenu(null);
  }

  async function duplicateProject(project: Project) {
    const { id, created_at, updated_at, published_at, ...rest } = project;
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          ...rest,
          title: `${project.title} (Copy)`,
          slug: `${project.slug}-copy-${Date.now()}`,
          is_published: false,
          is_featured: false,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      setProjects((prev) => [data, ...prev]);
    }
    setOpenMenu(null);
  }

  async function deleteProject(project: Project) {
    if (!confirm(`Are you sure you want to delete "${project.title}"? This cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from('projects').delete().eq('id', project.id);

    if (!error) {
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    }
    setOpenMenu(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold">Projects</h1>
          <p className="text-neutral-mid mt-1">Manage your portfolio projects</p>
        </div>
        <Button href="/admin/projects/new" variant="primary" icon>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="bg-surface rounded border border-neutral-light">
        <div className="p-4 border-b border-neutral-light flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-mid" />
            <input
              type="text"
              placeholder="Search projects..."
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
        ) : filteredProjects.length > 0 ? (
          <div className="divide-y divide-neutral-light">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 hover:bg-neutral-light/20 transition-colors"
              >
                <Link to={`/admin/projects/${project.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-16 h-12 bg-neutral-light rounded overflow-hidden shrink-0">
                    {project.thumbnail_image && (
                      <img
                        src={project.thumbnail_image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{project.title}</p>
                      {project.is_featured && (
                        <Star className="w-4 h-4 text-orange fill-orange shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-neutral-mid">{project.year}</span>
                      {project.industry && (
                        <span className="text-xs text-neutral-mid">{project.industry}</span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          project.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-neutral-light text-neutral-mid'
                        }`}
                      >
                        {project.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-neutral-mid hidden md:block">
                    {format(new Date(project.updated_at), 'MMM d, yyyy')}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === project.id ? null : project.id)}
                      className="p-2 text-neutral-mid hover:text-primary transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenu === project.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenu(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 bg-surface border border-neutral-light rounded shadow-lg z-20 min-w-[160px]">
                          <button
                            onClick={() => togglePublish(project)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-neutral-light/50 transition-colors"
                          >
                            {project.is_published ? (
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
                            onClick={() => toggleFeatured(project)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-neutral-light/50 transition-colors"
                          >
                            <Star className={`w-4 h-4 ${project.is_featured ? 'fill-orange text-orange' : ''}`} />
                            {project.is_featured ? 'Remove Featured' : 'Mark Featured'}
                          </button>
                          <button
                            onClick={() => duplicateProject(project)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-neutral-light/50 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => deleteProject(project)}
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
              {searchQuery || filter !== 'all'
                ? 'No projects match your search'
                : 'No projects yet'}
            </p>
            {!searchQuery && filter === 'all' && (
              <Button href="/admin/projects/new" variant="accent" className="mt-4">
                Create your first project
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
