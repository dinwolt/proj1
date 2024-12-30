"use client";
import "@/app/globals.css"
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";


interface Project {
  id: number;
  name: string;
  createdAT: string;

}



function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

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
  }, [])

  if (loading) {return <div className="flex flex-col justify-center items-center h-screen overflow-scroll p-5"> <h1>Loading...</h1></div>}



  return (
    <div className="flex flex-col justify-center items-center h-screen overflow-scroll p-5 ">
      <h1>Choose a project</h1>
      <div className="grid grid-cols-1 my-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-100 rounded-lg shadow-lg">
        {
          projects.map((project) => (
            <button className="h-12 w-36 m-2 bg-white border border-black-100 rounded-lg shadow-md hover:bg-blue-500 hover:text-white focus:outline-none" onClick={() => {
              console.log(project);router.push({
                pathname: '/ProjectPage',
                query: {
                  
                  project: JSON.stringify(project), 
                },
              });console.log("click")
            }}
            >
              {project.name}
            </button>
          ))
        }</div>
    </div>
  );
}

export default ProjectsPage