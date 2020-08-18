import { CurrencyLike } from '@acala-dapp/react-hooks/types';
import { CurrencyId } from '@acala-network/types/interfaces';

export type CurrencyChangeFN = ((token: string) => void) | ((token: CurrencyId) => void) | ((token: CurrencyLike) => void);
