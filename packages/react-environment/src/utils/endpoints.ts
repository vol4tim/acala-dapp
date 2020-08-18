import { WsProvider } from '@polkadot/api';

export interface EndpointConfig {
  name: string;
  url: string;
}

export const DEFAULT_ENDPOINTS: EndpointConfig[] = [
  {
    name: 'Mandala TC4 Node 1 (Hosted by OnFinality)',
    url: 'wss://node-6684611762228215808.jm.onfinality.io/ws'
  },
  {
    name: 'Mandala TC4 Node 2 (Hosted by OnFinality)',
    url: 'wss://node-6684611760525328384.rz.onfinality.io/ws'
  },
  {
    name: 'Mandala TC4 Node 3 (Hosted by Acala)',
    url: 'wss://testnet-node-1.acala.laminar.one/ws'
  }
];

export const createProvider = (endpoints: EndpointConfig[] = []): WsProvider => {
  const ws = new WsProvider(endpoints.map((config) => config.url).sort(() => Math.random() - 0.5));

  return ws;
};
