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
      
      const nodesWithCoordinates = await prisma.node.findMany({
        where: {
          elements: {
            some: {
              id: projectId, // Filter nodes associated with the given elementId
            },
          },
        },
        select: {
          coordinates: true,
          name:true // Retrieve only the coordinates field
        },
      });
      
      console.log(nodesWithCoordinates);

      return res.status(200).json(nodesWithCoordinates);
    } else if (req.method === "POST") {
      console.log("im here")

    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
