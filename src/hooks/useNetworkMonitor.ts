import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch } from '@/store/hooks';
import { setOnlineStatus } from '@/store/slices/syncSlice';
import { useSyncQueue } from '@/hooks/useSyncQueue';

export const useNetworkMonitor = () => {
  const dispatch = useAppDispatch();
  const { triggerSync } = useSyncQueue();
  const previousOnlineRef = useRef<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = Boolean(
        state.isConnected && state.isInternetReachable !== false
      );

      dispatch(setOnlineStatus(isOnline));

      if (previousOnlineRef.current === false && isOnline === true) {
        triggerSync();
      }

      previousOnlineRef.current = isOnline;
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, triggerSync]);
};
