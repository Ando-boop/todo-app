import type { Todo } from '../types/todo'
import { FiTrash2 } from 'react-icons/fi'
import { MdOutlineEdit } from "react-icons/md";

export interface TodoItemProps {
    todo: Todo
    onDelete: (id: number) => void
    onUpdate: (id: number, tecoxt: string) => void
}


function TodoItem({todo, onDelete}: TodoItemProps) {
    return (
        <li>
            <span>{todo.text}</span>
            <button className="edit-btn">
                <MdOutlineEdit />
            </button>
            <button className="delete-btn" onClick={() => onDelete(todo.id)}>
                <FiTrash2 />
            </button>
        </li>
    )
}

export default TodoItem