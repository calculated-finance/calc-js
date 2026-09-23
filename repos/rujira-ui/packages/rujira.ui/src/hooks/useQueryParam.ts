import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export const useQueryParam = <T extends string = string>(
  key: string,
  initial: T
): [T, (v: T) => void] => {
  const location = useLocation();
  const navigate = useNavigate();
  const q = useQuery();

  const val = (q.get(key) as T) || (initial as T);
  const setVal = (s: string) => {
    s ? q.set(key, s) : q.delete(key);
    navigate(`${location.pathname}?${q.toString()}`);
  };

  return [val, setVal];
};

export const useQueryParams = <T extends string = string>(
  vals: Record<string, T>
): [Record<string, T>, (v: Record<string, T>) => void] => {
  const location = useLocation();
  const navigate = useNavigate();
  const q = useQuery();

  const val = Object.entries(vals).reduce(
    (a, [k, v]) => ({ ...a, [k]: (q.get(k) as T) || (v as T) }),
    {}
  );
  const setVal = (s: Record<string, T>) => {
    const r = Object.entries(s).reduce((a, [k, v]) => {
      v ? a.set(k, v) : a.delete(k);
      return a;
    }, q);
    navigate(`${location.pathname}?${r.toString()}`);
  };

  return [val, setVal];
};
