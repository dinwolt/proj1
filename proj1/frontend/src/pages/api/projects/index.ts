import prisma from "@/lib/prisma";
import { createProject, getAllProjects } from "@/services/projectServices";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const project = await getAllProjects()
      res.status(200).json(project);
    } else if (req.method === "POST") {


      const newProject = await createProject(req.body)

      res.status(201).json(newProject);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
