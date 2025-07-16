"use client"

import type { ProjectNavigationState } from '@/shared/hooks/useProjectNavigation';
import { useProjectNavigation } from '@/shared/hooks/useProjectNavigation';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface FolderStructure {
  id: string
  name: string
  minDocuments: number
  documents: any[]
  subfolders: FolderStructure[]
  parentId?: string
  daysLimit?: number
}

interface ProjectNavigationContextType extends ProjectNavigationState {
  setCurrentProject: (project: { id: string; name: string } | null, structure?: FolderStructure) => void;
  navigateToFolder: (path: string[], folderNames?: string[]) => void;
  navigateBack: () => void;
  backToProjects: () => void;
  getSiblingFolders: (path: string[]) => Array<{ name: string, id: string, current: boolean }>;
  getRootFolders: () => Array<{ name: string, id: string, current: boolean }>;
}

const ProjectNavigationContext = createContext<ProjectNavigationContextType | undefined>(undefined);

export function ProjectNavigationProvider({ children }: { children: ReactNode }) {
  const navigation = useProjectNavigation();

  return (
    <ProjectNavigationContext.Provider value={navigation}>
      {children}
    </ProjectNavigationContext.Provider>
  );
}

export function useProjectNavigationContext() {
  const context = useContext(ProjectNavigationContext);
  if (context === undefined) {
    throw new Error('useProjectNavigationContext debe ser usado dentro de ProjectNavigationProvider');
  }
  return context;
} 