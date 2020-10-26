import { useApi } from './useApi';
import { useState, useEffect } from 'react';

export const useCouncilList = (): string[] => {
  const { api } = useApi();
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    if (!api) return;

    setList(Object.keys(api.query).filter((key: string): boolean => key.endsWith('Council')));
  }, [api]);

  return list;
};
