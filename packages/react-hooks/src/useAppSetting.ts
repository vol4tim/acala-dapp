import { useEffect, useState } from 'react';
import parse from 'url-parse';

interface HooksReturnType {
  endpoint: string;
}

export const useAppSetting = (): HooksReturnType => {
  const [endpoint, setEndpoint] = useState<string>('');
  const url = parse(window.location.href, true);

  useEffect(() => {
    if (url.query.endpoint) {
      setEndpoint(url.query.endpoint);
    }
  }, [url.query.endpoint]);

  return { endpoint };
};
