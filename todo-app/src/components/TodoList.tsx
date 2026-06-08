import type {Folder, Todo} from '../types/todo'
import { type FormEvent, useState, useEffect } from "react";
import TodoItem from "./TodoItem.tsx";
import { FiMenu } from "react-icons/fi";
import FolderDrawer from "./FolderDrawer.tsx";

function TodoList() {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem('todos')
        return saved ? JSON.parse(saved) : []
    })

    const [folders, setFolders] = useState<Folder[]>(() => {
        const saved = localStorage.getItem('folders')
        const parsed = saved ? JSON.parse(saved) : []
        return parsed.length > 0 ? parsed : [{ id: Date.now(), name: 'My Todos' }]
    })
    const [activeFolderId, setActiveFolderId] = useState<number>(folders[0].id)

    const [text, setText] = useState('')
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos])

    useEffect(() => {
        localStorage.setItem('folders', JSON.stringify(folders))
    }, [folders])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const trimmed = text.trim()
        if (!trimmed) return
        const newTodo: Todo = { id: Date.now(), text: trimmed, folderId: activeFolderId}
        setTodos([...todos, newTodo])
        setText('')
    }

    function handleUpdate(id: number, newText: string) {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, text: newText } : todo
            )
        )
    }

    function handleDelete(id: number) {
        setTodos(todos.filter((todo) => todo.id !== id))
    }

    function handleAddFolder(name: string) {
        const newFolder: Folder = { id: Date.now(), name }
        setFolders([...folders, newFolder])
    }

    return (
        <>
            <button className="menu-btn" onClick={() => setIsDrawerOpen(true)}>
                <FiMenu />
            </button>
            <FolderDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                folders={folders}
                activeFolderId={activeFolderId}
                onSelectFolder={setActiveFolderId}
                onAddFolder={handleAddFolder}
            />

            <h1>My Todos</h1>
            <hr />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit">Add</button>
            </form>

            <ul>
                {todos.map((todo: Todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                    />
                ))}
            </ul>
        </>
    )
}

export default TodoList