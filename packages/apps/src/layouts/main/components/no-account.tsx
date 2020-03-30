import React from 'react';
import { Dialog, DialogContent, Button, DialogActions, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';

interface Props {
    open: boolean;
}
const NoAccount: React.FC<Props> = ({ open }) => {
    const { t } = useTranslate();
    const handleRetry = () => {
        window.location.reload();
    };
    return (
        <Dialog open={open}>
            <DialogContent>
                {t('No account found, please add account in your wallet extension or unlock it!')}
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleRetry}>
                    Retry
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NoAccount;