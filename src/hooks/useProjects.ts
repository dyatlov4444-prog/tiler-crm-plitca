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
      try {
        const saved = localStorage.getItem('tiler_crm_projects');
        setProjects(saved ? JSON.parse(saved) : []);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    }, 1500); // Искусственная задержка сети 1.5 секунды

    return () => clearTimeout(timer);
  }, []);

  // Синхронизация локальной базы данных
  const saveToStorage = (updatedProjects: OrderProject[]) => {
    try {
      localStorage.setItem('tiler_crm_projects', JSON.stringify(updatedProjects));
    } catch (error) {
      console.error('Ошибка сохранения данных:', error);
    }
  };

  // Асинхронное добавление проекта (Имитация POST-запроса)
  const addProject = async (projectData: Omit<OrderProject, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    
    try {
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
    } catch (error) {
      console.error('Ошибка при добавлении проекта:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Асинхронное удаление (Имитация DELETE-запроса)
  const deleteProject = async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setProjects((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        saveToStorage(updated);
        return updated;
      });
    } catch (error) {
      console.error('Ошибка при удалении проекта:', error);
    } finally {
      setIsLoading(false);
    }
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
