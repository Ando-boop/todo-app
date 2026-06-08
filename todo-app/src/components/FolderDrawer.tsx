import type {FolderDrawerProps} from "../types/FolderDrawerProps.ts";
import FolderList from "./FolderList.tsx";
import AddFolderForm from "./AddFolderForm.tsx";

function FolderDrawer({
                     isOpen,
                     onClose,
                     folders,
                     activeFolderId,
                     onSelectFolder,
                     onAddFolder,
                 }: FolderDrawerProps) {
    return (
        <>
            {isOpen && <div className="backdrop" onClick={onClose} />}

            <aside className={`drawer ${isOpen ? 'open' : ''}`}>
                <button className="menu-btn" onClick={onClose}>✕</button>
                <h2>Folders</h2>

                <FolderList
                    folders={folders}
                    activeFolderId={activeFolderId}
                    onSelectFolder={onSelectFolder}
                />

                <AddFolderForm onAddFolder={onAddFolder} />
            </aside>
        </>
    );
}

export default FolderDrawer;
