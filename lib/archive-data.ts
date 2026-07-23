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

export const archiveItems: ArchiveItem[] = [];