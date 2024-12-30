import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    console.log(req.query)
    const projectId = parseInt(id as string, 10); 

  if (isNaN(projectId)) {
    console.log("Invalid or missing ID parameter")
    return res.status(400).json({ message: "Invalid or missing ID parameter" });
  }

    try {
    if (req.method === "GET") {
      const elements = await prisma.element.findMany({
        where: { projectId: projectId},
      });
      const nodes = await prisma.node.findMany({
        where: { projectId: projectId},
      })
      
      const allData = {
        elements: elements,
        nodes: nodes
      }

      return res.status(200).json(allData);
    } else if (req.method === "POST") {
      console.log("im here")

    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
