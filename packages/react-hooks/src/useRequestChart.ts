import useRequest from '@umijs/use-request';

type RequestChartData = { columns: string[]; values: string[]; tags: Record<string, string> }[];

export const useRequestChart = (sql: string): RequestChartData | undefined => {
  const data = useRequest(() => ({
    method: 'GET',
    url: `https://pulse.acala.network/api/query?q=${sql}`
  }));

  return (data as any)?.data?.results?.[0]?.series as RequestChartData | undefined;
};
