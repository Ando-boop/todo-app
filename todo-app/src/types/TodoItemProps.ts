import type {Todo} from "./todo.ts";

export interface TodoItemProps {
    todo: Todo,
    onDelete: (id: number) => void,
    onUpdate: (id: number, text: string) => void
}


