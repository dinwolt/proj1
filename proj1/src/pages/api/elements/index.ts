import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            const nodes = await prisma.element.findMany();
            res.status(200).json(nodes);
        } else if (req.method === "POST") {
            console.log("im here")
            const data = req.body;

            const newElement = await prisma.element.create({
                data: {
                    name: data.name,
                    type: data.type,
                    projectId: data.projectId,
                    nodes: {
                        connect: data.nodes.map((nodeId: number) => ({ id: nodeId })),
                    },
                },
            });

            res.status(201).json(newElement);
        } else {
            res.status(405).json({ message: "Method Not Allowed" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}
