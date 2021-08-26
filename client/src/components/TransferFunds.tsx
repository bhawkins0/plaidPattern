import React, { useState } from 'react';

import { NumberInput } from 'plaid-threads/NumberInput';
import { Button } from 'plaid-threads/Button';
import { currencyFilter } from '../util';

interface Props {
  checkAmountAndInitiate: (amount: number) => void;
  closeView: () => void;
  setShowInput: (arg: boolean) => void;
}
const TransferFunds: React.FC<Props> = (props: Props) => {
  const [transferAmount, setTransferAmount] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.checkAmountAndInitiate(parseFloat(transferAmount));
    setTransferAmount('');
    props.setShowInput(false);
  };

  const amt =
    parseFloat(transferAmount) > 0
      ? currencyFilter(parseFloat(transferAmount))
      : '';
  return (
    <>
      <div>
        <div className="transferFundsHeader">
          <h3 className="transferFundsTitle">Transfer Funds</h3>{' '}
        </div>
        <h4>Enter amount</h4>
        <form onSubmit={handleSubmit}>
          <NumberInput
            id="transferAmount"
            name="transfer amount"
            value={transferAmount}
            required
            placeholder="0.00"
            label="transfer_amount"
            onChange={e => setTransferAmount(e.currentTarget.value)}
            className="transferAmtInput"
          />
          <Button
            small
            centered
            secondary
            inline
            onClick={() => props.closeView()}
          >
            Back
          </Button>
          <Button small centered inline type="submit">
            Submit {amt}
          </Button>
        </form>
      </div>
    </>
  );
};
TransferFunds.displayName = 'TransferFunds';
export default TransferFunds;
