"use client"
import "@/app/globals.css"
import { useRouter } from "next/router"
import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useGlobalContext } from "@/components/GlobalContext"

interface Project {
  id: number
  name: string
  createdAT: string

}

function ProjectsPage() {
  const router = useRouter()
  const { triggerRefresh } = useGlobalContext()
  const { refreshKey } = useGlobalContext()
  const [projects, setProjects] = useState<Project[]>([])
  const [updated, setUpdated] = useState(false)
  const [loading, setLoading] = useState(true)
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`api/projects/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id })
        }
      )
      if (response.ok){
        const result = await response.json()
        alert(result.data)
        triggerRefresh()
        setUpdated(true)
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects')
        setProjects(response.data)

      }
      catch (error) {
        console.error("error fetching project ", error)
      }
      finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [refreshKey])

  if (loading) { return <div className="animate-spin rounded-full border-t-4 border-blue-600 w-16 h-16 mb-4"></div> }



  return (
    <div className="flex flex-col justify-center items-center h-screen overflow-scroll p-5 overflow-x-hidden">
      <h1 className="font-bold">Choose a project</h1>
      {projects && projects.length > 0? 
      <div className="grid grid-cols-1 my-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-100 rounded-lg shadow-lg">
        {
          projects.map((project) => (
            <div className="flex group relative p-2 h-12 w-36 m-2 bg-white border border-black-100 rounded-lg shadow-md hover:bg-blue-500 hover:text-white focus:outline-none items-center"
              onClick={() => {
                console.log(project) 
                router.push({
                  pathname: '/ProjectPage',
                  query: {

                    project: JSON.stringify(project),
                  },
                }) 
                console.log("click")
              }}
            >
              <p>{project.name}</p>
              <button
                className="absolute right-2 text-gray-300 invisible group-hover:visible hover:text-red-500 transition-colors duration-200 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(project.id) }}
              >
                ✖
              </button>

            </div>
          ))
        }</div>: <div className="text-center text-gray-500 p-6 bg-gray-100 rounded-lg shadow-lg m-6">No Projects Yet </div>}
    </div> 
  )
}

export default ProjectsPage