import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const data = req.body;

            const existingNode = await prisma.element.findFirst({
                where: {
                  name: data.name,
                  projectId: data.projectId,
                },
              });
        
              if (existingNode) {
                throw new Error('An element with this name already exists in the given project.');
              }
        
            const newElement = await prisma.element.create({
                data: {
                    name: data.name,
                    type: data.type,
                    projectId: data.projectId,
                    nodes: {
                        connect: data.nodes.map((id: number) => ({ id })), 
                    },
                },
            });


            res.status(201).json(newElement); 
        } else {
            res.status(405).json({ message: "Method Not Allowed" });
        }
    } catch (error) {
        console.error("Error creating element and updating nodes: ", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}
