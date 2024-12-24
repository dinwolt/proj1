import prisma from "@/lib/prisma";

export const createProject = async (data: {
  name: string;
  createdAt: Date;
  nodes: { name: string; coordinates: any }[]; 
  elements: { name: string }[]; 
}) => {
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

export const getAllProjects = async ()=>{
    return await prisma.project.findMany()
}
