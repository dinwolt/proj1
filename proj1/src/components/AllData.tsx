import axios from "axios";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";


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

  useEffect(() => {
    fetchAllData();
  }, [projectId]);

  useEffect(() => {
    if (!fetchedData.elements.length || !canvasRef.current) return;
    const w = 800
    const h = 600
    const { scene, camera, renderer } = sceneSetup(canvasRef, w, h)


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
        console.log(intersects)
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

    return () => {
      scene.clear();
      renderer.dispose();
    };
  }, [fetchedData.elements]);

  return (
    <div>
      {fetchedData ? (
        <div className="flex flex-col justify-center items-center">
          {fetchedData.elements.length !=0 ? (<div
            ref={canvasRef}
            className="w-[800px] h-[600px] my-3"

          />) : <></>}
          {intersectedName ? <p className="font-bold">Last element chosen: {intersectedName}</p> : <p></p>}
          <div className="flex flex-row w-auto h-auto justify-center items-center">
            <div className="flex flex-col mx-10 my-10 h-[300px] w-[200px] p-4 bg-gray-100 rounded-lg shadow-lg overflow-auto scrollbar-hide">
              <p className="font-bold text-center my-1">Elements</p>

              {fetchedData.elements ? fetchedData.elements.map((item, index) => (
                <p className=" before:content-['🔷'] before:mr-2 bg-white shadow-md text-black m-2 h-auto rounded-lg p-1" key={index}>{item.name}</p>
              )) : <p>no Elements yet</p>}
            </div>
            <div className="flex flex-col mx-10 my-10 h-[300px] w-[200px] p-4 bg-gray-100 rounded-lg shadow-lg overflow-auto scrollbar-hide">
              <p className="font-bold text-center my-1">Nodes</p>
              {fetchedData.elements ? fetchedData.nodes.map((item, index) => (
                <p className=" before:content-['📍'] before:mr-2 bg-white shadow-md text-black m-2 h-auto rounded-lg p-1"
                  key={index}
                  style={{
                    fontWeight: item.name === intersectedName ? "bold" : "normal",
                  }}
                >
                  {item.name}
                </p>

              )) : <p>No Nodes yet</p>}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
