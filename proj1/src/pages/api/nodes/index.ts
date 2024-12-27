import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const nodes = await prisma.node.findMany();
      res.status(200).json(nodes);
    } else if (req.method === "POST") {
      console.log("I'm here");
      const { name, coordinates, projectId } = req.body;
      
      const existingNode = await prisma.node.findFirst({
        where: {
          name: name,
          projectId: projectId,
        },
      });

      if (existingNode) {
        throw new Error('A node with this name already exists in the given project.');
      }

      const newNode = await prisma.node.create({
        data: { name, coordinates, projectId },
      });

      res.status(201).json(newNode);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
