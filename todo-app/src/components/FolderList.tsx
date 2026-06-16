import type {FolderListProps} from "../types/FolderListProps.ts";
import FolderItem from "./FolderItem.tsx";

function FolderList({folders, activeFolderId, onSelectFolder}: FolderListProps) {
    return (
        <ul>
            {folders.map((folder) => (
                <FolderItem
                    key={folder.id}
                    folder={folder}
                    isActive={folder.id === activeFolderId}
                    onSelectFolder={onSelectFolder}
                />
            ))}
        </ul>
    );
}

export default FolderList;
