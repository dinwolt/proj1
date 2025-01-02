import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5000");
type ProjectStats = {
    project_id: number;
    node_count: number;
    element_count: number;
  };

  type props = {
    projectId: number;
  }


export default function ProjectData({projectId}:props){
    const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      socket.on("connect", () => {
        console.log("Connected to server")
      });
  
      socket.on("response_data", (data: any) => {
        console.log("Received data:", data)
        setLoading(false)
  
        if (data.error) {
          setError(data.error)
        } else {
          setProjectStats(data)
          setError(null)
        }
      });
  
      return () => {
        socket.off("connect");
        socket.off("response_data");
      };
    }, []);
  
    const fetchProjectData = async () => {
      if (!loading) {
        setLoading(true)
        setProjectStats(null)
        setError(null)
        console.log("Requesting project data for projectId:", projectId)
        setTimeout(() => {
          socket.emit("request_data", { projectId })
        }, 1000)
      }
    };
  
    useEffect(() => {
     
        fetchProjectData()
      
    },[projectId])
  
  
    return (
    
        <div>
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full border-t-4 border-blue-600 w-16 h-16 mb-4"></div>
              <p>Loading...</p>
            </div>
          ) : error ? (
            <p>Error: {error}</p>
          ) : projectStats ? (
            <div>
              <p>Project ID: {projectStats.project_id}</p>
              <p>Number of nodes: {projectStats.node_count}</p>
              <p>Number of elements: {projectStats.element_count}</p>
            </div>
          ) : (
            <p>No data available for this project.</p>
          )}
          
        </div>
 
    );
}