"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"
import { useGlobalContext } from "./GlobalContext"
import React from "react"

type Project = {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

const Navbar = () => {
  const { refreshKey } = useGlobalContext()
  const [projectsData, setProjectsData] = useState<Project[]>([])

  React.useEffect(() => {
    console.log("Navbar re-rendered due to project creation.")
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects')
        setProjectsData(response.data)
      } catch (error) {
        console.error("Error fetching project:", error)
        alert('Error fetching projects data')
      }
    }
    fetchProjects()
  }, [refreshKey])


  return (
    <nav className="bg-white sticky top-0 z-50 shadow-md ">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">

        <Link href="/HomePage" className="text-xl font-bold text-black flex-1 text-center">
          Everysim
        </Link>

        <div className="flex space-x-6 justify-center flex-1">
          <Link href="/HomePage" className="text-black mx-2 p-2 hover:text-blue-600">
            Home
          </Link>
          <Link href="/ProjectsPage" className="text-black mx-2 p-2 hover:text-blue-600">
            Projects
          </Link>
          <Link href="/NewProjectPage" className="text-black mx-2 p-2 hover:text-blue-600">
            New Project
          </Link>
        </div>

        <div className="flex-1 text-black">
          {projectsData.length > 0 ? (
            <div className="p-4 flex flex-row justify-center">
              <div className="mb-2 mx-2 text-center">
                <p className="text-sm font-medium text-gray-500">Last Created Project:</p>
                <p className="text-lg font-semibold text-gray-800">{projectsData[0].name}</p>
              </div>
              <div className="mx-2 text-center">
                <p className="text-sm font-medium text-gray-500">Number of Projects:</p>
                <p className="text-lg font-semibold text-gray-800">{projectsData.length}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No projects available</p>
          )}
        </div>

      </div>
    </nav>

  )
}

export default Navbar
