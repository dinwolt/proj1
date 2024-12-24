import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const nodes = await prisma.node.findMany();
      res.status(200).json(nodes);
    } else if (req.method === "POST") {
      console.log("im here")
      const { name, coordinates, projectId} = req.body;

      const newNode = await prisma.node.create({
        data: { name, coordinates, projectId },
      });

      res.status(201).json(newNode);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
