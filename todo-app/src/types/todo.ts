export type Status = "todo" | 'in-progress' | 'completed'
export type priority = 'low' | 'medium' | 'high'

export interface Todo {
  id: number
  folderId: number
  text: string
}

export interface Folder {
  id: number
  name: string
}