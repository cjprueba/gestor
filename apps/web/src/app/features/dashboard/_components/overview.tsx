

import { formatFileSize } from "@/shared/lib/file-utils"
import type { Collection, FileItem } from "@/shared/types/types"
import { useMemo } from "react"
import { CollectionsOverview } from "./collections.overview"
import { RecentsPopularOverview } from "./recents_popular.overview"
import { StorageOverview } from "./storage.overview"
interface OverviewDashboardProps {
  files: FileItem[]
  collections: Collection[]
  onFileClick: (file: FileItem) => void
  onCollectionClick: (collectionId: string) => void
}

export function OverviewDashboard({ files, collections, onFileClick, onCollectionClick }: OverviewDashboardProps) {
  // Calculate storage statistics
  const storageStats = useMemo(() => {
    const totalFiles = files.filter((file) => file.type !== "folder").length
    const totalFolders = files.filter((file) => file.type === "folder").length
    const totalStorage = files.reduce((acc, file) => acc + (file.size || 0), 0)
    const totalStorageFormatted = formatFileSize(totalStorage)
    const storageLimit = 10 * 1024 * 1024 * 1024 // 10GB for demo
    const storageUsedPercentage = Math.min(100, (totalStorage / storageLimit) * 100)

    // Count files by type
    const fileTypes = files.reduce(
      (acc, file) => {
        if (file.type !== "folder") {
          acc[file.type] = (acc[file.type] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalFiles,
      totalFolders,
      totalStorage,
      totalStorageFormatted,
      storageLimit,
      storageUsedPercentage,
      fileTypes,
    }
  }, [files])

  // Get recent files (last 5)
  const recentFiles = useMemo(() => {
    return [...files]
      .filter((file) => file.type !== "folder")
      .sort((a, b) => b.modified.getTime() - a.modified.getTime())
      .slice(0, 5)
  }, [files])

  // Get most used files (for demo, we'll just use starred files)
  const mostUsedFiles = useMemo(() => {
    return files.filter((file) => file.starred).slice(0, 5)
  }, [files])

  // Get popular collections (those with most files)


  return (
    <main className="space-y-6 px-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel de Control</h1>
      </div>

      {/* Storage overview */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageStats.totalStorageFormatted}</div>
            <Progress value={storageStats.storageUsedPercentage} className="mt-2 h-2" />
            <p className="text-xs text-gray-500 mt-2">
              {storageStats.storageUsedPercentage.toFixed(1)}% of {formatFileSize(storageStats.storageLimit)} used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageStats.totalFiles}</div>
            <p className="text-xs text-gray-500 mt-2">Across {collections.length} collections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Folders</CardTitle>
            <Folder className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageStats.totalFolders}</div>
            <p className="text-xs text-gray-500 mt-2">Organized content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared Files</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.filter((file) => file.shared).length}</div>
            <p className="text-xs text-gray-500 mt-2">With team members</p>
          </CardContent>
        </Card>
      </div> */}
      <StorageOverview files={files} collections={collections} storageStats={storageStats} />

      {/* File type distribution */}
      {/* <FileTypeOverview storageStats={storageStats} /> */}


      {/* Recent and Popular */}
      <RecentsPopularOverview recentFiles={recentFiles} mostUsedFiles={mostUsedFiles} onFileClick={onFileClick} />

      {/* Popular Collections */}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Popular Collections</CardTitle>
            <CardDescription>Your most active collections</CardDescription>
          </div>
          <LayoutGrid className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {popularCollections.map((collection) => (
              <div
                key={collection.id}
                className="flex flex-col rounded-lg border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onCollectionClick(collection.id)}
              >
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={collection.thumbnail || "/placeholder.svg"}
                    alt={collection.name}
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{collection.name}</h3>
                  <p className="text-sm text-gray-500">{collection.fileCount} files</p>
                </div>
              </div>
            ))}
            {popularCollections.length === 0 && (
              <div className="col-span-3 text-center py-6 text-gray-500">No collections yet</div>
            )}
          </div>
        </CardContent>
      </Card> */}
      <CollectionsOverview collections={collections} files={files} onCollectionClick={onCollectionClick} />

      {/* Activity Chart (placeholder) */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>File activity over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="flex flex-col items-center text-gray-500">
              <BarChart3 className="h-10 w-10 mb-2" />
              <p>Activity chart would appear here</p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </main>
  )
}
