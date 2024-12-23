import AddElement from "@/components/AddElement"
import AddNode from "@/components/AddNode"
import { useRouter } from "next/router"
import { useState } from "react"

function ProjectPage() {
    const router = useRouter()
    const data = router.query
    {/**data.projectId */ }
    const [isNode, setIsNode] = useState(false)
    const [isElement, setIsElement] = useState(false)
    return (
        <div className="main-container">
            <div className="buttons-container">
                <button onClick={()=>{setIsNode(true); setIsElement(false)}}>Add Node</button>
                <button onClick={()=>{setIsNode(false); setIsElement(true)}}>Add Element</button>
            </div>

            {!(isNode || isElement) ? (
                <div className="display-container">
                    <p>DISPLAY</p>
                </div>
            ) : (
                <>
                    {isNode && <AddNode/>}
                    {isElement && <AddElement/>}
                </>
            )}
        </div>



    )
}

export default ProjectPage