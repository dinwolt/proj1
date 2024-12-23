"use client";
import { useState } from "react";
import { useRouter } from "next/router";

function NewProjectsPage() {
    const [formData, setFormData] = useState({
        projectId: "",
        projectName: "",
    });
    const router = useRouter();

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let fieldName: string = e.target.name;
        let fieldValue: string = e.target.value;
        setFormData((prevState) => ({ ...prevState, [fieldName]: fieldValue }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log(formData);
        router.push({
            pathname: '/ProjectPage',
            query: formData
        });
    };

    return (
        <div className="flex justify-center items-center h-screen p-5">
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
                <div className="flex flex-col mb-4">
                    <label htmlFor="projectId" className="mb-2 text-lg">프로젝트 ID</label>
                    <input
                        id="projectId"
                        type="text"
                        name="projectId"
                        onChange={handleInput}
                        className="p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="projectName" className="mb-2 text-lg">프로젝트 이름</label>
                    <input
                        id="projectName"
                        type="text"
                        name="projectName"
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
