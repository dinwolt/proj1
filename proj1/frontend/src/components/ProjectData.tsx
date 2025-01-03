import { useState, useEffect } from "react"
import { io } from "socket.io-client"

const socket = io("http://127.0.0.1:5000")
type ProjectStats = {
    project_id: number
    node_count: number
    element_count: number
  }

  type props = {
    projectId: number
  }


export default function ProjectData({projectId}:props){
    const [projectStats, setProjectStats] = useState<ProjectStats | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
  
    useEffect(() => {
      socket.on("connect", () => {
        console.log("Connected to server")
      })
  
      socket.on("response_data", (data: any) => {
        console.log("Received data:", data)
        setLoading(false)
  
        if (data.error) {
          setError(data.error)
        } else {
          setProjectStats(data)
          setError(null)
        }
      })
  
      return () => {
        socket.off("connect")
        socket.off("response_data")
      }
    }, [])
  
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
    }
  
    useEffect(() => {
     
        fetchProjectData()
      
    },[projectId])
  
  
    return (
      <div className="m-2">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full border-t-4 border-blue-600 w-16 h-16 mb-4"></div>
          <p className="text-blue-600 font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : projectStats ? (
        <div className="space-y-4">
          <div className="text-lg font-bold text-gray-800">Project Details</div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">Project ID: <span className="font-semibold">{projectStats.project_id}</span></p>
            <p className="text-gray-600">Number of Nodes: <span className="font-semibold">{projectStats.node_count}</span></p>
            <p className="text-gray-600">Number of Elements: <span className="font-semibold">{projectStats.element_count}</span></p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No data available for this project.</p>
      )}
    </div>
    )
}