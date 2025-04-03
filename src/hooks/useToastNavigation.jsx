import { useToast } from './useToast';
import { useNavigate } from 'react-router-dom';

export const useToastNavigation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const toastAndNavigate = (toastConfig, path) => {
    toast(toastConfig);
    // More reliable than setTimeout
    queueMicrotask(() => navigate(path));
  };

  return { toastAndNavigate };
};