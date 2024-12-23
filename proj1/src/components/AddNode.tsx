import { useState } from "react";
function AddNode() {
    const [formData, setFormData] = useState({
        node_X: "",
        node_Y: "",
        node_Z: ""
    });
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let fieldName: string = e.target.name
        let fieldValue: string = e.target.value
        setFormData((prevState) => ({ ...prevState, [fieldName]: fieldValue })
        )

    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        console.log(formData)

    }
    return (
        <div className="main-container">
            <div className="data-container">
                <form onSubmit={handleSubmit}>
                    <div className="field-contaner">
                        <label>X</label>
                        <input type="text" name="node_X" onChange={handleInput}></input>
                    </div>
                    <div className="field-contaner">
                        <label>Y</label>
                        <input type="text" name="node_Y" onChange={handleInput}></input>
                    </div>
                    <div className="field-contaner">
                        <label>Z</label>
                        <input type="text" name="node_Z" onChange={handleInput}></input>
                    </div>
                    <button type="submit">생성</button>
                </form>
            </div>
        </div>
    )
}
export default AddNode