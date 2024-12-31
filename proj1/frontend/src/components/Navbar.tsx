"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

type Project = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

const Navbar = () => {
  const [projectsData, setProjectsData] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjectsData(response.data);
      } catch (error) {
        console.error("Error fetching project:", error);
        alert('Error fetching projects data');
      }
    };
    fetchProjects();
  }, []);

  return (
    <nav className="bg-white text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        
        <Link href="/HomePage" className="text-xl font-bold text-black">
          Everysim
        </Link>
        
        <div className="flex space-x-4 justify-center flex-grow">
          <Link href="/HomePage" className="text-black hover:text-blue-600 m-3">
            Home
          </Link>
          <Link href="/ProjectsPage" className="text-black hover:text-blue-600 m-3">
            Projects
          </Link>
          <Link href="/NewProjectPage" className="text-black hover:text-blue-600 m-3">
            New Project
          </Link>
        </div>

        <div className="ml-6 text-black">
          {projectsData.length > 0 ? (
            <div>
              <p>Last created project: {projectsData[0].name}</p>
              <p>Number of projects: {projectsData.length}</p>
            </div>
          ) : (
            <p>No projects available</p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
