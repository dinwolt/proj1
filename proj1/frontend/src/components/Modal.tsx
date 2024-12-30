import { useState } from 'react';

interface ModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: number;
}

type ProjectStats = {
  project_id: number;
  node_count: number;
  element_count: number;
}
//https://realpython.com/python-sockets/
const Modal: React.FC<ModalProps> = ({ showModal, setShowModal, projectId }) => {
  const [projectStats, setProjectStats] = useState<ProjectStats>({ project_id: -1, node_count: 0, element_count: 0 });

  const fetchCounts = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/projects/${projectId}/count`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setProjectStats(data); 
    } catch (error) {
      console.error(error);
    }
  };
  if (showModal && projectStats.project_id === -1) {
    fetchCounts();
  }

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      

      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      {projectStats.project_id !== -1 ? (
        <div>
          <p>Number of nodes: {projectStats.node_count}</p>
          <p>Number of elements: {projectStats.element_count}</p>
        </div>
      ) : (
        <p>Loading...</p>
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
