import prisma from "@/lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query
    console.log(req.query)

    const dataId = parseInt(id as string, 10)
    const updatedData = req.body


    if (isNaN(dataId)) {
        console.log("Invalid or missing ID parameter")
        return res.status(400).json({ message: "Invalid or missing ID parameter" })
    }

    try {
        if (req.method === "GET") {
            const elementData = await prisma.element.findUnique({
              where:{id:dataId},
            })
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
                    name: true,
                    id: true,
                },
            })

            console.log(nodesWithCoordinates)
            return res.status(200).json({elementName: elementData?.name, nodes: nodesWithCoordinates})
        } 

        else if (req.method === "PUT") {

            const currentElement = await prisma.element.findUnique({
                where: { id: dataId },
                include: { nodes: true },
            })

            if (!currentElement) {
                return res.status(404).json({ message: "Element not found" })
            }

            const currentNodes = currentElement.nodes || []
            const nodesToDisconnect = currentNodes.filter(
                (node) => !updatedData.nodes.includes(node.id)
            )

            if (nodesToDisconnect.length > 0) {
                await prisma.element.update({
                    where: { id: dataId },
                    data: {
                        nodes: {
                            disconnect: nodesToDisconnect.map((node) => ({ id: node.id })),
                        },
                    },
                })

                for (const node of nodesToDisconnect) {
                    await prisma.node.update({
                        where: { id: node.id },
                        data: {
                            elements: {
                                disconnect: { id: dataId },
                            },
                        },
                    })
                }
            }

            if (updatedData.nodes?.length) {
                await prisma.element.update({
                    where: { id: dataId },
                    data: {
                        nodes: {
                            connect: updatedData.nodes.map((id: number) => ({ id })),
                        },
                        type: updatedData.type,
                        name: updatedData.name
                    },
                })

                for (const nodeId of updatedData.nodes) {
                    await prisma.node.update({
                        where: { id: nodeId },
                        data: {
                            elements: {
                                connect: { id: dataId },
                            },
                        },
                    })
                }
            }

            return res.status(200).json({ result: "success" })
        } 

        else if (req.method === "DELETE") {

            if (!id) {
                return res.status(400).json({ error: 'Element ID is required' })
            }

            try {
                const deletedElement = await prisma.element.delete({
                    where: {
                        id: dataId,
                    },
                })

                return res.status(200).json(deletedElement)
            } catch (error) {
                console.error('Error deleting element:', error)
                return res.status(500).json({ error: 'Error deleting element' })
            }
        } 

        else {

            return res.status(405).json({ message: "Method Not Allowed" })
        }
    } catch (error) {
        console.error('Internal server error:', error)
        return res.status(500).json({ message: "Internal Server Error", error })
    }
}
