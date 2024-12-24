import AddElement from "@/components/AddElement"
import AddNode from "@/components/AddNode"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import "@/app/globals.css"
import { Project } from "@prisma/client";


function ProjectPage() {
    const router = useRouter()
    const { project } = router.query;
    
    const [currentProject, setCurrentProject] = useState({name: "",
        id: 0,
        createdAt: new Date(),});
    useEffect(() => {
        if (typeof project === "string") {
          try {
            setCurrentProject(JSON.parse(project)); // Decode JSON string to object
          } catch (error) {
            console.error("Failed to parse project query:", error);
          }
        }
      }, [project]);
    {/**data.projectId */ }
    const [isNode, setIsNode] = useState(false)
    const [isElement, setIsElement] = useState(false)
    return (
        <div className="flex flex-col justify-center items-center space-x-4 h-screen">
            <div className="buttons-container">
                <button className="h-12 w-36 m-2 bg-white border border-black-100 rounded-lg shadow-md hover:bg-blue-500 hover:text-white focus:outline-none"
                    onClick={() => { setIsNode(true); setIsElement(false) }}>Add Node</button>
                <button className="h-12 w-36 m-2 bg-white border border-black-100 rounded-lg shadow-md hover:bg-blue-500 hover:text-white focus:outline-none"
                    onClick={() => { setIsNode(false); setIsElement(true) }}>Add Element</button>
            </div>

            {!(isNode || isElement) ? (
                <div className="flex flex-col justify-center items-center w-[500px] h-[300px] my-6 border border-black">
                    <p>DISPLAY</p>
                </div>
            ) : (
                <>
                    {isNode && <AddNode project={currentProject}/>}
                    {isElement && <AddElement  />}
                </>
            )}
        </div>


    )
}

export default ProjectPage