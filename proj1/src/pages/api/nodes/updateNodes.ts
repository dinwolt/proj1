import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "PUT") {
      const { nodeId, elementId } = req.body;

      // Update the Node to associate it with the new Element
      const updatedNode = await prisma.node.update({
        where: { id: nodeId },
        data: {
          elements: {
            connect: { id: elementId }, // Connect the Element by its ID
          },
        },
      });

      res.status(200).json(updatedNode);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
