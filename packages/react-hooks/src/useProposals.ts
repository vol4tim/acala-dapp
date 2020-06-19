import { useState, useEffect } from 'react';
import { Proposal, Hash, Votes } from '@polkadot/types/interfaces';
import { Vec, Option } from '@polkadot/types';

import { useApi } from './useApi';
import { switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

interface HooksReturnType {
  proposals: Option<Proposal>[];
  votes: Option<Votes>[];
}

export const useProposals = (council: string): HooksReturnType => {
  const { api } = useApi();
  const [proposals, setProposals] = useState<Option<Proposal>[]>([]);
  const [votes, setVotes] = useState<Option<Votes>[]>([]);

  useEffect(() => {
    if (!api || !api.query[council]) return;

    const subscriber = api.query[council].proposals<Vec<Hash>>().pipe(
      switchMap((result) => {
        return combineLatest(
          combineLatest(result.map((proposal) => api.query[council].proposalOf<Option<Proposal>>(proposal))),
          combineLatest(result.map((proposal) => api.query[council].voting<Option<Votes>>(proposal)))
        );
      })
    ).subscribe(([proposals, votes]) => {
      setProposals(proposals);
      setVotes(votes);
    });

    return (): void => subscriber.unsubscribe();
  }, [api, council]);

  return { proposals, votes };
};
