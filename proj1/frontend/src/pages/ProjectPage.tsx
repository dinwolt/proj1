import AddElement from "@/components/AddElement"
import AddNode from "@/components/AddNode"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import "@/app/globals.css"
import { Project } from "@prisma/client";
import AllData from "@/components/AllData"
import Modal from "@/components/Modal"
import ProjectData from "@/components/ProjectData"
import { int } from "three/tsl"


function ProjectPage() {
    const router = useRouter()
    const { project } = router.query;
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

    const [currentProject, setCurrentProject] = useState({
        name: "",
        id: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: ""
    });
    useEffect(() => {
        if (typeof project === "string") {
            try {
                setCurrentProject(JSON.parse(project));
            } catch (error) {
                console.error("Failed to parse project query:", error);
            }
            finally {
                setLoading(false)
            }
        }
    }, [project])
    const [isNode, setIsNode] = useState(false)
    const [isElement, setIsElement] = useState(false)
    const [formSubmitted, setFormSubmitted] = useState(true);

    const handleFormSubmit = () => {
        setFormSubmitted(true);
    };
    if (loading) { return <p>Loading...</p> }
    return (
        <div className="flex flex-col justify-center items-center space-x-4 h-screen">
            <div className="py-6">
                <button className="h-12 w-36 m-2 bg-white border border-black-100 rounded-lg shadow-md hover:bg-blue-500 hover:text-white focus:outline-none"
                    onClick={() => { setIsNode(true); setIsElement(false); setFormSubmitted(false) }}>Add Node</button>
                    <button
                        onClick={openModal}
                        className="h-12 w-36 px-6 py-2 bg-blue-500 text-white text-center font-semibold rounded-lg shadow-md hover:bg-blue-600"
                        disabled={formSubmitted ? false :true }
                    >
                        Analyse
                    </button>
                <button className="h-12 w-36 m-2 bg-white border border-black-100 rounded-lg shadow-md hover:bg-blue-500 hover:text-white focus:outline-none"
                    onClick={() => { setIsNode(false); setIsElement(true); setFormSubmitted(false) }}>Add Element</button>
            
            </div>

            {formSubmitted ? (
                <div className="flex flex-col justify-center items-center">

                    <AllData projectId={currentProject.id}></AllData>
                    
                    <Modal isOpen = {isModalOpen} onClose={closeModal}
                       
                    >
                        <ProjectData projectId = {currentProject.id}/>
                    </Modal>
                </div>
            ) : (
                <>
                    {isNode && <AddNode project={currentProject} onFormSubmit={handleFormSubmit} />}
                    {isElement && <AddElement projectId={currentProject.id} onFormSubmit={handleFormSubmit} />}
                </>
            )}

        </div>


    )
}

export default ProjectPage