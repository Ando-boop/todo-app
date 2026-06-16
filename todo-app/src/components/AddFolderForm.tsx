import {type FormEvent, useState} from "react";
import {IoIosAddCircle} from "react-icons/io";
import type {AddFolderFormProps} from "../types/AddFolderFormProps.ts";

function AddFolderForm({onAddFolder}: AddFolderFormProps) {
    const [name, setName] = useState('')

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const trimmed = name.trim()
        if (!trimmed) return
        onAddFolder(trimmed)
        setName('')
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="New folder"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="folder-add-btn">
                <IoIosAddCircle />
            </button>
        </form>
    );
}

export default AddFolderForm;
