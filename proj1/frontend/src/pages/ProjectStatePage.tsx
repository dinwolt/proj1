import { useEffect, useState } from 'react';

// Define the type for the project object
interface Project {
    id: number;
    name: string;
    description: string;
    // Add other fields if necessary
}

// Define the props for the ProjectDetail component
interface ProjectDetailProps {
    id: number;
}

const ProjectDetail = ({ id }: ProjectDetailProps) => {
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/api/projects/${id}/count`)
            .then((response) => response.json())
            .then((data) => setProject(data));
    }, [id]);

    if (!project) return <div>Loading...</div>;

    return (
        <div>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
        </div>
    );
};



export default ProjectDetail;
