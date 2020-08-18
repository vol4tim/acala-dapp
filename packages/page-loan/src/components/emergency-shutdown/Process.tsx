import React, { FC, useState, useEffect, useContext } from 'react';
import { Progress } from 'antd';
import { useAuctionOverview, useEmergencyShutdown } from '@acala-dapp/react-hooks';
import classes from './Process.module.scss';
import { EmergencyShutdownContext } from './EmergencyShutdownProvider';

const CAN_REFUND_COUNT = 4;
const ACALA_PULSE = 'https://pulse.acala.network/treasury';

export const Process: FC = () => {
  const { setCanReclaim } = useContext(EmergencyShutdownContext);
  const { canRefund } = useEmergencyShutdown();
  const auction = useAuctionOverview();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let _count = 0;

    if (!auction) return;

    // if (auction.totalCollateral) _count += 1;

    if (auction.totalDebit.isZero()) _count += 1;

    if (auction.totalSurplus.isZero()) _count += 1;

    if (auction.totalTarget.isZero()) _count += 1;

    if (canRefund) _count += 1;

    setCount(_count);

    if (_count === CAN_REFUND_COUNT) {
      setCanReclaim(true);
    }
  }, [auction, setCanReclaim, canRefund]);

  return (
    <div className={classes.root}>
      <p className={classes.title}>Liquidation Progress</p>
      <p className={classes.info}>Please be patient, your assets are being liquidated</p>
      <Progress
        className={classes.bar}
        percent={count / 4 * 100}
        strokeColor={{
          '0%': '#DF008E',
          '100%': '#FF4E4E',
          '80%': '#F33067'
        }}
        type='circle'
      />
      <p className={classes.link}>
        See more details on <a href={ACALA_PULSE}
          rel='noopener noreferrer'
          target='_blank'
        >Acala Pulse</a>
      </p>
    </div>
  );
};
