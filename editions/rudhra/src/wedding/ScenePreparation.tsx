import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";

type Status = "pending" | "ready" | "failed";
type Registry = { register: (id: string) => void; complete: (id: string) => void; fail: (id: string) => void };
export const ScenePreparationContext = createContext<Registry | null>(null);

/** Actual renderer receipts, not a timer or a network-prefetch promise. */
export function useScenePreparation() {
  const entries = useRef(new Map<string, Status>());
  const [, update] = useState(0);
  const [cycle, setCycle] = useState(0);
  const record = useCallback((id: string, status: Status) => {
    if (entries.current.get(id) === status) return;
    entries.current.set(id, status);
    update((value) => value + 1);
  }, []);
  const registry = useMemo<Registry>(() => ({
    register: (id) => { if (!entries.current.has(id)) record(id, "pending"); },
    complete: (id) => record(id, "ready"),
    fail: (id) => record(id, "failed"),
  }), [record]);
  const retry = useCallback(() => {
    entries.current.clear();
    setCycle((value) => value + 1);
    update((value) => value + 1);
  }, []);
  const values = [...entries.current.values()];
  const done = values.filter((value) => value === "ready").length;
  return { registry, cycle, retry, ready: values.length > 0 && done === values.length,
    progress: values.length ? Math.round(done / values.length * 100) : 0,
    failed: values.includes("failed") };
}

export function usePreparedAsset(sharedId?: string) {
  const localId = useId();
  const id = sharedId ?? localId;
  const registry = useContext(ScenePreparationContext);
  useEffect(() => { registry?.register(id); }, [registry, id]);
  const complete = useCallback(() => registry?.complete(id), [registry, id]);
  const fail = useCallback(() => registry?.fail(id), [registry, id]);
  return { complete, fail };
}