import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box } from '@material-ui/core';
import { Vault, SystemInfoData, CollateralInfoData, TransactionHistoryData, CurrentVault } from './index.types';

import PricesFeed from './components/prices-feed';
import VaultsList from './components/vaults-list';
import SystemInfo from './components/system-info';
import CollateralInfo from './components/collateral-info';
import VaultPanel from './components/vault-panel';
import TransactionHistory from './components/transaction-history';
import VaultInfo from './components/vault-info';
import AddVault from './components/add-vault';
import actions from '@/store/actions';
import { collateral } from '@/config';
import { userVaultsSelector } from '@/store/user/selectors';

const systemInfo: SystemInfoData = {
    aUSDSupply: 12312313,
};

const collateralInfo: { [k: number]: CollateralInfoData } = {
    2: {
        liquidationRatio: 150,
        stabilityFee: 5,
    },
};

const mockTransactionHistoryData: TransactionHistoryData[] = [
    {
        asset: 2,
        action: 'Create CDP',
        when: 112312312,
        from: 'sdfsdfsdfsd',
        tx: 'xxxxxxxxxxxx',
    },
];

const Loan: React.FC = () => {
    const dispatch = useDispatch();
    const [currentVault, setCurrentVault] = useState<number>(0);
    const [addVaultStatus, setAddVaultstatus] = useState<boolean>(false);
    const userVaults = useSelector(userVaultsSelector);

    const showAddVault = () => setAddVaultstatus(true);
    const hideAddVault = () => setAddVaultstatus(false);

    useEffect(() => {
        // fetch system vaults info
        dispatch(actions.chain.fetchVaults.request(collateral));
        // fetch user vaults info
        dispatch(actions.user.fetchVaults.request(collateral));
    }, [dispatch]);

    useEffect(() => {
        console.log(userVaults, !userVaults.length);
        // if user vaults is empty then show add vault view
        setAddVaultstatus(!userVaults.length);
        // set default current vault
        if (userVaults.length) {
            setCurrentVault(userVaults[0].asset);
        }
    }, [userVaults]);

    const handleVaultSelect = (vault: number) => {
        setCurrentVault(vault);
        setAddVaultstatus(false);
    };

    return (
        <div>
            <VaultsList onAdd={showAddVault} onSelect={handleVaultSelect} />
            <Box paddingTop={7} />
            <Grid container spacing={6}>
                <Grid item xs={8}>
                    {addVaultStatus ? (
                        <AddVault onCancel={hideAddVault} />
                    ) : (
                        <>
                            <VaultInfo current={currentVault} />
                            <Box paddingTop={7} />
                            <VaultPanel asset={2} />
                            <Box paddingTop={7} />
                            <TransactionHistory data={mockTransactionHistoryData} />
                        </>
                    )}
                </Grid>
                <Grid item xs={4}>
                    <PricesFeed />
                    <Box paddingTop={3} />
                    <SystemInfo data={systemInfo} />
                    <Box paddingTop={3} />
                    <CollateralInfo current={2} data={collateralInfo} />
                </Grid>
            </Grid>
        </div>
    );
};

export default Loan;
