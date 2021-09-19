import { useEffect, useState } from "react";
import useKeyHold from "./useKeyHold";

export default function useKeyTap(targetKey: string, onPress: () => void) {
  const press = useKeyHold(targetKey);
  useEffect(() => {
    if (press) onPress();
  }, [press]);
}
