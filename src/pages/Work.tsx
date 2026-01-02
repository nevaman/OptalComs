import { useEffect, useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { supabase, Project } from '../lib/supabase';
import { ProjectCard } from '../components/ui/ProjectCard';
import { SectionHeading } from '../components/ui/SectionHeading';

const disciplineFilters = [
  'All',
  'Brand Identity',
  'Web Design',
  'Digital Products',
  'Print',
  'Packaging',
  'Campaign',
];

const industryFilters = [
  'All',
  'Technology',
  'Finance',
  'Healthcare',
  'Hospitality',
  'Non-profit',
  'Retail',
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'featured', label: 'Featured' },
  { value: 'alphabetical', label: 'A-Z' },
];

export function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (data) {
        setProjects(data);
      }
      setIsLoading(false);
    }

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.summary?.toLowerCase().includes(query) ||
          p.disciplines.some((d) => d.toLowerCase().includes(query)) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (disciplineFilter !== 'All') {
      result = result.filter((p) =>
        p.disciplines.some((d) => d.toLowerCase().includes(disciplineFilter.toLowerCase()))
      );
    }

    if (industryFilter !== 'All') {
      result = result.filter(
        (p) => p.industry?.toLowerCase().includes(industryFilter.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'featured':
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [projects, searchQuery, disciplineFilter, industryFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setDisciplineFilter('All');
    setIndustryFilter('All');
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery || disciplineFilter !== 'All' || industryFilter !== 'All' || sortBy !== 'newest';

  return (
    <div className="section-padding">
      <div className="container-grid">
        <SectionHeading
          label="Portfolio"
          title="Work that makes an impact"
          description="A selection of projects across brand identity, digital products, and creative campaigns."
        />

        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-mid" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-11"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-full md:w-40 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%232A2A33%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:16px] pr-10"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-neutral-mid font-medium">
                Discipline
              </p>
              <div className="flex flex-wrap gap-2">
                {disciplineFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDisciplineFilter(filter)}
                    className={`tag transition-colors ${
                      disciplineFilter === filter
                        ? 'bg-primary text-surface border-primary'
                        : 'hover:border-primary'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-neutral-mid font-medium">
                Industry
              </p>
              <div className="flex flex-wrap gap-2">
                {industryFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setIndustryFilter(filter)}
                    className={`tag transition-colors ${
                      industryFilter === filter
                        ? 'bg-primary text-surface border-primary'
                        : 'hover:border-primary'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 text-sm text-orange hover:opacity-80 transition-opacity"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-neutral-light" />
                <div className="mt-4 h-6 bg-neutral-light w-3/4" />
                <div className="mt-2 h-4 bg-neutral-light w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <>
            <p className="text-sm text-neutral-mid mb-8">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-mid">No projects match your filters.</p>
            <button
              onClick={clearFilters}
              className="text-orange hover:opacity-80 transition-opacity mt-4"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
