export type Project = {
  id: string;
  name?: string;
  description?: string;
};

export type ArchiveItem = {
  id: string;
  imageUrl: string;
  projectId: string;
  tags: string[];
  caption?: string;
  description?: string;
  date: string;
  featured: boolean;
  alt?: string;
};

export const projects: Project[] = [
  {
    id: "P01",
    name: "Threshold Studies",
    description: "Light, edge, and transition studies through drawing and model fragments.",
  },
  {
    id: "P02",
    name: "Domestic Frames",
    description: "Small observations around rooms, furniture, and lived proportion.",
  },
  {
    id: "P03",
    name: "Surface Archive",
    description: "Material, facade, and texture records collected through daily looking.",
  },
];

export const archiveItems: ArchiveItem[] = [
  {
    id: "img-001",
    imageUrl: "/images/sample-01.svg",
    projectId: "P01",
    tags: ["drawing", "architecture"],
    caption: "Drawing study",
    description: "Short note about this image and the first line of an architectural thought.",
    date: "260707",
    featured: true,
    alt: "Monochrome architectural drawing study",
  },
  {
    id: "img-002",
    imageUrl: "/images/sample-02.svg",
    projectId: "P01",
    tags: ["sketch", "threshold"],
    caption: "Edge condition",
    description: "A quick record of how a wall, opening, and shadow begin to form a room.",
    date: "260708",
    featured: true,
    alt: "Minimal edge condition sketch",
  },
  {
    id: "img-003",
    imageUrl: "/images/sample-03.svg",
    projectId: "P02",
    tags: ["model", "domestic"],
    caption: "Room fragment",
    description: "A small model-like image used to test proportion before the project settles.",
    date: "260708",
    featured: false,
    alt: "Abstract domestic room fragment",
  },
  {
    id: "img-004",
    imageUrl: "/images/sample-04.svg",
    projectId: "P02",
    tags: ["image", "interior"],
    caption: "Interior note",
    description: "An image fragment about furniture scale, floor lines, and quiet occupation.",
    date: "260709",
    featured: true,
    alt: "Minimal interior archive image",
  },
  {
    id: "img-005",
    imageUrl: "/images/sample-05.svg",
    projectId: "P03",
    tags: ["surface", "facade"],
    caption: "Surface rhythm",
    description: "Facade marks gathered as a repeated surface rather than a finished elevation.",
    date: "260709",
    featured: false,
    alt: "Abstract facade rhythm image",
  },
  {
    id: "img-006",
    imageUrl: "/images/sample-06.svg",
    projectId: "P03",
    tags: ["render", "material"],
    caption: "Material test",
    description: "A restrained render test looking at texture, tone, and shadow density.",
    date: "260710",
    featured: true,
    alt: "Minimal material render test",
  },
  {
    id: "img-007",
    imageUrl: "/images/sample-07.svg",
    projectId: "P01",
    tags: ["drawing", "plan"],
    caption: "Plan trace",
    description: "A plan fragment kept for its line weight and unresolved spatial rhythm.",
    date: "260711",
    featured: false,
    alt: "Architectural plan trace image",
  },
  {
    id: "img-008",
    imageUrl: "/images/sample-08.svg",
    projectId: "P02",
    tags: ["sketch", "window"],
    caption: "Window interval",
    description: "A small observation of intervals, window depth, and the space between frames.",
    date: "260711",
    featured: true,
    alt: "Minimal window interval sketch",
  },
];
