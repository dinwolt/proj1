import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    console.log(req.query)
    const nodeId = parseInt(id as string, 10); 

  if (isNaN(nodeId)) {
    console.log("Invalid or missing ID parameter")
    return res.status(400).json({ message: "Invalid or missing ID parameter" });
  }

    try {
    if (req.method === "GET") {
        const data = await prisma.node.findUnique({
            where: { id: nodeId }, 
            select: { coordinates: true, name:true }, 
          });

      return res.status(200).json(data);
    } else if (req.method === "POST") {
      console.log("im here")

    } 
    else if (req.method == "DELETE"){
      try {
        if (!id) {
          return res.status(400).json({ error: 'Element ID is required' });
        }

        const node = await prisma.node.findUnique({
          where: {
            id: nodeId,
          },
          include: {
            elements: true,
          },
        });
    
        if (!node) {
          return res.status(404).json({ error: 'Node not found' });
        }
    
        if (node.elements.length > 0) {
          return res.status(400).json({ error: 'Node cannot be deleted because it is used in one or more elements' });
        }
  
        const deletedNode = await prisma.node.delete({
          where: {
            id: nodeId, 
          },
        });
  
        return res.status(200).json(deletedNode);
      } catch (error) {
        console.error('Error deleting element:', error);
        return res.status(500).json({ error: 'Error deleting element' });
      }
    }
    else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
