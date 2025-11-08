import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type ContentType = 'link' | 'article' | 'text';

export interface FolderContent {
  id: string;
  type: ContentType;
  value: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  contents: FolderContent[];
}

interface FolderContextType {
  folders: Folder[];
  addFolder: (name: string) => Folder;
  addContent: (folderId: string, type: ContentType, value: string) => void;
  getFolder: (folderId: string) => Folder | undefined;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export function FolderProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);

  const addFolder = (name: string): Folder => {
    const folder: Folder = { id: crypto.randomUUID(), name, contents: [] };
    setFolders((prev) => [folder, ...prev]);
    return folder;
  };

  const addContent = (folderId: string, type: ContentType, value: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? {
              ...f,
              contents: [
                { id: crypto.randomUUID(), type, value, createdAt: new Date().toISOString() },
                ...f.contents,
              ],
            }
          : f,
      ),
    );
  };

  const getFolder = (folderId: string) => folders.find((f) => f.id === folderId);

  return (
    <FolderContext.Provider value={{ folders, addFolder, addContent, getFolder }}>
      {children}
    </FolderContext.Provider>
  );
}

export function useFolders() {
  const ctx = useContext(FolderContext);
  if (!ctx) throw new Error('useFolders must be used within FolderProvider');
  return ctx;
}
