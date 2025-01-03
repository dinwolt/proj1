import prisma from "@/lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const project = await prisma.project.findMany({
        orderBy: {
          updatedAt: 'desc', 
        },
      });
      res.status(200).json(project)
    } else if (req.method === "POST") {
      const data = req.body
      const existingProject = await prisma.project.findUnique({
        where: {
          name: data.name,
        },
      });
      if (existingProject) {
        throw new Error('A project with this name already exists.');
      }
    
      const newProject = await prisma.project.create({
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

      res.status(201).json(newProject)
    } else {
      res.status(405).json({ message: "Method Not Allowed" })
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error })
  }
}
