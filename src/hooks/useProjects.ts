import { useState, useEffect } from 'react';
import { OrderProject } from '../types/index';

export const useProjects = () => {
  const [projects, setProjects] = useState<OrderProject[]>([]);
  
  // Добавляем флаг загрузки — как на реальном проекте!
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Имитируем получение данных с сервера при старте приложения
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('tiler_crm_projects');
      setProjects(saved ? JSON.parse(saved) : []);
      setIsLoading(false);
    }, 1500); // Искусственная задержка сети 1.5 секунды

    return () => clearTimeout(timer);
  }, []);

  // Синхронизация локальной базы данных
  const saveToStorage = (updatedProjects: OrderProject[]) => {
    localStorage.setItem('tiler_crm_projects', JSON.stringify(updatedProjects));
  };

  // Асинхронное добавление проекта (Имитация POST-запроса)
  const addProject = async (projectData: Omit<OrderProject, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    
    // Симулируем задержку отправки данных на сервер
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newProject: OrderProject = {
      ...projectData,
      id: crypto.randomUUID(),
      createdAt: new Date().toLocaleDateString('ru-RU'),
    };

    setProjects((prev) => {
      const updated = [newProject, ...prev];
      saveToStorage(updated);
      return updated;
    });
    
    setIsLoading(false);
  };

  // Асинхронное удаление (Имитация DELETE-запроса)
  const deleteProject = async (id: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveToStorage(updated);
      return updated;
    });
    setIsLoading(false);
  };

  // Асинхронная смена статуса (Имитация PATCH-запроса)
  const updateProjectStatus = async (id: string, status: OrderProject['status']) => {
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, status } : p));
      saveToStorage(updated);
      return updated;
    });
  };

  return {
    projects,
    isLoading, // Отдаем флаг загрузки наружу в интерфейс
    addProject,
    deleteProject,
    updateProjectStatus,
  };
};
