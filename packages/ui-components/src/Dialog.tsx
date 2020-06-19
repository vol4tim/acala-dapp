import React, { FC, memo, ReactNode, createRef } from 'react';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';

import { BareProps } from './types';
import classes from './Dialog.module.scss';
import { Button } from './Button';
import clsx from 'clsx';
import { CloseIcon } from './Icon';

interface Props extends BareProps {
  visiable: boolean;
  title?: ReactNode;
  action?: ReactNode;
  withClose?: boolean;
  confirmText?: string | null;
  cancelText?: string | null;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  showCancel?: boolean;
}

export const Dialog: FC<Props> = memo(({
  action,
  cancelText = 'Cancel',
  children,
  className,
  confirmText = 'Confirm',
  onCancel,
  onClose,
  onConfirm,
  showCancel = false,
  title,
  visiable = true,
  withClose = false
}) => {
  const $div = createRef<HTMLDivElement>();

  const renderTitle = (): ReactNode => {
    if (!title) {
      return null;
    }

    return (
      <div className={classes.title}>
        {title}
        { withClose ? (
          <CloseIcon
            className={classes.close}
            onClick={onClose}
          />
        ) : null }
      </div>
    );
  };

  return (
    <Modal
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      className={classes.mask}
      closeAfterTransition
      container={$div.current}
      disableAutoFocus
      disableEnforceFocus
      open={visiable}
    >
      <Fade in={visiable}>
        <div className={
          clsx(
            classes.root,
            className,
            {
              [classes.visiable]: visiable
            }
          )
        }>
          {renderTitle()}
          <div className={classes.content}>{children}</div>
          <div className={classes.action}>
            {
              action || (
                <>
                  {showCancel ? (
                    <Button
                      onClick={onCancel}
                      size='small'
                    >
                      {cancelText}
                    </Button>
                  ) : null}
                  {onConfirm ? (
                    <Button
                      color='primary'
                      onClick={onConfirm}
                      size='small'
                    >
                      {confirmText}
                    </Button>
                  ) : null}
                </>
              )
            }
          </div>
        </div>
      </Fade>
    </Modal>
  );
});

Dialog.displayName = 'Dialog';
