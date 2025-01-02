import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    console.log(req.query)
    const dataId = parseInt(id as string, 10);
    const updatedData = req.body


  if (isNaN(dataId)) {
    console.log("Invalid or missing ID parameter")
    return res.status(400).json({ message: "Invalid or missing ID parameter" });
  }

    try {
    if (req.method === "GET") {
      
      const nodesWithCoordinates = await prisma.node.findMany({
        where: {
          elements: {
            some: {
              id: dataId,
            },
          },
        },
        select: {
          coordinates: true,
          name:true, 
          id: true
        },
      });
      
      console.log(nodesWithCoordinates);

      return res.status(200).json(nodesWithCoordinates);
    } else if (req.method === "PUT") {
      return res.status(200).json(updatedData);
      const currentElement = await prisma.element.findUnique({
        where: { id: dataId },
        include: { nodes: true },
      });


    } 
    else if (req.method == "DELETE"){
      try {
        if (!id) {
          return res.status(400).json({ error: 'Element ID is required' });
        }
  
        const deletedElement = await prisma.element.delete({
          where: {
            id: dataId, 
          },
        });
  
        return res.status(200).json(deletedElement);
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
