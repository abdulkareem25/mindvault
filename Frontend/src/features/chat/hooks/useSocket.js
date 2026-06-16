import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from '../../../shared/components/Toast';
import { initSocketConnection } from '../services/chat.socket';
import { addNewMemoryIds } from '../../vault/vaultSlice';
import { vaultApi } from '../../vault/vaultApi';

/**
 * Custom hook to initialize socket connection and listen to vault:updated events.
 * Token-aware: socket connects only when user is authenticated.
 */
export const useSocket = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token);

  useEffect(() => {
    // Token nahi hai — socket connect mat karo
    if (!token) return;

    const socket = initSocketConnection(token);
    if (!socket) {
      console.warn('Socket connection failed to initialize.');
      return;
    }

    const handleVaultUpdated = ({ newCount, previews }) => {
      // 1. Dispatch action to store new memory IDs (for UI dot indicator)
      dispatch(addNewMemoryIds(previews.map(p => p.id)));
      
      // 2. Show a styled success toast notification
      const memoryText = newCount === 1 ? 'memory' : 'memories';
      toast.success(`✨ ${newCount} new ${memoryText} saved to your vault`);
      
      // 3. Invalidate RTK Query cache for memories so that vault page updates
      dispatch(vaultApi.util.invalidateTags(['Memory']));
    };

    socket.on('vault:updated', handleVaultUpdated);

    // Cleanup listener on unmount
    return () => {
      socket.off('vault:updated', handleVaultUpdated);
    };
  }, [dispatch, token]);
};
