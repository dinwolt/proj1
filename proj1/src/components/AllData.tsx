import axios from "axios";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

type DataProps = {
  projectId: number;
};

type ProjectData = {
  elements: any[];
  nodes: any[];
};

type Node = {
  id: number;
  name: string;
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  projectId: number;
};

export default function AllData({ projectId }: DataProps) {
  const [fetchedData, setFetchedData] = useState<ProjectData>({
    elements: [],
    nodes: [],
  });
  const canvasRef = useRef<HTMLDivElement>(null);

  
  const fetchAllData = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      setFetchedData(response.data);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  
  const fetchCoordinates = async (elementId: number) => {
    try {
      const response = await axios.get(`/api/elements/${elementId}`);
      console.log(`AAAAAAAAAAAAAAAAAAAAAAAA   ${response.data}`)
      const nodePoints = response.data;
      const points: THREE.Vector3[] = [];
      console.log(nodePoints)
      nodePoints.forEach((item: Node) => {
        points.push(
          new THREE.Vector3(item.coordinates.x, item.coordinates.y, item.coordinates.z)
        );
      });
      console.log(points)
      return points;
      
    } catch (error) {
      console.error("Error fetching project data:", error);
      return []; 
    }
  };


  useEffect(() => {
    fetchAllData();
  }, [projectId]);

  useEffect(() => {
    if (!fetchedData.elements.length || !canvasRef.current) return;


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);


    renderer.setClearColor(0xffffff); 

    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const material = new THREE.LineBasicMaterial({ color: 0x000000 }); 


    const addPointsToScene = async () => {
      const allPoints: THREE.Vector3[] = [];


      const fetchPromises = fetchedData.elements.map(async (item) => {
        const points = await fetchCoordinates(item.id);
        allPoints.push(...points); 
      });

      await Promise.all(fetchPromises);



      const geometry = new THREE.BufferGeometry().setFromPoints(allPoints);


      const line = new THREE.Line(geometry, material);
      scene.add(line);

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
    };

    addPointsToScene();


    {/*return () => {
      scene.clear(); 
      renderer.dispose(); 
    };*/}
  }, [fetchedData.elements]);

  return (
    <div>
      {fetchedData ? (
        <div className="flex flex-col">
          {/*<div ref={canvasRef} style={{ width: "100vw", height: "100vh" }} />*/}
          <div className="flex flex-row w-auto h-auto justify-center items-center ">
            <div className="flex flex-col mx-10 my-10 h-auto w-[200px] p-6 bg-gray-100 rounded-lg shadow-lg">
              {fetchedData.elements.map((item, index) => (
                <p key={index}>{item.name}</p>
              ))}
            </div>
            <div className="flex flex-col mx-10 my-10 h-auto w-[200px] p-6 bg-gray-100 rounded-lg shadow-lg">
              {fetchedData.nodes.map((item, index) => (
                <p key={index}>{item.name}</p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
