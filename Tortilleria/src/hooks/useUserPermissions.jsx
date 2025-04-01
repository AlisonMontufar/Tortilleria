import { useState, useEffect } from 'react';

// Hook para gestionar los permisos del usuario
function useUserPermissions() {
  const [permisos, setPermisos] = useState(null);

  useEffect(() => {
    // Verificar si hay permisos guardados en el localStorage
    const savedPermisos = localStorage.getItem('permisos');
    try {
      if (savedPermisos) {
        setPermisos(JSON.parse(savedPermisos));
      }
    } catch (error) {
      console.error('Error al parsear los permisos desde localStorage:', error);
      // Limpiar los permisos en caso de error
      localStorage.removeItem('permisos');
    }
  }, []);  // Solo se ejecuta una vez al montar el componente

  const savePermisosToLocalStorage = (permisosData) => {
    // Guardar los permisos en localStorage
    localStorage.setItem('permisos', JSON.stringify(permisosData));
    setPermisos(permisosData);
  };

  const clearPermisosFromLocalStorage = () => {
    // Limpiar los permisos del localStorage
    localStorage.removeItem('permisos');
    setPermisos(null);
  };

  return {
    permisos,
    savePermisosToLocalStorage,
    clearPermisosFromLocalStorage
  };
}

export default useUserPermissions;
