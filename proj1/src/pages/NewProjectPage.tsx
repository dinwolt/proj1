"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

//TODO: pofixit state obnovlyaetsa s opozdaniem

function ProjectsPage() {
    const [formData, setFormData] = useState({
        projectId: "",
        projectName: "",
    });
    const router = useRouter()

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let fieldName: string = e.target.name
        let fieldValue: string = e.target.value
        setFormData((prevState) => ({ ...prevState, [fieldName]: fieldValue })
        )
       
    }
    function handleClick() {
        console.log('increment like count');
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>):void => {
        e.preventDefault()
        console.log(formData)
        router.push({
            pathname:'/ProjectPage',
            query:formData
        })
    }

    return (
        <div className="main-container">
            <div className="data-container">
                <form onSubmit={handleSubmit}>
                    <div className="field-contaner">
                        <label>프로젝트 ID</label>
                        <input type="text" name="projectId" onChange={handleInput}></input>
                    </div>
                    <div className="field-contaner">
                        <label>프로젝트 ID</label>
                        <input type="text" name="projectName" onChange={handleInput}></input>
                    </div>
                    <button type="submit">프로젝트 시작</button>
                </form>
            </div>
        </div>
    );
}

export default ProjectsPage