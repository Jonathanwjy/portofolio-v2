import React from "react";
import { Github, ExternalLink } from "lucide-react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, onClick }) {
  const { title, description, images, image, tags, githubUrl, demoUrl } =
    project;

  const imageThumbnail = images?.[0] || image;

  return (
    <Card
      onClick={onClick}
      className="flex flex-col h-full overflow-hidden group bg-card rounded-[2rem] border-none shadow-xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={imageThumbnail}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400?text=Project+Image";
          }}
        />

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
          <IconButton
            href={githubUrl}
            disabled={!githubUrl}
            icon={<Github />}
            label="GitHub"
          />

          <IconButton
            href={demoUrl}
            disabled={!demoUrl}
            icon={<ExternalLink />}
            label="Live Demo"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <CardHeader className="space-y-3 p-6 pb-4">
          <h3 className="text-2xl font-bold tracking-tight text-foreground line-clamp-1">
            {title}
          </h3>

          <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-3">
            {description}
          </p>
        </CardHeader>

        <CardFooter className="mt-auto p-6 pt-0 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-white transition-all px-3 py-1.5 text-xs font-medium rounded-full border-none"
            >
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </div>
    </Card>
  );
}

function IconButton({ href, disabled, icon, label }) {
  if (disabled) {
    return (
      <button
        aria-disabled="true"
        className="p-3 bg-white rounded-full text-black opacity-40 cursor-not-allowed shadow-md"
        title={`${label} not available`}
      >
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-white rounded-full text-black hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:scale-110"
    >
      {React.cloneElement(icon, { className: "w-6 h-6" })}
    </a>
  );
}
