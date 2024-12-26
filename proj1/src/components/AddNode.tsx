import { useState } from "react";
import "@/app/globals.css"
import axios from "axios";
import { Project } from "@prisma/client";

type NodeProps = {
    project: Project;
    onFormSubmit:()=>void;
  };

function AddNode({ project, onFormSubmit }: NodeProps) {
    const [formData, setFormData] = useState({
        name: "",
        node_X: "",
        node_Y: "",
        node_Z: ""
    });
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let fieldName: string = e.target.name
        let fieldValue: string = e.target.value
        setFormData((prevState) => ({ ...prevState, [fieldName]: fieldValue })
        )

    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        //console.log(formData)
        try {
            const { name, node_X, node_Y, node_Z } = formData;
            const coordinates = { x: Number(node_X), y: Number(node_Y), z: Number(node_Z) };
            await axios.post("/api/nodes", {
                name,
                coordinates,
                projectId: project.id,
              });
              onFormSubmit();
      
            
          } catch (error) {
            console.log(error)
          }
        }
      
    
    return (
        <div className="flex flex-col mx-10 my-10 justify-center h-[300px] w-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <p className="text-center font-semibold my-2">Enter node coordinates</p>
            <form onSubmit={handleSubmit} className="flex flex-col w-[300px] justify-center items-center">
                <div className="flex w-full justify-around my-2">
                    <label>Node Name</label>
                    <input className="border-b-2 border-gray-500 bg-transparent focus:outline-none focus:border-blue-500" type="text" name="name" onChange={handleInput}></input>
                </div>
                <div className="flex w-full justify-around my-2">
                    <label>X</label>
                    <input className="border-b-2 border-gray-500 bg-transparent focus:outline-none focus:border-blue-500" type="text" name="node_X" onChange={handleInput}></input>
                </div>
                <div className="flex  w-full justify-around my-2">
                    <label>Y</label>
                    <input className="border-b-2 border-gray-500 bg-transparent focus:outline-none focus:border-blue-500" type="text" name="node_Y" onChange={handleInput}></input>
                </div>
                <div className="flex  w-full justify-around my-2">
                    <label>Z</label>
                    <input className="border-b-2 border-gray-500 bg-transparent focus:outline-none focus:border-blue-500" type="text" name="node_Z" onChange={handleInput}></input>
                </div>
                <button className="my-5 w-[150] h-auto text-lg bg-blue-400 text-white rounded-lg hover:bg-blue-600 focus:outline-none" type="submit">생성</button>
            </form>

        </div>
    )
}
export default AddNode