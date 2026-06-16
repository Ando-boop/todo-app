import type {Folder} from "./todo.ts";

export interface FolderDrawerProps {
    isOpen: boolean
    onClose: () => void
    folders: Folder[]
    activeFolderId: number
    onSelectFolder: (id: number) => void
    onAddFolder: (name: string) => void
}