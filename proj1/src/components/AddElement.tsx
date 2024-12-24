import { useState } from "react"
import "@/app/globals.css"

function AddElement() {
    const [nodeList, setNodeList]  = useState(["node 1", "node 2", "node 3", "node 4"])
    const [selectedList, setSelectedList] = useState<string[]>([])

    const handleSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
        const nodeName = e.currentTarget.name
        setSelectedList((prevList) => [...prevList, nodeName])
        setNodeList((prevList) => prevList.filter((node) => node !== nodeName));
    }
    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        const nodeName = e.currentTarget.name;
        setSelectedList((prevList) => prevList.filter((node) => node !== nodeName));
        setNodeList((prevList) => [...prevList, nodeName])
    };

    return (
        <div >
        <div className="flex flex-row w-auto h-auto justify-center items-center ">
            <div className="flex flex-col mx-10 my-10 h-[500px] w-[200px] p-6 bg-gray-100 rounded-lg shadow-lg">
                {
                    nodeList.map(item =>
                        <button className="bg-white shadow-lg text-black m-2 h-auto" name={item} onClick={handleSelect}>{item}</button>)
                }
            </div>
            <div className="flex flex-col mx-10 h-[500px] w-[200px] p-6 bg-gray-100 rounded-lg shadow-lg">
                {
                    selectedList.map(item =>
                        <button className="bg-white shadow-lg text-black m-2 h-auto" name={item} onClick={handleDelete}>{item}</button>)
                }
            </div>
           
 
        </div>
        <div className="flex justify-center"> <button className="px-6 py-3 mx-5 w-[180] text-lg bg-blue-400 text-white rounded-lg hover:bg-blue-600 focus:outline-none" >Add Element</button></div>

        </div>
    )
}
export default AddElement