import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../../lib/supabase';

type ProjectCardProps = {
  project: Project;
  size?: 'default' | 'large';
  index?: number;
};

export function ProjectCard({ project, size = 'default', index = 0 }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const imageUrl = isHovered && project.hover_image ? project.hover_image : project.thumbnail_image;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const cardStyle = isHovered
    ? {
        transform: `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * -4}deg) rotateY(${(mousePosition.x - 0.5) * 4}deg) translateY(-8px)`,
      }
    : {};

  return (
    <Link
      to={`/work/${project.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article
        ref={cardRef}
        className="relative transition-transform duration-500 ease-out-expo will-change-transform"
        style={cardStyle}
        onMouseMove={handleMouseMove}
      >
        <div
          className={`relative overflow-hidden bg-neutral-light ${
            size === 'large' ? 'aspect-[4/3]' : 'aspect-[3/4]'
          }`}
        >
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-neutral-mid text-sm">No image</span>
            </div>
          )}

          <div className="absolute inset-0 border border-neutral-light/50 transition-colors duration-300 group-hover:border-primary/10" />

          <div className="absolute bottom-5 right-5 opacity-0 translate-y-4 transition-all duration-500 ease-out-expo group-hover:opacity-100 group-hover:translate-y-0">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-surface text-primary shadow-soft">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.06), transparent 40%)`,
            }}
          />
        </div>

        <div className="mt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-mono text-neutral-mid">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="w-6 h-px bg-neutral-light" />
                <span className="text-[11px] font-mono text-neutral-mid">
                  {project.year}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-neutral-mid">
                {project.title}
              </h3>
              {project.summary && (
                <p className="text-sm text-neutral-mid mt-2 line-clamp-2 leading-relaxed">
                  {project.summary}
                </p>
              )}
            </div>
          </div>

          {project.disciplines.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {project.disciplines.slice(0, 3).map((discipline) => (
                <span
                  key={discipline}
                  className="tag"
                >
                  {discipline}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
