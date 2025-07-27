import type { ProjectFormData } from "../project/project.types";

export const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  if (!regex.test(dateString)) return false;

  const [day, month, year] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export const isValidYear = (yearString: string): boolean => {
  const regex = /^\d{4}$/;
  return regex.test(yearString);
};

export const validateProjectForm = (
  formData: ProjectFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Validaciones básicas
  if (!formData.nombre.trim()) {
    errors.nombre = "El nombre del proyecto es obligatorio";
  }

  // Validaciones específicas por etapa
  if (formData.etapa && formData.etapa !== "Cartera de proyectos") {
    if (!formData.tipoIniciativa) {
      errors.tipoIniciativa = "Tipo de iniciativa es obligatorio";
    }

    if (!formData.tipoObra) {
      errors.tipoObra = "Tipo de obra es obligatorio";
    }

    if (!formData.region) {
      errors.region = "Región es obligatoria";
    }

    if (!formData.provincia) {
      errors.provincia = "Provincia es obligatoria";
    }

    if (!formData.comuna) {
      errors.comuna = "Comuna es obligatoria";
    }
  }

  // Validaciones de fechas
  const dateFields = [
    "fechaLlamadoLicitacion",
    "fechaRecepcionOfertas",
    "fechaAperturaOfertas",
    "inicioPlazoConcesion",
    "alertaFechaLimite",
  ];

  dateFields.forEach((field) => {
    const value = formData[field as keyof ProjectFormData];
    if (value && !isValidDate(value)) {
      errors[field] = "Formato de fecha inválido (dd-mm-yyyy)";
    }
  });

  // Validación de año
  if (formData.llamadoLicitacion && !isValidYear(formData.llamadoLicitacion)) {
    errors.llamadoLicitacion = "Formato de año inválido (YYYY)";
  }

  return errors;
};
