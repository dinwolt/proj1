import { useEffect, useState } from "react";
import "@/app/globals.css";
import { Project } from "@prisma/client";
import axios from "axios";
import { JsonObject } from "@prisma/client/runtime/library";

type NodeProps = {
    projectId?: number;
    onFormSubmit?: () => void;
    elementId?: number;
    onEditted?: () => void;
};

type Node = {
    id: number;
    name: string;
    coordinates: JsonObject;
    projectId: number;
};

type ProjectData = {
    elements: [];
    nodes: Node[];
};

function AddElement({ projectId, onFormSubmit, elementId, onEditted }: NodeProps) {
    const [nodeList, setNodeList] = useState<{ id: number; name: string }[]>([]);
    const [selectedList, setSelectedList] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchedNodes, setFetchedNodes] = useState<Node[]>([]);
    const [elementName, setElementName] = useState("");

    useEffect(() => {
        if (projectId) {
            const fetchProjects = async () => {
                try {
                    const response = await axios.get(`/api/projects/${projectId}`);
                    
                    const projectData: ProjectData = response.data;

                    setFetchedNodes(projectData.nodes);
                    if(!elementId) setNodeList(projectData.nodes);
                } catch (error) {
                    console.error("Error fetching project", error);
                    alert('Error fetching project');
                } finally {
                    setLoading(false);
                }
            };
            fetchProjects();
        }
    }, [projectId]);

    useEffect(() => {
        if (elementId && fetchedNodes.length > 0) {
            console.log(`ALL NODES ${fetchedNodes}`);
            const fetchElement = async () => {
                try {
                    const response = await fetch(`/api/elements/${elementId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (response.ok) {
                        const data= await response.json();
                        const nodesData:Node[] = data.nodes
                        setElementName(data.name)
                        setSelectedList(nodesData.map((item: { id: number; name: string }) => ({
                            id: item.id,
                            name: item.name,
                        })));
    
                        console.log(`DATA NODES ${data}`);
                        const chosen = fetchedNodes.filter((node) =>
                            !nodesData.some((existingNode) => existingNode.id === node.id)
                        );
                        setNodeList(chosen);
                        console.log(`Filtered Node List: ${chosen}`);
                    }
                } catch (error) {
                    console.error("Error fetching element", error);
                }
            };
            fetchElement();
        }
    }, [elementId, fetchedNodes])

    if (loading) {
        return <p>Loading...</p>;
    }

    const handleSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
        const nodeName = e.currentTarget.name;
        const nodeId = parseInt(e.currentTarget.id);
        setSelectedList((prevList) => [...prevList, { id: nodeId, name: nodeName }]);
        setNodeList((prevList) => prevList.filter((node) => node.name !== nodeName));
    };

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        const nodeName = e.currentTarget.name;
        const nodeId = parseInt(e.currentTarget.id);
        setSelectedList((prevList) => prevList.filter((node) => node.name !== nodeName));
        setNodeList((prevList) => [...prevList, { id: nodeId, name: nodeName }]);
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const filteredNodes = selectedList.map((node) => node.id);
        type ElementType = "point" | "line" | "triangle" | "square";
        let elementType:ElementType = "point";
 switch (filteredNodes.length) {
                case 1:
                    elementType = "point";
                    
                    break;
                case 2:
                    elementType = "line";
                    
                    break;
                case 3:
                    elementType = "triangle";
                    
                    break;
                case 4:
                    elementType = "square";
                    
                    break;
                default:
                    alert("You can't have more than 4 nodes in an element.");
                    break;
            }
        if (projectId && onFormSubmit) {
            const executeSubmit = async () => {
                try {
                    const response = await axios.post("/api/elements", {
                        name: elementName,
                        type: elementType,
                        projectId: projectId,
                        nodes: filteredNodes,
                    });
                    const elementId = response.data.id;
                    for (const node of filteredNodes) {
                        await axios.put("/api/nodes/updateNodes", {
                            nodeId: node,
                            elementId: elementId,
                        });
                    }
                    onFormSubmit();
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        const data = error.response.data;
                        if (data.error) {
                            alert("Node name is taken, please create another name.");
                        } else {
                            alert('Failed to create project. Please try again later.');
                        }
                    } else {
                        alert('An unexpected error occurred. Please try again later.');
                    }
                }
            };
            executeSubmit()
           
        }

        if (elementId) {
            console.log({ elementId: elementId, updateNodes: filteredNodes })
            const response = await fetch(`/api/elements/${elementId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({nodes: filteredNodes,type:elementType }),
            });

            alert(await response.json)
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setElementName(e.target.value);
    };

    return (
        <div className="flex flex-col w-auto h-auto justify-center items-center ">
            <div className="flex w-full justify-around my-2">
                <label>Element Name</label>
                <input
                    className="border-b-2 border-gray-500 bg-transparent focus:outline-none focus:border-blue-500"
                    type="text"
                    value={elementName}
                    onChange={handleInput}
                />
            </div>
            <div className="flex flex-row w-auto h-auto justify-center items-center ">
                <div className="flex flex-col mx-10 my-10 h-[500px] w-[200px] p-6 bg-gray-100 rounded-lg shadow-lg">
                    {nodeList.map((item) => (
                        <button
                            key={item.id}
                            className="bg-white shadow-lg text-black m-2 h-auto"
                            id={String(item.id)}
                            name={item.name}
                            onClick={handleSelect}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
                <div className="flex flex-col mx-10 h-[500px] w-[200px] p-6 bg-gray-100 rounded-lg shadow-lg">
                    {selectedList.map((item) => (
                        <button
                            key={item.id}
                            className="bg-white shadow-lg text-black m-2 h-auto"
                            id={String(item.id)}
                            name={item.name}
                            onClick={handleDelete}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex justify-center">
                <button
                    className="px-6 py-3 mx-5 w-[180] text-lg bg-blue-400 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                    onClick={handleSubmit}
                >
                    Add Element
                </button>
            </div>
        </div>
    );
}

export default AddElement;
