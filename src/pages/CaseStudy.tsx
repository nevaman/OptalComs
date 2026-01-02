import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Users, Briefcase, Target } from 'lucide-react';
import { supabase, Project, ProjectBlock } from '../lib/supabase';
import { ProjectCard } from '../components/ui/ProjectCard';
import { Button } from '../components/ui/Button';

function BlockRenderer({ block }: { block: ProjectBlock }) {
  const content = block.content as Record<string, unknown>;

  switch (block.block_type) {
    case 'headline_text':
      return (
        <section className="py-12 md:py-16">
          <div className="container-grid">
            <div className="grid-12">
              <div className="col-span-4 md:col-span-6 lg:col-span-8">
                {content.headline && (
                  <h2 className="text-2xl md:text-3xl lg:text-4xl mb-6">
                    {String(content.headline)}
                  </h2>
                )}
                {content.text && (
                  <div className="prose-editorial text-neutral-mid">
                    <p>{String(content.text)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      );

    case 'challenge_insight_solution':
      return (
        <section className="py-12 md:py-16 bg-neutral-light/50">
          <div className="container-grid">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {content.challenge && (
                <div>
                  <h3 className="font-display text-xl font-semibold mb-4">Challenge</h3>
                  <p className="text-neutral-mid">{String(content.challenge)}</p>
                </div>
              )}
              {content.insight && (
                <div>
                  <h3 className="font-display text-xl font-semibold mb-4">Insight</h3>
                  <p className="text-neutral-mid">{String(content.insight)}</p>
                </div>
              )}
              {content.solution && (
                <div>
                  <h3 className="font-display text-xl font-semibold mb-4">Solution</h3>
                  <p className="text-neutral-mid">{String(content.solution)}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case 'single_image':
      return (
        <section className="py-8 md:py-12">
          <div className={content.fullWidth ? '' : 'container-grid'}>
            <figure>
              <img
                src={String(content.url || '')}
                alt={String(content.caption || '')}
                className="w-full"
              />
              {content.caption && (
                <figcaption className="container-grid text-sm text-neutral-mid mt-4">
                  {String(content.caption)}
                </figcaption>
              )}
            </figure>
          </div>
        </section>
      );

    case 'image_grid':
      const images = (content.images as { url: string; caption?: string }[]) || [];
      const columns = Number(content.columns) || 2;
      return (
        <section className="py-8 md:py-12">
          <div className="container-grid">
            <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4 md:gap-6`}>
              {images.map((image, index) => (
                <figure key={index}>
                  <img src={image.url} alt={image.caption || ''} className="w-full" />
                  {image.caption && (
                    <figcaption className="text-sm text-neutral-mid mt-2">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      );

    case 'split_image_text':
      return (
        <section className="py-12 md:py-16">
          <div className="container-grid">
            <div
              className={`grid-12 items-center ${
                content.imagePosition === 'right' ? '' : 'flex-row-reverse'
              }`}
            >
              <div
                className={`col-span-4 md:col-span-4 lg:col-span-5 ${
                  content.imagePosition === 'right' ? 'lg:col-start-8' : ''
                }`}
              >
                <img src={String(content.imageUrl || '')} alt="" className="w-full" />
              </div>
              <div
                className={`col-span-4 md:col-span-4 lg:col-span-5 ${
                  content.imagePosition === 'right' ? '' : 'lg:col-start-7'
                } mt-8 md:mt-0`}
              >
                {content.headline && (
                  <h3 className="font-display text-xl md:text-2xl font-semibold mb-4">
                    {String(content.headline)}
                  </h3>
                )}
                {content.text && <p className="text-neutral-mid">{String(content.text)}</p>}
              </div>
            </div>
          </div>
        </section>
      );

    case 'quote':
      return (
        <section className="py-12 md:py-16">
          <div className="container-grid">
            <blockquote className="max-w-3xl mx-auto text-center">
              <p className="font-display text-2xl md:text-3xl italic">"{String(content.text)}"</p>
              {(content.author || content.role) && (
                <footer className="mt-6 text-neutral-mid">
                  {content.author && <span className="font-medium">{String(content.author)}</span>}
                  {content.role && <span>, {String(content.role)}</span>}
                </footer>
              )}
            </blockquote>
          </div>
        </section>
      );

    case 'statistics':
      const stats = (content.stats as { value: string; label: string }[]) || [];
      return (
        <section className="py-12 md:py-16 bg-primary text-surface">
          <div className="container-grid">
            {content.headline && (
              <h3 className="font-display text-xl md:text-2xl text-center mb-12">
                {String(content.headline)}
              </h3>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-display text-4xl md:text-5xl font-semibold text-orange">
                    {stat.value}
                  </p>
                  <p className="text-sm text-surface/70 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'process_steps':
      const steps = (content.steps as { title: string; description: string }[]) || [];
      return (
        <section className="py-12 md:py-16">
          <div className="container-grid">
            {content.headline && (
              <h3 className="font-display text-xl md:text-2xl mb-12">{String(content.headline)}</h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index}>
                  <span className="font-mono text-sm text-orange">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 className="font-display text-lg font-semibold mt-2 mb-2">{step.title}</h4>
                  <p className="text-sm text-neutral-mid">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'deliverables':
      const items = (content.items as string[]) || [];
      return (
        <section className="py-12 md:py-16 border-y border-neutral-light">
          <div className="container-grid">
            <div className="grid-12">
              <div className="col-span-4 md:col-span-3">
                <h3 className="font-display text-xl font-semibold">Deliverables</h3>
              </div>
              <div className="col-span-4 md:col-span-5 lg:col-span-6 mt-4 md:mt-0">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-orange rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      );

    case 'gallery':
      const galleryImages = (content.images as { url: string; caption?: string }[]) || [];
      return (
        <section className="py-8 md:py-12">
          <div className="container-grid">
            <div className="space-y-4">
              {galleryImages.map((image, index) => (
                <figure key={index}>
                  <img src={image.url} alt={image.caption || ''} className="w-full" />
                  {image.caption && (
                    <figcaption className="text-sm text-neutral-mid mt-2">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}

export function CaseStudy() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [blocks, setBlocks] = useState<ProjectBlock[]>([]);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) return;

      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (projectData) {
        setProject(projectData);

        const { data: blocksData } = await supabase
          .from('project_blocks')
          .select('*')
          .eq('project_id', projectData.id)
          .order('sort_order', { ascending: true });

        if (blocksData) {
          setBlocks(blocksData);
        }

        const { data: related } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .neq('id', projectData.id)
          .limit(3);

        if (related) {
          setRelatedProjects(related);
        }
      }

      setIsLoading(false);
    }

    fetchProject();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="section-padding">
        <div className="container-grid">
          <div className="animate-pulse">
            <div className="h-4 bg-neutral-light w-24 mb-8" />
            <div className="h-12 bg-neutral-light w-3/4 mb-4" />
            <div className="h-6 bg-neutral-light w-1/2 mb-12" />
            <div className="aspect-[16/9] bg-neutral-light" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="section-padding">
        <div className="container-grid">
          <div className="text-center">
            <h1 className="text-2xl font-display">Project not found</h1>
            <Link to="/work" className="text-orange mt-4 inline-block hover:opacity-80">
              Back to Work
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="pt-8 md:pt-12 pb-12 md:pb-16">
        <div className="container-grid">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-sm text-neutral-mid hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Work
          </Link>

          <div className="grid-12">
            <div className="col-span-4 md:col-span-6 lg:col-span-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl">{project.title}</h1>
              {project.summary && (
                <p className="text-xl text-neutral-mid mt-6 max-w-2xl">{project.summary}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {project.hero_image && (
        <section className="pb-12 md:pb-16">
          <div className="aspect-[16/9] md:aspect-[21/9] bg-neutral-light">
            <img
              src={project.hero_image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      )}

      <section className="py-12 md:py-16 border-y border-neutral-light">
        <div className="container-grid">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {project.client_name && (
              <div>
                <p className="caption mb-2">Client</p>
                <p className="font-medium">{project.client_name}</p>
              </div>
            )}
            {project.industry && (
              <div>
                <p className="caption mb-2">Industry</p>
                <p className="font-medium">{project.industry}</p>
              </div>
            )}
            {project.services.length > 0 && (
              <div>
                <p className="caption mb-2">Services</p>
                <p className="font-medium">{project.services.join(', ')}</p>
              </div>
            )}
            <div>
              <p className="caption mb-2">Year</p>
              <p className="font-medium">{project.year}</p>
            </div>
            {project.disciplines.length > 0 && (
              <div>
                <p className="caption mb-2">Disciplines</p>
                <div className="flex flex-wrap gap-2">
                  {project.disciplines.map((d) => (
                    <span key={d} className="tag">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {(project.challenge || project.insight || project.solution) && (
        <section className="py-12 md:py-16">
          <div className="container-grid">
            <div className="grid-12">
              <div className="col-span-4 md:col-span-8 lg:col-span-9">
                <div className="space-y-12">
                  {project.challenge && (
                    <div>
                      <h3 className="font-display text-xl font-semibold mb-4">The Challenge</h3>
                      <p className="text-neutral-mid text-lg">{project.challenge}</p>
                    </div>
                  )}
                  {project.insight && (
                    <div>
                      <h3 className="font-display text-xl font-semibold mb-4">Our Insight</h3>
                      <p className="text-neutral-mid text-lg">{project.insight}</p>
                    </div>
                  )}
                  {project.solution && (
                    <div>
                      <h3 className="font-display text-xl font-semibold mb-4">The Solution</h3>
                      <p className="text-neutral-mid text-lg">{project.solution}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}

      {project.outcomes.length > 0 && (
        <section className="py-12 md:py-16 bg-primary text-surface">
          <div className="container-grid">
            <h3 className="font-display text-2xl text-center mb-12">Results & Outcomes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {project.outcomes.map((outcome, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 border border-surface/20 p-6"
                >
                  <Target className="w-5 h-5 text-orange shrink-0 mt-0.5" />
                  <p className="text-surface/90">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.credits && project.credits.length > 0 && (
        <section className="py-12 md:py-16 border-t border-neutral-light">
          <div className="container-grid">
            <div className="grid-12">
              <div className="col-span-4 md:col-span-3">
                <h3 className="font-display text-xl font-semibold">Credits</h3>
              </div>
              <div className="col-span-4 md:col-span-5 lg:col-span-6 mt-4 md:mt-0">
                <ul className="space-y-2">
                  {project.credits.map((credit, index) => (
                    <li key={index} className="flex items-baseline gap-4 text-sm">
                      <span className="text-neutral-mid min-w-[120px]">{credit.role}</span>
                      <span className="font-medium">{credit.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section-padding border-t border-neutral-light">
        <div className="container-grid">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl">Want results like this?</h2>
            <p className="text-neutral-mid mt-4 max-w-md mx-auto">
              Let's discuss how we can help your brand make an impact.
            </p>
            <Button href="/contact" variant="primary" icon className="mt-8">
              Start a Project
            </Button>
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="section-padding border-t border-neutral-light">
          <div className="container-grid">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl md:text-3xl">Related Projects</h2>
              <Link
                to="/work"
                className="text-sm text-orange hover:opacity-80 transition-opacity inline-flex items-center gap-2"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map((related) => (
                <ProjectCard key={related.id} project={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
