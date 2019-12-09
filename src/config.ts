import { SideBarConfig } from './types/sidebar';

export const assets: Map<number, string> = new Map([
    [1, 'aUSD'],
    [2, 'XBTC'],
    [3, 'DOT'],
]);

export const getEndPoint = (): string => {
    return 'wss://testnet-node-1.acala.laminar.one/ws';
};

export const sideBarConfig: SideBarConfig = {
    products: [
        {
            name: 'Self Serviced Loan',
            path: 'loan',
        },
    ],
};