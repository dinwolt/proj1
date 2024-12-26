import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    console.log(req.query)
    const projectId = parseInt(id as string, 10); // Convert to number

  if (isNaN(projectId)) {
    console.log("Invalid or missing ID parameter")
    return res.status(400).json({ message: "Invalid or missing ID parameter" });
  }

    try {
    if (req.method === "GET") {
      const elements = await prisma.node.findMany({
        where: { projectId: projectId},
      });
      if (!elements || elements.length === 0) {
        return res.status(404).json({ message: "No elements found for this project" });
      }

      return res.status(200).json(elements);
    } else if (req.method === "POST") {
      console.log("im here")

    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
