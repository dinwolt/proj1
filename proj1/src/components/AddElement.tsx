import { useState } from "react"

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
        <div className="main-container">
            <div className="list-container">
                {
                    nodeList.map(item =>
                        <button name={item} onClick={handleSelect}>{item}</button>)
                }
            </div>
            <div className="selected-container">
                {
                    selectedList.map(item =>
                        <button name={item} onClick={handleDelete}>{item}</button>)
                }
            </div>
 
        </div>
    )
}
export default AddElement