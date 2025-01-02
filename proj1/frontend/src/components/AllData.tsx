import axios from "axios";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Modal from "./Modal";
import AddNode from "./AddNode";
import AddElement from "./AddElement";
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
function sceneSetup(canvasRef: React.RefObject<HTMLDivElement | null>, canvasWidth: number, canvasHeight: number): { scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer } {
  const scene = new THREE.Scene();
  scene.clear();

  const camera = new THREE.PerspectiveCamera(
    15,
    canvasWidth / canvasHeight,
    0.1,
    1000
  );

  const axesHelper = new THREE.AxesHelper(100)
  const gridHelper = new THREE.GridHelper(100, 50, "#d9d9d9", "#d9d9d9")

  scene.add(gridHelper)
  scene.add(axesHelper)

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  if (canvasRef.current) {
    canvasRef.current.appendChild(renderer.domElement);
  }
  renderer.setClearColor(0xffffff);
  const orbit = new OrbitControls(camera, renderer.domElement)
  camera.position.set(100, 100, 100);
  orbit.update()
  camera.lookAt(0, 0, 0);
  return { scene, camera, renderer }

}


export default function AllData({ projectId }: DataProps) {
  
  let points;
  const [fetchedData, setFetchedData] = useState<ProjectData>({
    elements: [],
    nodes: [],
  });
  const canvasRef = useRef<HTMLDivElement>(null)
  const [intersectedName, setIntersectedName] = useState<string | null>();
  const [updated, setUpdated] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNodeId, setModalNodeId] = useState<number | null>(null);
  const [selectedModal, setSelectedModal] = useState("")
  
  let chosen;

  const closeModal = () => setIsModalOpen(false);
  const openNodeModal = (id: number) => {
    setModalNodeId(id);
    setIsModalOpen(true);
    setSelectedModal("node")
  };
  const openElementModal = (id: number) => {
    setModalNodeId(id);
    setIsModalOpen(true);
    setSelectedModal("element")
  };

  const fetchAllData = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      console.log("wok")
      setFetchedData(response.data);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  const fetchCoordinates = async (elementId: number) => {
    try {
      const response = await axios.get(`/api/elements/${elementId}`);
      const nodePoints = response.data;
      const points: THREE.Vector3[] = [];
      console.log(nodePoints);
      nodePoints.forEach((item: Node) => {
        points.push(
          new THREE.Vector3(item.coordinates.x, item.coordinates.y, item.coordinates.z)
        );
      });
      console.log(points);
      return points;
    } catch (error) {
      console.error("Error fetching project data:", error);
      return [];
    }
  };
  const onEditted = () => {
    closeModal();  
  };
  const handleDelete = async (item:string, id:number)=>{
    let response
    try{
      if(item == "nodes"){
       response = await fetch(`/api/nodes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
      }
      else{
       response = await fetch(`/api/elements/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }), 
        });
      }
      

      if (response.ok) {
        if (item === "nodes") {
          setFetchedData((prevData) => ({
            ...prevData,
            nodes: prevData.nodes.filter((node) => node.id !== id),
          }));
        }
  
        else if (item === "elements") {
          setFetchedData((prevData) => ({
            ...prevData,
            elements: prevData.elements.filter((element) => element.id !== id),
          }));
        }
        setUpdated(true)
      } else {
        const data = await response.json();
        alert(data.error)
      }
    }
    catch(error){}
  }

  useEffect(() => {
    fetchAllData();
  }, [projectId, isModalOpen]);

  useEffect(() => {
    if (!fetchedData.elements.length || !canvasRef.current) return;
    while (canvasRef.current!.firstChild) {
      canvasRef.current!.removeChild(canvasRef.current!.firstChild);
    }
    const w = 800
    const h = 600
    let { scene, camera, renderer } = sceneSetup(canvasRef, w, h);


    const addPointsToScene = async () => {
      const allPoints: THREE.Vector3[] = [];
      const mousePosition = new THREE.Vector2()
      const canvasBounds = renderer.domElement.getBoundingClientRect();
      window.addEventListener("mousemove", (e) => {
        mousePosition.x = ((e.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
        mousePosition.y = -((e.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;
      });
      const rayCaster = new THREE.Raycaster()
      
      const fetchPromises = fetchedData.elements.map(async (item) => {
        const points = await fetchCoordinates(item.id);
        console.log(`Element name: ${item.name} `)
        console.log(`Element nodes: ${points} `)

        let geometry: THREE.BufferGeometry | null = null;

        if (item.type === "point" && points.length === 1) {
          console.log(`Element type: ${item.type} `)
          geometry = new THREE.BufferGeometry().setFromPoints(points)
          const material = new THREE.PointsMaterial({
            color: 0xff0000,
            size: 1,
            sizeAttenuation: true,
          });
          const point = new THREE.Points(geometry, material)
          point.name = item.name
          scene.add(point)
        } else if (item.type === "line" && points.length === 2) {
          const material = new THREE.LineBasicMaterial({ color: 0xd989f0 });
          console.log(`Element type: ${item.type} `)
          geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.LineLoop(geometry, material);
          line.name = item.name
          scene.add(line);
        } else if (item.type === "triangle" && points.length === 3) {
          const geom = new THREE.BufferGeometry();
          const vertices = new Float32Array([
            points[0].x, points[0].y, points[0].z,
            points[1].x, points[1].y, points[1].z,
            points[2].x, points[2].y, points[2].z
          ]);

          geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
          const triangle = new THREE.Triangle(points[0], points[1], points[2]);
          const normal = new THREE.Vector3();
          triangle.getNormal(normal);
          const normals = new Float32Array([
            normal.x, normal.y, normal.z,
            normal.x, normal.y, normal.z,
            normal.x, normal.y, normal.z
          ]);

          geom.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
          const material = new THREE.MeshBasicMaterial({ color: 0xe7f089, side: THREE.DoubleSide });
          const mesh = new THREE.Mesh(geom, material);
          mesh.name = item.name
          scene.add(mesh);
        } else if (item.type === "square" && points.length === 4) {
          console.log(`Element type: ${item.type} `)
          const vertices = new Float32Array([
            points[0].x, points[0].y, points[0].z,
            points[1].x, points[1].y, points[1].z,
            points[2].x, points[2].y, points[2].z,
            points[3].x, points[3].y, points[3].z,
          ]);

          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
          const indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3
          ])
          geometry.setIndex(new THREE.BufferAttribute(indices, 1))
          geometry.computeVertexNormals();
          const material = new THREE.MeshBasicMaterial({ color: 0x89e1f0, side: THREE.DoubleSide });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.name = item.name

          scene.add(mesh);
        }
      });

      await Promise.all(fetchPromises);

      

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        rayCaster.setFromCamera(mousePosition, camera)
        const intersects = rayCaster.intersectObjects(scene.children)
        if (intersects.length > 0) {
          const intersectedObject = intersects.find(obj => obj.object.name);
          if (intersectedObject) {
            setIntersectedName(intersectedObject.object.name);
          }

        } else {
          setIntersectedName(null)
        }
      };
      animate();
    };

    addPointsToScene();

    
  }, [fetchedData]);


  return (
    <div>
      {fetchedData ? (
        <div className="flex flex-col justify-center items-center">
          {fetchedData.elements.length != 0 ? (<div
            ref={canvasRef}
            className="w-[800px] h-[600px] my-3"

          />) : <></>}
          {intersectedName ? <p className="font-bold">Last element chosen: {intersectedName}</p> : <p></p>}
          <div className="flex flex-row w-auto h-auto justify-center items-center">
            <div className="flex flex-col mx-10 my-10 h-[300px] w-[200px] p-4 bg-gray-100 rounded-lg shadow-lg overflow-auto scrollbar-hide">
              <p className="font-bold text-center my-1">Elements</p>
              {fetchedData.elements.length != 0 ? fetchedData.elements.map((item, index) => (
                <div
                  className="group relative bg-white shadow-md text-black m-2 h-auto rounded-lg p-1 flex items-center"
                  key={index}
                  
                >
                  <p className="before:content-['🔷'] before:mr-2 flex-1">
                    {item.name}
                  </p>
                  <div className="absolute right-2 space-4">
                    <button
                    className="text-gray-500 invisible group-hover:visible hover:text-red-500 transition-colors duration-200 focus:outline-none"
                    onClick={()=>{handleDelete("elements", item.id)}}
                  >
                    ✖
                  </button>
                  <button
                      className="text-gray-500 invisible group-hover:visible hover:text-red-500 transition-colors duration-200 focus:outline-none"
                      onClick={() => openElementModal(item.id)}
                    >
                      📝
                    </button>
                  </div>
                </div>
              )) : <p>no Elements yet</p>}
            </div>
            <div className="flex flex-col mx-10 my-10 h-[300px] w-[200px] p-4 bg-gray-100 rounded-lg shadow-lg overflow-auto scrollbar-hide">
              <p className="font-bold text-center my-1">Nodes</p>
              {fetchedData.nodes.length != 0 ? fetchedData.nodes.map((item, index) => (
                <div
                  className="group relative bg-white shadow-md text-black m-2 h-auto rounded-lg p-1 flex items-center"
                  key={index}
                  
                >
                  <p className="before:content-['📍'] before:mr-2 flex-1">
                    {item.name}
                  </p>
                  <div className="absolute right-2 space-4">
                    <button
                    className="text-gray-500 invisible group-hover:visible hover:text-red-500 transition-colors duration-200 focus:outline-none"
                    onClick={()=>{handleDelete("nodes", item.id)}}
                  >
                    ✖
                  </button>
                  <button
                      className="text-gray-500 invisible group-hover:visible hover:text-red-500 transition-colors duration-200 focus:outline-none"
                      onClick={() => openNodeModal(item.id)}
                    >
                      📝
                    </button>
                  </div>
                  

                </div>
              )) : <p>no Nodes yet</p>}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedModal=="node" ? modalNodeId && <AddNode nodeId={modalNodeId} onEditted={onEditted}/> 
        : selectedModal=="element" ? modalNodeId && <AddElement elementId={modalNodeId} projectId={projectId} onEditted={onEditted}/> : <></>}
        
      </Modal>
    </div>
  );
}
