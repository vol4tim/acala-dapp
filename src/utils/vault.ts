import FixedU128 from './fixed_u128';

/**
 * requiredCollateralRatio = collateral * collateralPrice / debit * debitExchangeRate * stableCoinPrice
 */

// convert debit to stable coin amount
export function debitToStableCoin(
    debit: FixedU128,
    debitExchangeRate: FixedU128,
    stableCoinPrice: FixedU128,
): FixedU128 {
    return debit.mul(debitExchangeRate).mul(stableCoinPrice);
}

// convert stable coin amount to debits
export function stableCoinToDebit(
    stableVaule: FixedU128,
    debitExchangeRate: FixedU128,
    stableCoinPrice: FixedU128,
): FixedU128 {
    return stableVaule.div(stableCoinPrice).div(debitExchangeRate);
}

// convert collateral to stable coin amount
export function collateralToStableCoin(collateral: FixedU128, collateralPrice: FixedU128): FixedU128 {
    return collateral.mul(collateralPrice);
}

export function calcCollateralRatio(collateralVaule: FixedU128, debitVaule: FixedU128): FixedU128 {
    return collateralVaule.div(debitVaule);
}

export function calcStableFee(stableFee: FixedU128): FixedU128 {
    return FixedU128.fromNatural((1 + stableFee.toNumber()) ** ((356 * 24 * 60 * 60) / 4) - 1);
}

export function calcRequiredCollateral(
    debitValue: FixedU128,
    requiredCollateralRatio: FixedU128,
    collateralPrice: FixedU128,
): FixedU128 {
    return debitValue.mul(requiredCollateralRatio).div(collateralPrice);
}

export function calcCanGenerater(
    collateralValue: FixedU128,
    debitValue: FixedU128,
    requiredCollateralRatio: FixedU128,
): FixedU128 {
    return collateralValue.div(requiredCollateralRatio).sub(debitValue);
}

export function calcLiquidationPrice(
    debitValue: FixedU128,
    requiredCollateralRatio: FixedU128,
    collateral: FixedU128,
): FixedU128 {
    return debitValue.mul(requiredCollateralRatio).div(collateral);
}

//TODO: need
const EXCHANGE_FEE = FixedU128.fromRational(2, 1000);

export function calcReceive(supply: FixedU128, currentSupply: FixedU128, currentTarget: FixedU128): FixedU128 {
    if (supply.isZero()) {
        return FixedU128.fromNatural(0);
    }
    return currentTarget
        .sub(currentSupply.mul(currentTarget).div(currentSupply.add(supply)))
        .mul(FixedU128.fromNatural(1).sub(EXCHANGE_FEE));
}

export function calcPay(target: FixedU128, currentSupply: FixedU128, currentTarget: FixedU128): FixedU128 {
    if (target.isZero()) {
        return FixedU128.fromNatural(0);
    }
    return currentSupply
        .mul(currentTarget)
        .div(currentTarget.sub(target.mul(FixedU128.fromNatural(1).sub(EXCHANGE_FEE))))
        .sub(currentSupply);
}