import React, { FC, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { Dialog, Skeleton, Button, notification } from '@acala-dapp/ui-components';
import { useInitialize, useAccounts, useModal } from '@acala-dapp/react-hooks';

import classes from './Candy.module.scss';

const QUERY_CANDY = 'https://api.polkawallet.io/v2/candy/candy?address=';

export const Candy: FC = () => {
  const { close, open, status } = useModal();
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

    return;

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

  if (!isInitialized || candy.candy.length <= 0) return null;

  return (
    <>
      <Button onClick={open}>
        Claim Rewards
      </Button>
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
        onCancel={close}
        title='Thank You'
        visiable={status}
        withClose
      >
        {
          isInitialized ? (
            <div>
              {
                candy.candy.length > 0 ? (
                  <>
                    <p className={classes.title}>This is our way of saying THANK YOU for participating in previous testnet campaigns.</p>
                    <div className={classes.candyList}>
                      <span>ACA(Mainnet)</span>
                      <span>{candy.candy.length}</span>
                    </div>
                    <div className={classes.candyList}>
                      <span>KAR</span>
                      <span>{candy.candy.length}</span>
                    </div>
                  </>
                ) : (
                  <p className={classes.title}>
                    You are new to the community, please head to <a
                      href='https://discord.gg/vdbFVCH'
                      rel='noopener noreferrer'
                      target='_blank'
                    >Discord</a> to participate
                  </p>
                )
              }
            </div>
          ) : <Skeleton />
        }
      </Dialog>
    </>
  );
};
