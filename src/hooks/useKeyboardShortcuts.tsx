import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { canAccess } = useAuth();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd is pressed
      if (!(event.ctrlKey || event.metaKey)) return;

      switch (event.key) {
        case 'd':
          event.preventDefault();
          navigate('/dashboard');
          break;
        case 'c':
          event.preventDefault();
          if (canAccess(['ADMIN', 'COACH'])) {
            navigate('/clientes');
          }
          break;
        case 'a':
          event.preventDefault();
          navigate('/avaliacoes');
          break;
        case 't':
          event.preventDefault();
          navigate('/treinos');
          break;
        case 'e':
          event.preventDefault();
          navigate('/exames');
          break;
        case '/':
          event.preventDefault();
          // Focus search input if available
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, canAccess]);
}