import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "PUT") {
      const { nodeId, elementId, updatedData } = req.body;

      if (!nodeId) {
        return res.status(400).json({ message: "Node ID is required" });
      }

      if (elementId) {
        const updatedNode = await prisma.node.update({
          where: { id: nodeId },
          data: {
            elements: {
              connect: { id: elementId }, 
            },
          },
        });

        return res.status(200).json(updatedNode);
      }

      if (updatedData && (updatedData.name || updatedData.coordinates)) {
        const updatedNode = await prisma.node.update({
          where: { id: nodeId },
          data: updatedData,
        });

        return res.status(200).json(updatedNode);
      }

      return res.status(400).json({ message: "No valid update data provided" });
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error updating node:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
