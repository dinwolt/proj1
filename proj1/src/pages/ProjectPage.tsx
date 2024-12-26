import AddElement from "@/components/AddElement"
import AddNode from "@/components/AddNode"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import "@/app/globals.css"
import { Project } from "@prisma/client";
import AllData from "@/components/AllData"


function ProjectPage() {
    const router = useRouter()
    const { project } = router.query;
    const [loading, setLoading] = useState(true)
    
    const [currentProject, setCurrentProject] = useState({
        name: "",
        id: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        description:""
    });
    useEffect(() => {
        if (typeof project === "string") {
          try {
            setCurrentProject(JSON.parse(project)); 
          } catch (error) {
            console.error("Failed to parse project query:", error);
          }
          finally{
            setLoading(false)
          }
        }
      }, [project]);
    {/**data.projectId */ }
    const [isNode, setIsNode] = useState(false)
    const [isElement, setIsElement] = useState(false)
    const [formSubmitted, setFormSubmitted] = useState(true);

    const handleFormSubmit = () => {
        setFormSubmitted(true); 
    };
    if (loading) {return <p>Loading...</p>}
    return (
        <div className="flex flex-col justify-center items-center space-x-4 h-screen">
            <div className="buttons-container">
                <button className="h-12 w-36 m-2 bg-white border border-black-100 rounded-lg shadow-md hover:bg-blue-500 hover:text-white focus:outline-none"
                    onClick={() => { setIsNode(true); setIsElement(false); setFormSubmitted(false)}}>Add Node</button>
                <button className="h-12 w-36 m-2 bg-white border border-black-100 rounded-lg shadow-md hover:bg-blue-500 hover:text-white focus:outline-none"
                    onClick={() => { setIsNode(false); setIsElement(true); setFormSubmitted(false) }}>Add Element</button>
            </div>

            {formSubmitted ? (
                <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-center w-[500px] h-[300px] my-6 border border-black">
                    <p>DISPLAY</p>
                    
                </div>
                <AllData projectId={currentProject.id}></AllData>
                </div>
            ) : (
                <>
                    {isNode && <AddNode project={currentProject}  onFormSubmit={handleFormSubmit}/>}
                    {isElement && <AddElement project={currentProject}  onFormSubmit={handleFormSubmit}/>}
                </>
            )}
        </div>


    )
}

export default ProjectPage