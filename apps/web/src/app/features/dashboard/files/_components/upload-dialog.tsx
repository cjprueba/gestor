"use client"

import type React from "react"

import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { useState, useRef } from "react"

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadFiles: (files: File[]) => void
}

export function UploadDialog({ open, onOpenChange, onUploadFiles }: UploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUploadFiles(selectedFiles)
      setSelectedFiles([])
      onOpenChange(false)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subir Archivos</DialogTitle>
          <DialogDescription>Selecciona archivos de tu computadora para subir.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
            <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
            </p>
            <Button variant="outline" size="sm" onClick={handleBrowseClick} className="mb-2">
              Explorar Archivos
            </Button>
            {selectedFiles.length > 0 && (
              <div className="w-full mt-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Archivos Seleccionados:</p>
                <ul className="text-sm text-gray-500 space-y-1 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="truncate">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpload} disabled={selectedFiles.length === 0}>
            Subir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
