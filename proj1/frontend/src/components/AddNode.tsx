import { useState, useEffect } from "react";
import "@/app/globals.css";
import axios from "axios";
import { Project } from "@prisma/client";

type NodeProps = {
    project?: Project;
    onFormSubmit?: () => void;
    nodeId?: number;
    onEditted?: () => void;
};

function AddNode({ project, onFormSubmit, nodeId, onEditted }: NodeProps) {
    const [formData, setFormData] = useState({
        name: "",
        node_X: "",
        node_Y: "",
        node_Z: "",
    });

    useEffect(() => {
        if (nodeId) {
            const fetchNodeData = async () => {
                try {
                    const response = await fetch(`/api/nodes/${nodeId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setFormData({
                            name: data.name || "",
                            node_X: data.coordinates?.x || "",
                            node_Y: data.coordinates?.y || "",
                            node_Z: data.coordinates?.z || "",
                        });
                    } else {
                        console.error("Failed to fetch node data");
                    }
                } catch (error) {
                    console.error("Error fetching node data:", error);
                }
            };

            fetchNodeData();
        }
    }, [nodeId]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {



        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (nodeId) {
            try {
                const { name, node_X, node_Y, node_Z } = formData;
                const coordinates = { x: Number(node_X), y: Number(node_Y), z: Number(node_Z) };
                const updatedData = {
                    name: formData.name,
                    coordinates: coordinates,
                };

                console.log({ nodeId, updatedData })
                const response = await fetch('/api/nodes/updateNodes', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nodeId, updatedData }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to update node: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Node updated:', data);
                if (onEditted) {
                    onEditted(); 
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        else {
            try {
                const { name, node_X, node_Y, node_Z } = formData;
                const coordinates = { x: Number(node_X), y: Number(node_Y), z: Number(node_Z) };

                if (project && onFormSubmit) {
                    await axios.post("/api/nodes", {
                        name,
                        coordinates,
                        projectId: project.id,
                    });
                    onFormSubmit();
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const data = error.response.data;
                    if (data.error) {
                        alert("Name of the node is taken, please create another name.");
                    } else {
                        alert("Failed to create project. Please try again later.");
                    }
                } else {
                    alert("An unexpected error occurred. Please try again later.");
                }
            }
        }

    };

    return (
        <div className="flex flex-col mx-10 my-10 justify-center h-auto w-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <p className="text-center font-semibold my-2">Enter node coordinates</p>
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md justify-center items-center space-y-4">
                <div className="flex flex-col w-full space-y-2">
                    <label className="text-sm font-medium">Node Name</label>
                    <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        value={formData.name}
                        name="name"
                        onChange={handleInput}
                    />
                </div>
                <div className="flex flex-col w-full space-y-2">
                    <label className="text-sm font-medium">X</label>
                    <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        value={formData.node_X}
                        name="node_X"
                        onChange={handleInput}
                    />
                </div>
                <div className="flex flex-col w-full space-y-2">
                    <label className="text-sm font-medium">Y</label>
                    <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        value={formData.node_Y}
                        name="node_Y"
                        onChange={handleInput}
                    />
                </div>
                <div className="flex flex-col w-full space-y-2">
                    <label className="text-sm font-medium">Z</label>
                    <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        value={formData.node_Z}
                        name="node_Z"
                        onChange={handleInput}
                    />
                </div>
                <button
                    className="mt-4 w-full max-w-sm px-4 py-2 text-lg bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    type="submit"
                >
                    생성
                </button>
            </form>
        </div>

    );
}

export default AddNode;
