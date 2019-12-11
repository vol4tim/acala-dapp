import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import add from '@/assets/add.svg';
import { Vault } from '../../index.types';
import { getAssetName } from '@/utils';
import actions from '@/store/actions';
import { collateral } from '@/config';
import { vaultsSelector } from '@/store/chain/selectors';
import { userVaultsSelector } from '@/store/user/selectors';
import { BaseVaultData } from '@/store/types';
import Formatter from '@/components/formatter';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        cardRoot: {
            flexShrink: 0,
            width: 120,
            height: 100,
        },
        cardContent: {
            width: '100%',
            height: '100%',
            padding: '16px 16px 8px',
            cursor: 'pointer',
        },
        addContent: {
            '& .MuiTypography-h6': {
                marginTop: 8,
                fontWeight: 400,
            },
        },
    }),
);

const AddVault: React.FC<Pick<Props, 'onAdd'>> = ({ onAdd }) => {
    const classes = useStyle();
    return (
        <Grid item onClick={onAdd}>
            <Paper elevation={2} className={classes.cardRoot} square={true}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={clsx(classes.addContent, classes.cardContent)}
                >
                    <img src={add} />
                    <Typography variant="h6">Add Wallet</Typography>
                </Grid>
            </Paper>
        </Grid>
    );
};

interface Props {
    onAdd: () => void;
    onSelect: (vault: number) => void;
}

const VaultsList: React.FC<Props> = ({ onAdd, onSelect }) => {
    const classes = useStyle();
    const systemVaults = useSelector(vaultsSelector);
    const userVaults = useSelector(userVaultsSelector);
    const getRequiredCollateralRatio = (asset: number): number => {
        const result = systemVaults.filter(item => item.asset === asset);
        if (result.length) {
            return result[0].requiredCollateralRatio;
        }
        return 0;
    };

    return (
        <Grid container spacing={3}>
            {userVaults.map(item => (
                <Grid item key={`vault-type-${item.asset}`} onClick={() => onSelect(item.asset)}>
                    <Paper elevation={2} className={classes.cardRoot} square={true}>
                        <Grid container direction="column" justify="space-between" className={classes.cardContent}>
                            <Typography variant="h6">{getAssetName(item.asset)}</Typography>
                            <Typography variant="body1">
                                <Formatter type="ratio" data={getRequiredCollateralRatio(item.asset)} />
                            </Typography>
                        </Grid>
                    </Paper>
                </Grid>
            ))}
            <AddVault onAdd={onAdd} />
        </Grid>
    );
};

export default VaultsList;
