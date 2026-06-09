import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from '../../../shared/components/Toast';
import { initSocketConnection } from '../services/chat.socket';
import { addNewMemoryIds } from '../../vault/vaultSlice';
import { vaultApi } from '../../vault/vaultApi';

/**
 * Custom hook to listen to socket events related to vault updates.
 * Shows a toast and invalidates the RTK Query memory cache when new memories are saved.
 */
export const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = initSocketConnection();
    if (!socket) {
      console.warn('Socket connection not initialized, cannot listen for vault updates.');
      return;
    }

    const handleVaultUpdated = ({ newCount, previews }) => {
      // 1. Dispatch action to store new memory IDs (for UI dot indicator)
      dispatch(addNewMemoryIds(previews.map(p => p.id)));
      
      // 2. Show a styled success toast notification
      const memoryText = newCount === 1 ? 'memory' : 'memories';
      toast.success(`${newCount} new ${memoryText} saved to your vault`);
      
      // 3. Invalidate RTK Query cache for memories so that vault page updates
      dispatch(vaultApi.util.invalidateTags(['Memory']));
    };

    socket.on('vault:updated', handleVaultUpdated);

    // Cleanup listener on unmount
    return () => {
      socket.off('vault:updated', handleVaultUpdated);
    };
  }, [dispatch]);
};
