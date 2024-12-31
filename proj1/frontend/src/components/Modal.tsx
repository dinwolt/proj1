import { useState, useEffect } from "react"
import { io } from "socket.io-client"

const socket = io("http://127.0.0.1:5000")

interface ModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: number;
}

type ProjectStats = {
  project_id: number;
  node_count: number;
  element_count: number;
};

const Modal: React.FC<ModalProps> = ({ showModal, setShowModal, projectId }) => {
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server")
    });

    socket.on("response_data", (data: any) => {
      console.log("Received data:", data)
      setLoading(false);

      if (data.error) {
        setError(data.error)
      } else {
        setProjectStats(data)
        setError(null)
      }
    });

    return () => {
      socket.off("connect")
      socket.off("response_data")
    };
  }, []);

  const fetchProjectData = () => {
    if (!loading) {
      setLoading(true)
      setProjectStats(null)
      setError(null)
      console.log("Requesting project data for projectId:", projectId)
      socket.emit("request_data", { projectId })
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchProjectData()
    }
  }, [showModal]);

  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {loading ? (
          <p>Loading...</p>
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
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-xl font-bold text-gray-700 hover:text-gray-900"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Modal;
