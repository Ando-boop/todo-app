import type { Todo } from '../types/todo'
import {type FormEvent, useState} from "react";
import TodoItem from "./TodoItem.tsx";
import TodoItemProps from "./TodoItem.tsx";


function TodoList({todo, onDelete, onUpdate} : TodoItermProps) {
    const [todos, setTodos] = useState<Todo[]>([])
    const [text, setText] = useState<string>('')

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const trimmed = text.trim()
        if(!trimmed) return
        const newTodo: Todo = {id: Date.now(), text: trimmed}
        setTodos([...todos, newTodo])
        setText('')
    }

    function handleUpdate(id: number, newText: string) {
        setTodos(todos.map((todo) =>
            todo.id === id ? {...todo, text: newText} : todo
            )
        )
    }

    function handleDelete(id: number) {
        setTodos(todos.filter((todo) => todo.id !== id))
    }

  return (
    <>
      <h1>My Todos</h1>
      <hr />
        <form onSubmit={handleSubmit}>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
            <button type="submit">Add</button>
        </form>

      <ul>
          {todos.map((todo : Todo) => (
              <TodoItem key={todo.id} todo={todo} onDelete={handleDelete}/>
          ))}
      </ul>
    </>
  )
}

export default TodoList
