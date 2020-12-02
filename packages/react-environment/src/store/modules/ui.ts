import { useCallback, useMemo, useReducer } from 'react';

export type UIData = {
  theme: string;
  pageTitle: string;
  breadcrumb: { content: string; path: string }[];
}

export type UIAction = { type: 'set_theme'; value: string }
| { type: 'set_page_title'; value: { content: string; breadcrumb?: UIData['breadcrumb'] } };

const initState: UIData = {
  breadcrumb: [],
  pageTitle: '__empty',
  theme: 'primary'
};

const reducer = (state: UIData, action: UIAction): UIData => {
  switch (action.type) {
    case 'set_page_title': {
      return {
        ...state,
        breadcrumb: action.value.breadcrumb ?? [],
        pageTitle: action.value.content
      };
    }

    case 'set_theme': {
      return {
        ...state,
        theme: action.value
      };
    }
  }
};

export interface UseUIConfigReturnType extends UIData {
  setTitle: (config: { content: string }) => void;
  setTheme: (theme: string) => void;
}

export const useUIConfig = (): UseUIConfigReturnType => {
  const [state, dispatch] = useReducer(reducer, initState);

  const setTitle = useCallback((config: { content: string; breadcrumb?: UIData['breadcrumb'] }) => {
    dispatch({
      type: 'set_page_title',
      value: config
    });
  }, [dispatch]);

  const setTheme = useCallback((theme: string) => {
    dispatch({
      type: 'set_theme',
      value: theme
    });
  }, [dispatch]);

  return useMemo(() => ({
    ...state,
    setTheme,
    setTitle
  }), [state, setTitle, setTheme]);
};
