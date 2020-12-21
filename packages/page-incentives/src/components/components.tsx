import { TokenImage as OTokenImage, TxButton } from '@acala-dapp/react-components';
import { Button, styled } from '@acala-dapp/ui-components';

export const CardRoot = styled.div`
  margin-top: 40px;
  box-sizing: border-box;
  width: 250px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 1px 20px 0 rgba(23, 65, 212, 0.02);

  display: flex;
  padding: 32px 16px 25px 16px;
  flex-direction: column;
  align-items: center;
`;

export const TokenImage = styled(OTokenImage)`
  width: 64px;
  height: 64px;
`;

export const Description = styled.div`
  margin-top: 14px;
  font-size: 18px;
  line-height: 1.166667;
  font-weight: 400;
  color: var(--text-color-primary);
`;

export const DescriptionGray = styled(Description)`
  text-align: center;
  font-size: 14px;
  color: var(--text-color-second);
`;

export const EarnNumber = styled.p`
  margin-top: 9px;
  font-size: 24px;
  line-height: 1.208333;
  font-weight: bold;
  color: var(--text-color-black);
`;

export const EarnExtra = styled.p`
  font-size: 14px;
  line-height: 1.42857;
  color: var(--text-color-primary);
`;

export const ActionContainer = styled.div`
  width: 100%;
  margin-top: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const commonBtnStyle = `
  flex: 1;
  height: 32px;
  min-width: auto;
  padding: 0;
  border-radius: 2px;
  font-size: 14px;
`;

export const ClimeBtn = styled(TxButton)`
  ${commonBtnStyle}
  margin-right: 10px;
`;

export const ExtraBtn = styled(Button)`
  ${commonBtnStyle}
  background: var(--color-green) !important;
`;
