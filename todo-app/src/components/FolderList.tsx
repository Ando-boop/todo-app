import type {FolderListProps} from "../types/FolderListProps.ts";

function FolderList({folders, activeFolderId, onSelectFolder}: FolderListProps) {
    return (
        <ul>
            {folders.map((folder) => (
                <li
                    key={folder.id}
                    className={folder.id === activeFolderId ? 'folder active' : 'folder'}
                    onClick={() => onSelectFolder(folder.id)}
                >
                    {folder.name}
                    {folder.id === activeFolderId && ' ●'}
                </li>
            ))}
        </ul>
    );
}

export default FolderList;
