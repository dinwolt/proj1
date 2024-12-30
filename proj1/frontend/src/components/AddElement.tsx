import { use, useEffect, useState } from "react"
import "@/app/globals.css"
import { Project } from "@prisma/client";
import axios from "axios";
import { JsonObject } from "@prisma/client/runtime/library";

type NodeProps = {
    project: Project;
    onFormSubmit: () => void;
};
type Node = {
    id: number,
    name: string,
    coordinates: JsonObject,
    projectId: number
}
type ProjectData={
    elements: [];
    nodes:[]
}
function AddElement({ project, onFormSubmit }: NodeProps) {
    const [nodeList, setNodeList] = useState<{ id: string; name: string }[]>([]);
    const [selectedList, setSelectedList] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true)
    const [fetchedNodes, setFetchedNodes] = useState<Node[]>([])
    const [elementName, setElementName] = useState("")

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`/api/projects/${project.id}`);
                const projectData:ProjectData = response.data
                
                setFetchedNodes(projectData.nodes)
                console.log(projectData.nodes)
                setNodeList(projectData.nodes)

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
    }, [project.id])

    if (loading) { return <p>Loading...</p> }

    const handleSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
        const nodeName = e.currentTarget.name
        const nodeId = e.currentTarget.id
        setSelectedList((prevList) => [...prevList, { id: nodeId, name: nodeName }])
        setNodeList((prevList) => prevList.filter((node) => node.name !== nodeName));
    }
    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        const nodeName = e.currentTarget.name;
        const nodeId = e.currentTarget.id
        setSelectedList((prevList) => prevList.filter((node) => node.name !== nodeName));
        setNodeList((prevList) => [...prevList, { id: nodeId, name: nodeName }])
    };
    const handleSubmit =  (e: React.MouseEvent<HTMLButtonElement>) => {
        const filteredNodes = selectedList.map((node) => Number(node.id))
        type ElementType = "point"|"line" | "triangle" | "square";
        let elementType = "unknown"
        
          const executeSubmit = async()=>{
            try {
                const response = await axios.post("/api/elements", {
                    name: elementName,
                    type: elementType,
                    projectId: project.id,
                    nodes: filteredNodes,
    
                });
                console.log(response.data)
                console.log(filteredNodes)
                const elementId = response.data.id
                for(const node of filteredNodes){
                    console.log(node)
                    const updateResponse =  await axios.put("/api/nodes/updateNodes",{
                        nodeId: node,
                        elementId: elementId
                    })
                    console.log(updateResponse.data)
                   
                }
                onFormSubmit()
    
    
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const data = error.response.data;
                    if (data.error) {
                      alert("Name of the node is taken, please create another name."); 
                    } else {
                        alert('Failed to create project. Please try again later.')
                    }
                  } else {
                    alert('An unexpected error occurred. Please try again later.')
                  }
            }
          }
          switch (filteredNodes.length) {
            case 1:
                elementType = "point"
                executeSubmit()
                break
            case 2:
                elementType = "line"; 
                executeSubmit()
                break
            case 3:
                elementType = "triangle"; 
                executeSubmit()
                break
            case 4:
                elementType = "square"; 
                executeSubmit()
                break
            default:
                alert("yyou can't have more than 4 nodes in element")
                break
          }
       
    };
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let fieldName: string = e.target.value
        setElementName((prevState) => (fieldName)
        )

    }


    return (
        <div className="flex flex-col w-auto h-auto justify-center items-center ">
            <div className="flex w-full justify-around my-2">
                <label>Element Name</label>
                <input className="border-b-2 border-gray-500 bg-transparent focus:outline-none focus:border-blue-500" type="text"  onChange={handleInput}></input>
            </div>
            <div className="flex flex-row w-auto h-auto justify-center items-center ">
                <div className="flex flex-col mx-10 my-10 h-[500px] w-[200px] p-6 bg-gray-100 rounded-lg shadow-lg">
                    {
                        nodeList.map(item =>
                            <button className="bg-white shadow-lg text-black m-2 h-auto" id={item.id} name={item.name} onClick={handleSelect}>{item.name}</button>)
                    }
                </div>
                <div className="flex flex-col mx-10 h-[500px] w-[200px] p-6 bg-gray-100 rounded-lg shadow-lg">
                    {
                        selectedList.map(item =>
                            <button className="bg-white shadow-lg text-black m-2 h-auto" id={item.id} name={item.name} onClick={handleDelete}>{item.name}</button>)
                    }
                </div>


            </div>
            <div className="flex justify-center"> <button className="px-6 py-3 mx-5 w-[180] text-lg bg-blue-400 text-white rounded-lg hover:bg-blue-600 focus:outline-none" onClick={handleSubmit}>Add Element</button></div>

        </div>
    )
}
export default AddElement