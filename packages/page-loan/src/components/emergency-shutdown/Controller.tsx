import React, { FC, useMemo, useContext, useCallback } from 'react';
import clsx from 'clsx';

import { Button } from '@acala-dapp/ui-components';
import { useModal } from '@acala-dapp/react-hooks';

import classes from './Controller.module.scss';
import { EmergencyShutdownContext, StepRoute } from './EmergencyShutdownProvider';
import { ReclaimModal } from './ReclaimModal';

export const Controller: FC = () => {
  const { canReclaim, reclaimBalanceIsEmpty, setStep, step } = useContext(EmergencyShutdownContext);
  const { close: closeReclaimModal, open: openReclaimModal, status } = useModal();

  const handlePrevious = useCallback(() => {
    if (step === 'success') return false;

    const currentIndex = StepRoute.findIndex((i) => i === step);

    if (currentIndex >= 0 && currentIndex < StepRoute.length) {
      setStep(StepRoute[currentIndex - 1]);
    }
  }, [setStep, step]);

  const handleNext = useCallback(() => {
    if (step === 'success') return false;

    const currentIndex = StepRoute.findIndex((i) => i === step);

    if (currentIndex >= 0 && currentIndex < StepRoute.length - 1) {
      setStep(StepRoute[currentIndex + 1]);
    }
  }, [setStep, step]);

  const handleDone = useCallback(() => {
    setStep('trigger');
  }, [setStep]);

  const hasPrevious = useMemo(() => {
    if (step === 'success') return false;

    return step !== 'trigger';
  }, [step]);

  const hasNext = useMemo<boolean>(() => {
    if (step === 'trigger') {
      return !reclaimBalanceIsEmpty;
    }

    if (step === 'process') return canReclaim;

    if (step === 'reclaim') return false;

    if (step === 'success') return false;

    return true;
  }, [canReclaim, step, reclaimBalanceIsEmpty]);

  const hasReclaim = useMemo<boolean>(() => {
    if (step === 'reclaim') return true;

    return false;
  }, [step]);

  const hasDone = useMemo<boolean>(() => {
    if (step === 'success') return true;

    return false;
  }, [step]);

  if (reclaimBalanceIsEmpty && step !== 'success') {
    return null;
  }

  return (
    <div className={clsx(classes.root, { [classes.hasPrevious]: hasPrevious, [classes.signlePrevious]: !hasNext && !hasReclaim })}>
      {
        hasPrevious ? <Button
          className={classes.previous}
          color='primary'
          onClick={handlePrevious}
          type='ghost'
        >
          Previous
        </Button> : null
      }
      {
        hasNext ? <Button
          className={classes.next}
          color='primary'
          onClick={handleNext}
          size='large'
          type='normal'
        >
          NEXT
        </Button> : null
      }
      {
        hasReclaim ? <Button
          className={classes.next}
          color='primary'
          onClick={openReclaimModal}
          size='large'
          type='normal'
        >
          Reclaim
        </Button> : null
      }
      {
        hasDone ? <Button
          className={classes.next}
          color='primary'
          onClick={handleDone}
          size='large'
          type='normal'
        >
          Done
        </Button> : null
      }
      <ReclaimModal
        onClose={closeReclaimModal}
        visiable={status}
      />
    </div>
  );
};
