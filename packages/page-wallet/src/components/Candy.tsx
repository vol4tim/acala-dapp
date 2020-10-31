import React, { FC, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { Dialog, Skeleton, Button, notification } from '@acala-dapp/ui-components';
import { useInitialize, useAccounts } from '@acala-dapp/react-hooks';

import classes from './Candy.module.scss';

interface Props {
  status: boolean;
  onClose: () => void;
}

const QUERY_CANDY = 'https://api.polkawallet.io/v2/candy/candy?address=';

export const Candy: FC<Props> = ({
  onClose,
  status
}) => {
  const { active } = useAccounts();
  const { isInitialized, setEnd } = useInitialize();
  const [candy, setCandy] = useState<{ claimed: boolean; candy: string[] }>({
    candy: [],
    claimed: false
  });

  const handleClaimed = useCallback(() => {
    if (!active?.address) return;
    if (!candy.candy.length) return;

    if (candy.claimed) {
      notification.info({
        message: 'You had alerady claimed. please waiting for airdrop process.'
      });

      return;
    }

    axios.post(QUERY_CANDY, {
      address: active.address
    }).then((result) => {
      if (result.status === 200 && result.data.code === 200) {
        notification.success({
          message: 'Claimed success, please waiting for airdrop process.'
        });
        setCandy({
          ...candy,
          claimed: true
        });
      } else {
        notification.error({
          message: 'Claimed failed, maybe you had alerady claimed.'
        });
      }
    });
  }, [candy, active, setCandy]);

  useEffect(() => {
    if (!active?.address) return;

    axios.get(`${QUERY_CANDY}${active.address}`).then((result) => {
      if (result.status === 200 && result.data.code === 200) {
        setCandy({
          candy: result.data.message.candy || [],
          claimed: result.data.message.claimed || false
        });
        setEnd();
      }
    });
  }, [active, setCandy, setEnd]);

  return (
    <Dialog
      action={
        candy.claimed ? <p className={classes.claimed}>Already Claimed</p> : candy.candy.length > 0 ? (
          <Button
            className={classes.claimedBtn}
            disabled={candy.claimed && candy.candy.length === 0}
            onClick={handleClaimed}
          >
            Claim
          </Button>
        ) : null
      }
      onCancel={onClose}
      title='Candy Claimed'
      visiable={status}
      withClose
    >
      {
        isInitialized ? (
          <div>
            {
              candy.candy.length > 0 ? (
                <>
                  <p className={classes.title}>You have received a gift for participated in previous acala testnet.</p>
                  <div className={classes.candyList}>
                    <span>ACA(MainNet)</span>
                    <span>{candy.candy.length}</span>
                  </div>
                  <div className={classes.candyList}>
                    <span>KAR</span>
                    <span>{candy.candy.length}</span>
                  </div>
                </>
              ) : (
                <p className={classes.title}>The account has no airdrop, please waiting for the next acala testnet.</p>
              )
            }
          </div>
        ) : <Skeleton />
      }
    </Dialog>
  );
};
