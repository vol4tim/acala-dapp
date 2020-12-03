import React, { createContext, FC, useCallback, useReducer, useMemo, useEffect, useRef } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BareProps } from '@acala-dapp/ui-components/types';

interface LoanState {
  isOverview: boolean;
  selectedCurrency: CurrencyId | null;
}

interface LoanContextData extends LoanState {
  changeToOverview: () => void;
  selectCurrency: (value: CurrencyId) => void;
}

const initState: LoanState = {
  isOverview: true,
  selectedCurrency: null
};

type LoanAction = { type: 'change_to_overview' }
| { type: 'select_currency'; value: CurrencyId };

const reducer = (state: LoanState, action: LoanAction): LoanState => {
  switch (action.type) {
    case 'change_to_overview': {
      return {
        ...state,
        isOverview: true,
        selectedCurrency: null
      };
    }

    case 'select_currency': {
      return {
        ...state,
        isOverview: false,
        selectedCurrency: action.value
      };
    }
  }
};

export const LoanContext = createContext<LoanContextData>({} as LoanContextData);

export const LoanProvider: FC<BareProps> = ({
  children
}) => {
  const [state, dispatch] = useReducer(reducer, initState);

  const changeToOverview = useCallback(() => {
    dispatch({ type: 'change_to_overview' });
  }, [dispatch]);

  const selectCurrency = useCallback((value: CurrencyId) => {
    dispatch({ type: 'select_currency', value });
  }, [dispatch]);

  const data = useMemo(() => ({
    ...state,
    changeToOverview,
    selectCurrency
  }), [state, changeToOverview, selectCurrency]);

  return (
    <LoanContext.Provider value={data}>
      {children}
    </LoanContext.Provider>
  );
};
