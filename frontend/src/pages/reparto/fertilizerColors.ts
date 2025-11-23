// utils/globalColorAssigner.ts

// Paleta de colores predefinida
const FERTILIZER_PALETTE: string[] = [
  "teal.500",      // 0
  "blue.500",      // 1
  "green.500",     // 2
  "purple.500",    // 3
  "orange.500",    // 4
  "cyan.500",      // 5
  "red.500",       // 6
  "pink.500",      // 7
  "yellow.500",    // 8
  "lime.500",      // 9
  "indigo.500",    // 10
  "messenger.500", // 11
  "fuchsia.500",   // 12
  "emerald.500",   // 13
  "gray.600",
  "teal.300",
  "blue.300",
  "green.300",
  "purple.300",
  "orange.300",    // 19
];

const PALETTE_SIZE = FERTILIZER_PALETTE.length;

// ⭐ Mapa de Asignación Global: NombreFertilizante -> Color ⭐
// Este mapa se inicializará una vez con la lista del backend.
const assignedColorMap = new Map<string, string>(); 

/**
 * Función que inicializa el mapa de colores.
 * Debe llamarse ÚNICAMENTE al recibir la lista de fertilizantes del backend.
 * * @param availableFertilizerNames Lista de nombres de fertilizantes disponibles.
 */
export const initializeFertilizerColors = (availableFertilizerNames: string[]): void => {
    // 1. Limpiar el mapa si se llama de nuevo (aunque idealmente solo se llama una vez)
    assignedColorMap.clear();

    // 2. Asignar colores secuencialmente y cíclicamente
    availableFertilizerNames.forEach((name, index) => {
        const colorIndex = index % PALETTE_SIZE; // Aplica módulo para ciclar
        const color = FERTILIZER_PALETTE[colorIndex];
        
        assignedColorMap.set(name, color);
    });
    
    console.log("Colores de fertilizantes inicializados:", assignedColorMap);
};

/**
 * Función para obtener el color de un fertilizante en cualquier componente.
 * * @param name Nombre del fertilizante (ej: "Nitrato potásico").
 * @returns El string de color de Chakra UI (ej: "green.500") o un color por defecto.
 */
export const getFertilizerColor = (name: string): string => {
    // Si el nombre no está en el mapa (error, o es un fertilizante desconocido), devuelve un gris.
    return assignedColorMap.get(name) || "gray.400"; 
};