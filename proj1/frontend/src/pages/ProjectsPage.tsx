"use client";
import "@/app/globals.css"
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/components/GlobalContext";


interface Project {
  id: number;
  name: string;
  createdAT: string;

}



function ProjectsPage() {
  const router = useRouter()
  const { triggerRefresh } = useGlobalContext();
  const [projects, setProjects] = useState<Project[]>([])
  const [updated, setUpdated] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`api/projects/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Conent-Type': 'application/json',
          },
          body: JSON.stringify({ id: id })
        }
      )

      if (response.ok){
        alert(response.json())
        triggerRefresh();
        setUpdated(true)
      }
      else {
        const data = await response.json()
        alert(data.message)
      }
    } catch (error) {

    }

  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data)

      }
      catch (error) {
        console.error("error fetching project ", error)
        alert('durashechka')
      }
      finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [updated])

  if (loading) { return <div className="flex flex-col justify-center items-center h-screen overflow-scroll p-5"> <h1>Loading...</h1></div> }



  return (
    <div className="flex flex-col justify-center items-center h-screen overflow-scroll p-5 overflow-x-hidden">
      <h1>Choose a project</h1>
      <div className="grid grid-cols-1 my-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-100 rounded-lg shadow-lg">
        {
          projects.map((project) => (
            <div className="flex group relative p-2 h-12 w-36 m-2 bg-white border border-black-100 rounded-lg shadow-md hover:bg-blue-500 hover:text-white focus:outline-none items-center"
              onClick={() => {
                console.log(project); router.push({
                  pathname: '/ProjectPage',
                  query: {

                    project: JSON.stringify(project),
                  },
                }); console.log("click")
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
        }</div>
    </div>
  );
}

export default ProjectsPage