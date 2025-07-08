import { useState, useEffect } from 'react'
import type { ProjectFormData, FolderStructure, FolderConfig } from '../types'
import { validateProjectForm } from '../utils/validation'
import { PROVINCIAS, PLANTILLAS_CARPETAS } from '@/shared/data/project-data'

export const useProjectForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProjectFormData>({
    nombre: '',
    etapa: 'Cartera de proyectos',
    descripcion: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [comunasDisponibles, setComunasDisponibles] = useState<
    Array<{ id: string; nombre: string }>
  >([])
  const [provinciasDisponibles, setProvinciasDisponibles] = useState<
    Array<{ id: string; nombre: string }>
  >([])
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [folderConfigs, setFolderConfigs] = useState<
    Record<string, FolderConfig>
  >({})
  const [customFolders, setCustomFolders] = useState<FolderStructure[]>([])
  const [useCustomTemplates, setUseCustomTemplates] = useState(false)
  const [showFolderTemplates, setShowFolderTemplates] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Efecto para actualizar provincias cuando cambia la región
  useEffect(() => {
    if (formData.region) {
      const provincias = PROVINCIAS[formData.region] || []
      setProvinciasDisponibles(provincias)
      setFormData((prev) => ({ ...prev, provincia: '', comuna: '' }))
      setComunasDisponibles([])
    }
  }, [formData.region])

  // Efecto para actualizar comunas cuando cambia la provincia
  useEffect(() => {
    if (formData.provincia) {
      setFormData((prev) => ({ ...prev, comuna: '' }))
    }
  }, [formData.provincia])

  // Efecto para inicializar carpetas cuando cambia la etapa
  useEffect(() => {
    if (formData.etapa) {
      const carpetasEtapa =
        formData.etapa in PLANTILLAS_CARPETAS
          ? [...(PLANTILLAS_CARPETAS as any)[formData.etapa]]
          : []

      // Cuando cambia la etapa, resetear toda la selección de carpetas
      // pero preservar las carpetas personalizadas si existen
      const customFolderIds = customFolders.map((f) => f.id)

      if (!useCustomTemplates) {
        // Modo plantilla: seleccionar carpetas de plantilla + carpetas personalizadas existentes
        setSelectedFolders([...carpetasEtapa, ...customFolderIds])
        const configs = carpetasEtapa.reduce(
          (acc, folder) => ({
            ...acc,
            [folder]: { minDocs: 3, daysLimit: 30 },
          }),
          {}
        )
        // Preservar configuraciones de carpetas personalizadas
        customFolders.forEach((folder) => {
          configs[folder.id] = folderConfigs[folder.id] || {
            minDocs: 3,
            daysLimit: 30,
          }
        })
        setFolderConfigs(configs)
      } else {
        // Modo personalizado: solo carpetas personalizadas
        setSelectedFolders([...customFolderIds])
        const configs: Record<string, FolderConfig> = {}
        customFolders.forEach((folder) => {
          configs[folder.id] = folderConfigs[folder.id] || {
            minDocs: 3,
            daysLimit: 30,
          }
        })
        setFolderConfigs(configs)
      }
    }
  }, [formData.etapa])

  // Efecto para manejar cambio entre modos plantilla/personalizado
  useEffect(() => {
    if (formData.etapa) {
      const carpetasEtapa =
        formData.etapa in PLANTILLAS_CARPETAS
          ? [...(PLANTILLAS_CARPETAS as any)[formData.etapa]]
          : []

      const customFolderIds = customFolders.map((f) => f.id)

      if (!useCustomTemplates) {
        // Cambiar a modo plantilla: incluir carpetas de plantilla + personalizadas
        setSelectedFolders((prev) => {
          const currentCustom = prev.filter((id) =>
            customFolderIds.includes(id)
          )
          return [...carpetasEtapa, ...currentCustom]
        })

        setFolderConfigs((prev) => {
          const configs = carpetasEtapa.reduce(
            (acc, folder) => ({
              ...acc,
              [folder]: { minDocs: 3, daysLimit: 30 },
            }),
            {}
          )
          // Preservar configuraciones de carpetas personalizadas
          customFolders.forEach((folder) => {
            configs[folder.id] = prev[folder.id] || {
              minDocs: 3,
              daysLimit: 30,
            }
          })
          return configs
        })
      } else {
        // Cambiar a modo personalizado: solo carpetas personalizadas
        setSelectedFolders((prev) =>
          prev.filter((id) => customFolderIds.includes(id))
        )

        setFolderConfigs((prev) => {
          const configs: Record<string, FolderConfig> = {}
          customFolders.forEach((folder) => {
            configs[folder.id] = prev[folder.id] || {
              minDocs: 3,
              daysLimit: 30,
            }
          })
          return configs
        })
      }
    }
  }, [useCustomTemplates])

  const updateFormData = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando se actualiza
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors = validateProjectForm(formData)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const canProceedToNextStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!formData.nombre.trim()
      case 2:
        return true // Las validaciones se harán en el submit final
      case 3:
        return selectedFolders.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const createCustomFolder = (name: string, minDocs: number) => {
    if (!name.trim()) return

    const newFolder: FolderStructure = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      minDocuments: minDocs,
      documents: [],
      subfolders: [],
    }

    setCustomFolders([...customFolders, newFolder])
    setSelectedFolders([...selectedFolders, newFolder.id])
    setFolderConfigs({
      ...folderConfigs,
      [newFolder.id]: { minDocs: minDocs, daysLimit: 30 },
    })
  }

  const resetForm = () => {
    setCurrentStep(1)
    setFormData({
      nombre: '',
      etapa: 'Cartera de proyectos',
      descripcion: '',
    })
    setErrors({})
    setSelectedFolders([])
    setFolderConfigs({})
    setCustomFolders([])
    setUseCustomTemplates(false)
    setShowFolderTemplates(true)
    setIsLoading(false)
  }

  return {
    // State
    currentStep,
    formData,
    errors,
    comunasDisponibles,
    provinciasDisponibles,
    selectedFolders,
    folderConfigs,
    customFolders,
    useCustomTemplates,
    showFolderTemplates,
    isLoading,

    // Actions
    setCurrentStep,
    updateFormData,
    validateForm,
    canProceedToNextStep,
    createCustomFolder,
    resetForm,
    setSelectedFolders,
    setFolderConfigs,
    setUseCustomTemplates,
    setShowFolderTemplates,
    setIsLoading,
  }
}
