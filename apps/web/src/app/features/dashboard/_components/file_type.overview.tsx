import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { getFileIcon } from "@/shared/lib/file-utils";
import { Progress } from "@/shared/components/ui/progress";

interface FileTypeOverviewProps {
  storageStats: {
    fileTypes: Record<string, number>;
    totalFiles: number;
  };
}

export function FileTypeOverview({ storageStats }: FileTypeOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>File Type Distribution</CardTitle>
        <CardDescription>Breakdown of your content by file type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(storageStats.fileTypes).map(([type, count]) => (
            <div key={type} className="flex items-center">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                {getFileIcon(type as any)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium capitalize">{type}</p>
                  <p className="text-sm text-gray-500">{count} files</p>
                </div>
                <Progress
                  value={(count / storageStats.totalFiles) * 100}
                  className="h-2"
                  
                  // indicatorClassName={
                  //   type === "document"
                  //     ? "bg-blue-500"
                  //     : type === "presentation"
                  //       ? "bg-orange-500"
                  //       : type === "spreadsheet"
                  //         ? "bg-green-500"
                  //         : type === "image"
                  //           ? "bg-purple-500"
                  //           : "bg-red-500"
                  // }
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}