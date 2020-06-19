import React, { FC, ReactNode } from 'react';
import Identicon from '@polkadot/react-identicon';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Card, Loading, CopyIcon, EditIcon } from '@acala-dapp/ui-components';

import { useAccounts, useNotification } from '@acala-dapp/react-hooks';
import classes from './UserCard.module.scss';
import { FormatAddress } from '@acala-dapp/react-components';

export const UserCard: FC = () => {
  const { active, openSelectAccount } = useAccounts();
  const { createNotification } = useNotification();

  const renderContent = (): ReactNode => {
    if (!active) {
      return null;
    }

    const handleCopy = (): void => {
      createNotification({
        icon: 'success',
        removedDelay: 2000,
        title: 'Copy Success',
        type: 'success'
      });
    };

    return (
      <>
        <Identicon
          className={classes.icon}
          size={64}
          theme='substrate'
          value={active.address}
        />
        <div className={classes.info}>
          <div className={classes.name}>
            {active.meta.name || 'User'}
          </div>
          <FormatAddress
            address={active.address}
            className={classes.address}
          />
        </div>
        <div className={classes.edit}
          onClick={openSelectAccount}>
          <EditIcon />
          <p className={classes.action}>Change</p>
        </div>
        <CopyToClipboard
          onCopy={handleCopy}
          text={active.address}
        >
          <div className={classes.copy}>
            <CopyIcon />
            <p className={classes.action}>Copy</p>
          </div>
        </CopyToClipboard>
      </>
    );
  };

  return (
    <Card
      className={classes.root}
      contentClassName={classes.content}
      padding={false}
    >
      {active ? renderContent() : <Loading />}
    </Card>
  );
};
