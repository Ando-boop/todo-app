import { FiTrash2 } from 'react-icons/fi'
import type {TodoItemProps} from "../types/TodoItemProps.ts";
import {useState} from "react";
import { FaEdit } from "react-icons/fa";

function TodoItem({todo, onDelete, onUpdate}: TodoItemProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [draft, setDraft] = useState<string>(todo.text)

    function handleSave() {
        const trimmed = draft.trim()
        if (!trimmed) return;
        onUpdate(todo.id, trimmed)
        setIsEditing(false)
    }

    return (
        <li>
            {isEditing ? (
                <input value={draft} onChange={(e) => setDraft(e.target.value)}/>
            ) : (
                <span>{todo.text}</span>
            )}
            {isEditing ? (
                <button className="edit-btn" onClick={handleSave}>
                    <FaEdit />
                </button>
            ) : (
                <button className="edit-btn" onClick={() => {
                    setDraft(todo.text)
                    setIsEditing(true)
                }}>
                    <FaEdit />
                </button>
            )}

            <button className="delete-btn" onClick={() => onDelete(todo.id)}>
                <FiTrash2 />
            </button>
        </li>
    )
}

export default TodoItem