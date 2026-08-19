import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export type ConnectivityState = "offline" | "reconnecting" | "online";

/**
 * NetInfo reports two related-but-different things: isConnected (has a
 * network interface) and isInternetReachable (that interface can
 * actually reach the internet — null while it's still probing). Reading
 * only isConnected is a common mistake that reports "online" while
 * sitting on a wifi network with no internet. This hook combines both
 * and adds a brief "reconnecting" transitional state so the UI doesn't
 * jump straight from offline to online the instant a signal reappears.
 */
export function useNetworkStatus() {
  const [state, setState] = useState<ConnectivityState>("online");
  const [previouslyOffline, setPreviouslyOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((netState) => {
      const reachable = netState.isConnected && netState.isInternetReachable !== false;

      if (!reachable) {
        setState("offline");
        setPreviouslyOffline(true);
        return;
      }

      if (previouslyOffline) {
        setState("reconnecting");
        const timer = setTimeout(() => {
          setState("online");
          setPreviouslyOffline(false);
        }, 1200);
        return () => clearTimeout(timer);
      }

      setState("online");
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previouslyOffline]);

  return state;
}
