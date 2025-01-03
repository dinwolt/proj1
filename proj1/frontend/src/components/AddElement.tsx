import { useEffect, useState } from "react";
import "@/app/globals.css";

type NodeProps = {
    projectId?: number;
    onFormSubmit?: () => void;
    elementId?: number;
    onEditted?: () => void;
};

type Node = {
    id: number;
    name: string;
    coordinates: Record<string, unknown>;
    projectId: number;
};

type ProjectData = {
    elements: [];
    nodes: Node[];
};

function AddElement({ projectId, onFormSubmit, elementId, onEditted }: NodeProps) {
    const [nodeList, setNodeList] = useState<Node[]>([]);
    const [selectedList, setSelectedList] = useState<Node[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchedNodes, setFetchedNodes] = useState<Node[]>([]);
    const [elementName, setElementName] = useState("");

    const fetchData = async (url: string, options?: RequestInit) => {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
    };

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!projectId) return;

            try {
                const projectData: ProjectData = await fetchData(`/api/projects/${projectId}`);
                setFetchedNodes(projectData.nodes);

                if (!elementId) {
                    setNodeList(projectData.nodes);
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
                alert("Failed to fetch project data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [projectId, elementId]);


    useEffect(() => {
        const fetchElementData = async () => {
            if (!elementId || fetchedNodes.length === 0) return;

            try {
                const elementData = await fetchData(`/api/elements/${elementId}`);
                const associatedNodes: Node[] = elementData.nodes;

                setElementName(elementData.elementName);
                console.log(elementData)
                setSelectedList(associatedNodes);

                const remainingNodes = fetchedNodes.filter(
                    (node) => !associatedNodes.some((selected) => selected.id === node.id)
                );
                setNodeList(remainingNodes);
            } catch (error) {
                console.error("Error fetching element data:", error);
                alert("Failed to fetch element data.");
            }
        };

        fetchElementData();
    }, [elementId, fetchedNodes]);

    const handleSelect = (node: Node) => {
        setSelectedList((prev) => [...prev, node]);
        setNodeList((prev) => prev.filter((n) => n.id !== node.id));
    };

    const handleDeselect = (node: Node) => {
        setSelectedList((prev) => prev.filter((n) => n.id !== node.id));
        setNodeList((prev) => [...prev, node]);
    };

    const determineElementType = (nodeCount: number) => {
        switch (nodeCount) {
            case 1:
                return "point";
            case 2:
                return "line";
            case 3:
                return "triangle";
            case 4:
                return "square";
            default:
                alert("You can't have more than 4 nodes in an element.");
                return null;
        }
    };

    const handleSubmit = async () => {
        const nodeIds = selectedList.map((node) => node.id);
        const elementType = determineElementType(nodeIds.length);
        if (!elementType) return;

        try {
            if (projectId && !elementId) {
                const response = await fetch(`/api/elements`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: elementName,
                        type: elementType,
                        projectId,
                        nodes: nodeIds,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to create element.");
                }

                const data = await response.json();
                const newElementId = data.id;


                await Promise.all(
                    nodeIds.map((nodeId) =>
                        fetch(`/api/nodes/updateNodes`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ nodeId, elementId: newElementId }),
                        })
                    )
                );

                if (onFormSubmit) onFormSubmit();
            } else if (elementId) {
                await fetch(`/api/elements/${elementId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nodes: nodeIds, type: elementType, name: elementName }),
                });
                alert("Element updated successfully.");
                if (onEditted) {
                    onEditted();
                }
            }
        } catch (error) {
            console.error("Error submitting element:", error);
            alert("Failed to submit element. Please try again.");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center w-full max-w-[600px] mx-auto p-4 bg-gray-50 rounded-lg shadow-lg space-y-6">
            
            <div className="flex w-full p-4 items-center justify-between space-x-4">
                <label htmlFor="element-name" className="text-lg font-medium">
                    Element Name
                </label>
                <input
                    id="element-name"
                    className="flex-1 border-b-2 border-gray-500 bg-transparent focus:outline-none focus:border-blue-500 text-sm p-1"
                    type="text"
                    value={elementId ? elementName : ""}
                    onChange={(e) => setElementName(e.target.value)}
                />
            </div>
            
            <div className="flex flex-wrap justify-center items-start space-x-6 w-full">
                <div className="flex flex-col h-[400px] w-[220px] p-4 bg-gray-100 rounded-lg shadow-md overflow-auto">
                    <h3 className="text-center text-lg font-semibold mb-2">Nodes</h3>
                    {nodeList.length ? (
                        nodeList.map((node) => (
                            <button
                                key={node.id}
                                className="bg-white text-black shadow-md m-2 px-4 py-2 rounded-lg hover:bg-blue-100 focus:outline-none"
                                onClick={() => handleSelect(node)}
                            >
                                {node.name}
                            </button>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No nodes available</p>
                    )}
                </div>

                <div className="flex flex-col h-[400px] w-[220px] p-4 bg-gray-100 rounded-lg shadow-md overflow-auto">
                    <h3 className="text-center text-lg font-semibold mb-2">Selected</h3>
                    {selectedList.length ? (
                        selectedList.map((node) => (
                            <button
                                key={node.id}
                                className="bg-white text-black shadow-md m-2 px-4 py-2 rounded-lg hover:bg-red-100 focus:outline-none"
                                onClick={() => handleDeselect(node)}
                            >
                                {node.name}
                            </button>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No nodes selected</p>
                    )}
                </div>
            </div>
            
            <div className="flex justify-center">
                <button
                    className="px-6 py-2 text-lg bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                    onClick={handleSubmit}
                >
                    {elementId ? "Update Element" : "Add Element"}
                </button>
            </div>
        </div>
    );
}

export default AddElement;
