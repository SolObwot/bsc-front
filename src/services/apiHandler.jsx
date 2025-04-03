import { useToast } from '../hooks/useToast';

export const handleApiError = (error) => {
  const { toast } = useToast();
  const message = error.response?.data?.message || 'Request failed. Please try again.';
  
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });
};