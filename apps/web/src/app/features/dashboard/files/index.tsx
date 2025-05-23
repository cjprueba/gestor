import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { createFileItem, createFolder, getFileTypeFromExtension } from "@/shared/lib/file-utils";
import { Collection, FileItem, FileType, Folder } from "@/shared/types/types";
import { File, FileCode, FileImage, FileIcon as FilePdf, FileText, Folder as FolderIcon, FolderPlus, Grid, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CreateCollectionDialog } from "./_components/create-collection-dialog";
import { CreateFileDialog } from "./_components/create-file-dialog";
import { CreateFolderDialog } from "./_components/create-folder-dialog";
import { FileListItem } from "./_components/file-list-item";
import { FileCard } from "./_components/files-card";
import { UploadDialog } from "./_components/upload-dialog";

export default function FilesPage() {
  // View state
  const [currentView, setCurrentView] = useState<"overview" | "files">("overview")

  // State for dialogs
  const [createFileOpen, setCreateFileOpen] = useState(false)
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [createCollectionOpen, setCreateCollectionOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [recordOpen, setRecordOpen] = useState(false)

  // State for files and folders
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("recent")
  const [collections, setCollections] = useState<Collection[]>([])
  const [activeCollection, setActiveCollection] = useState<string | null>(null)

  useEffect(() => {
    const rootFolder: Folder = {
      id: "root",
      name: "Root",
      path: "/",
      parentId: null,
    }

    const sampleFolders: Folder[] = [
      { id: "product-demos", name: "Product Demos", path: "/product-demos", parentId: null },
      { id: "case-studies", name: "Case Studies", path: "/case-studies", parentId: null },
      { id: "sales-collateral", name: "Sales Collateral", path: "/sales-collateral", parentId: null },
      { id: "training-materials", name: "Training Materials", path: "/training-materials", parentId: null },
    ]

    const sampleFiles: FileItem[] = [
      createFileItem("Q4 Sales Deck", "presentation", 2500000, null, "/q4-sales-deck"),
      createFileItem("Product Videos", "folder", 0, null, "/product-videos"),
      createFileItem("ROI Calculator", "spreadsheet", 1200000, null, "/roi-calculator"),
      createFileItem("Company Overview", "document", 500000, null, "/company-overview"),
      createFileItem("Marketing Plan", "document", 750000, null, "/marketing-plan"),
      createFileItem("Product Demo Video", "video", 15000000, "product-demos", "/product-demos/product-demo-video"),
      createFileItem("Customer Testimonial", "video", 8500000, null, "/customer-testimonial"),
      createFileItem("Brand Guidelines", "document", 3200000, null, "/brand-guidelines"),
      createFileItem("Competitor Analysis", "spreadsheet", 950000, null, "/competitor-analysis"),
      createFileItem("Team Photo", "image", 4500000, null, "/team-photo"),
    ]

    // Set some files as starred for demo
    sampleFiles[0].starred = true
    sampleFiles[2].starred = true
    sampleFiles[3].starred = true
    sampleFiles[7].starred = true

    // Set some files as shared for demo
    sampleFiles[0].shared = true
    sampleFiles[3].shared = true
    sampleFiles[5].shared = true

    // Initialize sample collections
    const sampleCollections: Collection[] = [
      {
        id: "product-demos-collection",
        name: "Product Demos",
        fileIds: [sampleFiles[0].id, sampleFiles[5].id],
      },
      {
        id: "case-studies-collection",
        name: "Case Studies",
        fileIds: [sampleFiles[3].id],
      },
      {
        id: "sales-collateral-collection",
        name: "Sales Collateral",
        fileIds: [sampleFiles[0].id, sampleFiles[2].id, sampleFiles[4].id],
      },
      {
        id: "training-materials-collection",
        name: "Training Materials",
        fileIds: [sampleFiles[1].id, sampleFiles[5].id],
      },
    ]

    setFolders([rootFolder, ...sampleFolders])
    setFiles(sampleFiles)
    setCollections(sampleCollections)
  }, [])

  const handleCreateFile = (name: string, type: FileType) => {
    const newFile = createFileItem(
      name,
      type,
      0,
      currentFolder,
      currentFolder ? `${currentFolder}/${name}` : `/${name}`,
    )
    setFiles([...files, newFile])
  }

  // Handle folder creation
  const handleCreateFolder = (name: string) => {
    const path = currentFolder ? `${currentFolder}/${name}` : `/${name}`
    const newFolder = createFolder(name, currentFolder, path)
    setFolders([...folders, newFolder])

    const newFile = createFileItem(name, "folder", 0, currentFolder, path)
    setFiles([...files, newFile])
  }

  // Handle file upload
  const handleUploadFiles = (uploadedFiles: File[]) => {
    const newFiles = uploadedFiles.map((file) => {
      const type = getFileTypeFromExtension(file.name)
      return createFileItem(
        file.name,
        type,
        file.size,
        currentFolder,
        currentFolder ? `${currentFolder}/${file.name}` : `/${file.name}`,
      )
    })

    setFiles([...files, ...newFiles])
  }
  
  const handleCreateCollection = (name: string) => {
    const newCollection: Collection = {
      id: uuidv4(),
      name,
      fileIds: [],
    }
    setCollections([...collections, newCollection])
  }

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())

      // If a collection is active, filter by collection
      if (activeCollection) {
        const collection = collections.find((c) => c.id === activeCollection)
        const isInCollection = collection ? collection.fileIds.includes(file.id) : false
        return isInCollection && matchesSearch
      }

      // Otherwise filter by folder and tab
      const matchesFolder = file.parentId === currentFolder

      if (activeTab === "recent") {
        return matchesFolder && matchesSearch
      } else if (activeTab === "starred") {
        return matchesFolder && matchesSearch && file.starred
      } else if (activeTab === "shared") {
        return matchesFolder && matchesSearch && file.shared
      }

      return matchesFolder && matchesSearch
    })
  }, [files, currentFolder, searchQuery, activeTab, activeCollection, collections])

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case "folder":
        return <FolderIcon className="h-5 w-5 text-blue-500" />
      case "pdf":
        return <FilePdf className="h-5 w-5 text-red-500" />
      case "image":
        return <FileImage className="h-5 w-5 text-green-500" />
      case "document":
        return <FileText className="h-5 w-5 text-yellow-500" />
      case "code":
        return <FileCode className="h-5 w-5 text-purple-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const handleFileClick = (file: FileItem) => {
    if (file.type === "folder") {
      setCurrentFolder(file.id)
      setCurrentView("files")
    } else {
      alert(`Opening file: ${file.name}`)
    }
  }

  const handleCollectionClick = (collectionId: string) => {
    setActiveCollection(collectionId)
    setCurrentFolder(null)
    setCurrentView("files")
  }

  const navigateToParent = () => {
    if (currentFolder) {
      const currentFolderObj = folders.find((f) => f.id === currentFolder)
      setCurrentFolder(currentFolderObj?.parentId ?? null)
    }

  }

  const getCurrentFolderName = () => {
    if (!currentFolder) return "All content"
    const folder = folders.find((f) => f.id === currentFolder)
    return folder ? folder.name : "All content"
  }

  const addFileToCollection = (fileId: string, collectionId: string) => {
    setCollections(
      collections.map((collection) => {
        if (collection.id === collectionId && !collection.fileIds.includes(fileId)) {
          return {
            ...collection,
            fileIds: [...collection.fileIds, fileId],
          }
        }
        return collection
      }),
    )
  }

  const removeFileFromCollection = (fileId: string, collectionId: string) => {
    setCollections(
      collections.map((collection) => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            fileIds: collection.fileIds.filter((id) => id !== fileId),
          }
        }
        return collection
      }),
    )
  }

  // File management functions
  const handleDeleteFile = (fileId: string) => {
    // Remove file from files
    setFiles(files.filter((file) => file.id !== fileId))

    // Remove file from all collections
    setCollections(
      collections.map((collection) => ({
        ...collection,
        fileIds: collection.fileIds.filter((id) => id !== fileId),
      })),
    )
  }

  const handleStarFile = (fileId: string) => {
    setFiles(
      files.map((file) => {
        if (file.id === fileId) {
          return {
            ...file,
            starred: !file.starred,
          }
        }
        return file
      }),
    )
  }

  const handleShareFile = (fileId: string) => {
    setFiles(
      files.map((file) => {
        if (file.id === fileId) {
          return {
            ...file,
            shared: !file.shared,
          }
        }
        return file
      }),
    )

    alert(`Sharing options for: ${files.find((f) => f.id === fileId)?.name}`)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6 flex-1 overflow-auto">
        <>
          {currentFolder && (
            <div className="mb-4">
              <Button variant="ghost" onClick={navigateToParent} className="text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to parent folder
              </Button>
              <h2 className="text-xl font-semibold mt-2">{getCurrentFolderName()}</h2>
            </div>
          )}
          {activeCollection && (
            <div className="mb-4">
              <Button variant="ghost" onClick={() => setActiveCollection(null)} className="text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all files
              </Button>
              <h2 className="text-xl font-semibold mt-2">
                Collection: {collections.find((c) => c.id === activeCollection)?.name}
              </h2>
            </div>
          )}

          <div className="mb-6 flex items-center gap-4">
            <Button className="gap-2" onClick={() => setCreateFileOpen(true)}>
              <Plus className="h-4 w-4" />
              Create
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setUploadOpen(true)}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Upload
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setCreateFolderOpen(true)}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Create folder
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setCreateCollectionOpen(true)}>
              <FolderPlus className="h-4 w-4" />
              New Collection
            </Button>
            <div className="flex justify-end">
              <Button className="self-end" variant="ghost" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-6 w-1/4">
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value)}>
              <TabsList className="w-full">
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
                <TabsTrigger value="shared">Shared</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  collections={collections}
                  onClick={() => handleFileClick(file)}
                  onAddToCollection={addFileToCollection}
                  onRemoveFromCollection={removeFileFromCollection}
                  onDeleteFile={handleDeleteFile}
                  onStarFile={handleStarFile}
                  onShareFile={handleShareFile}
                />
              ))}
              {filteredFiles.length === 0 && (
                <div className="col-span-3 text-center p-8 text-gray-500">
                  {activeCollection
                    ? "No files in this collection yet. Add files using the context menu."
                    : "No files found in this location."}
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {filteredFiles.map((file) => (
                <FileListItem
                  key={file.id}
                  file={file}
                  collections={collections}
                  onClick={() => handleFileClick(file)}
                  onAddToCollection={addFileToCollection}
                  onRemoveFromCollection={removeFileFromCollection}
                  onDeleteFile={handleDeleteFile}
                  onStarFile={handleStarFile}
                  onShareFile={handleShareFile}
                />
              ))}
              {filteredFiles.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                  {activeCollection
                    ? "No files in this collection yet. Add files using the context menu."
                    : "No files found in this location."}
                </div>
              )}
            </div>
          )}
        </>
      </div>
      <CreateFileDialog open={createFileOpen} onOpenChange={setCreateFileOpen} onCreateFile={handleCreateFile} />
      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        onCreateFolder={handleCreateFolder}
      />
      <CreateCollectionDialog
        open={createCollectionOpen}
        onOpenChange={setCreateCollectionOpen}
        onCreateCollection={handleCreateCollection}
      />
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onUploadFiles={handleUploadFiles} />
    </div>
  )
}