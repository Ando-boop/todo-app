import type {Folder} from "./todo.ts";

export interface FolderListProps {
    folders: Folder[]
    activeFolderId: number
    onSelectFolder: (id: number) => void
}
