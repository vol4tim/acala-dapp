import { WsProvider } from '@polkadot/api';

export interface EndpointConfig {
  name: string;
  url: string;
}

export const DEFAULT_ENDPOINTS: EndpointConfig[] = [
  // {
  //   name: 'Mandala TC4 Node 1 (Hosted by OnFinality)',
  //   url: 'wss://node-6684611762228215808.jm.onfinality.io/ws'
  // },
  // {
  //   name: 'Mandala TC4 Node 2 (Hosted by OnFinality)',
  //   url: 'wss://node-6684611760525328384.rz.onfinality.io/ws'
  // },
  // {
  //   name: 'Mandala TC4 Node 3 (Hosted by Acala)',
  //   url: 'wss://testnet-node-1.acala.laminar.one/ws'
  // },
  {
    name: 'Rococo Mandala',
    url: 'wss://rococo-1.acala.laminar.one'
  },
  {
    name: 'Local',
    url: 'ws://127.0.0.1:9944'
  }
];

export const createProvider = (endpoint: string): WsProvider => {
  const ws = new WsProvider(endpoint);

  return ws;
};
