import { useState, useCallback } from 'react'

interface Project {
  id: string
  name: string
}

interface FolderStructure {
  id: string
  name: string
  minDocuments: number
  documents: any[]
  subfolders: FolderStructure[]
  parentId?: string
  daysLimit?: number
}

export interface ProjectNavigationState {
  currentProject: Project | null
  currentPath: string[]
  folderNames: string[]
  projectStructure?: FolderStructure
}

export function useProjectNavigation() {
  const [state, setState] = useState<ProjectNavigationState>({
    currentProject: null,
    currentPath: [],
    folderNames: [],
    projectStructure: undefined,
  })

  const setCurrentProject = useCallback(
    (project: Project | null, structure?: FolderStructure) => {
      setState((prev) => ({
        ...prev,
        currentProject: project,
        currentPath: [],
        folderNames: [],
        projectStructure: structure,
      }))
    },
    []
  )

  const navigateToFolder = useCallback(
    (path: string[], folderNames: string[] = []) => {
      setState((prev) => ({
        ...prev,
        currentPath: path,
        folderNames: folderNames,
      }))
    },
    []
  )

  const navigateBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentPath: prev.currentPath.slice(0, -1),
      folderNames: prev.folderNames.slice(0, -1),
    }))
  }, [])

  const backToProjects = useCallback(() => {
    setState({
      currentProject: null,
      currentPath: [],
      folderNames: [],
      projectStructure: undefined,
    })
  }, [])

  const getSiblingFolders = useCallback(
    (path: string[]) => {
      if (!state.projectStructure) return []

      let current = state.projectStructure

      // Navegar hasta la carpeta padre
      for (let i = 0; i < path.length - 1; i++) {
        const found = current.subfolders.find((f) => f.id === path[i])
        if (found) current = found
        else return []
      }

      return current.subfolders.map((folder) => ({
        name: folder.name,
        id: folder.id,
        current: path.length > 0 && path[path.length - 1] === folder.id,
      }))
    },
    [state.projectStructure]
  )

  const getRootFolders = useCallback(() => {
    if (!state.projectStructure) return []

    return state.projectStructure.subfolders.map((folder) => ({
      name: folder.name,
      id: folder.id,
      current:
        state.currentPath.length > 0 && state.currentPath[0] === folder.id,
    }))
  }, [state.projectStructure, state.currentPath])

  return {
    ...state,
    setCurrentProject,
    navigateToFolder,
    navigateBack,
    backToProjects,
    getSiblingFolders,
    getRootFolders,
  }
}
