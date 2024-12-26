"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import "@/app/globals.css"
import axios from "axios";
import { Project } from "@prisma/client";

function NewProjectsPage() {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
    });
    const router = useRouter();

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let fieldName: string = e.target.name;
        let fieldValue: string = e.target.value;
        setFormData((prevState) => ({ ...prevState, [fieldName]: fieldValue }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //console.log(formData);

        try {
            const data ={name:formData.name, createdAt: new Date(), nodes: [], elements:[]}
            const response = await axios.post('/api/projects', data);
            alert(`Project created: ${JSON.stringify(response.data)}`)
            
            router.push({
                pathname: '/ProjectPage',
                query: {
                    project: JSON.stringify(response.data), // Pass project as a JSON string
                  },
            });
         }
        catch(error) {
            console.error("error creating project ", error)
            alert('durashechka')
         }

        
    };

    return (
        <div className="flex justify-center items-center h-screen p-5">
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
                <div className="flex flex-col mb-4">
                    <label htmlFor="projectId" className="mb-2 text-lg">프로젝트 ID</label>
                    <input
                        id="projectId"
                        type="text"
                        name="id"
                        onChange={handleInput}
                        className="p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="projectName" className="mb-2 text-lg">프로젝트 이름</label>
                    <input
                        id="projectName"
                        type="text"
                        name="name"
                        onChange={handleInput}
                        className="p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    className="h-12 w-36 bg-white border border-black rounded-full hover:bg-blue-500 hover:text-white focus:outline-none"
                >
                    프로젝트 시작
                </button>
            </form>
        </div>
    );
}

export default NewProjectsPage;
