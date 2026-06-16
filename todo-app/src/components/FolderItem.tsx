import type {Folder} from "../types/todo.ts";

interface FolderItemProps {
    folder: Folder
    isActive: boolean
    onSelectFolder: (id: number) => void
}

function FolderItem({folder, isActive, onSelectFolder}: FolderItemProps) {
    return (
        <li
            className={isActive ? 'folder active' : 'folder'}
            onClick={() => onSelectFolder(folder.id)}
        >
            {folder.name}
            {isActive && ' ●'}
        </li>
    );
}

export default FolderItem;
