import { createStore, ManipulationsConfig, ManipulationParams } from '../createStore';

type StakingStoreState = Record<string, any>;

interface StakingStoreManipulate<T = StakingStoreState> extends ManipulationsConfig<T> {
  get: (params: ManipulationParams<T>) => (key: string) => any;
  set: (params: ManipulationParams<T>) => (key: string, value: any) => void;
}

export const useStakingStore = createStore<StakingStoreState, StakingStoreManipulate<StakingStoreState>>({}, {
  get: ({ state }) => (key: string): any => {
    return state[key];
  },
  set: ({ setState, stateRef }) => (key: string, value: any): void => {
    // update query result
    setState({
      ...stateRef.current,
      [key]: value
    });
  }
});
