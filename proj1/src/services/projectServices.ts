import prisma from "@/lib/prisma";

export const createProject = async (data: {
  name: string;
  createdAt: Date;
  nodes: { name: string; coordinates: any }[];
  elements: { type: string, }[];
}) => {
  const existingProject = await prisma.project.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingProject) {
    throw new Error('A project with this name already exists.');
  }

  return await prisma.project.create({
    data: {
      name: data.name,
      createdAt: data.createdAt,
      nodes: {
        create: data.nodes,
      },
      elements: {
        create: data.elements,
      },
    },
  });
}

export const getAllProjects = async () => {
  return await prisma.project.findMany()
}
