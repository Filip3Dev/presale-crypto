import { render, screen } from '@testing-library/react';
import TokenPurchaseBalances from '@/components/TokenPurchaseBalances/TokenPurchaseBalances';

const balanceProps = {
  walletMaticBalance: 4.5,
  walletTokenBalance: 600,
  totalPriceOfPurchase: 2.5,
  insufficientBalance: false,
};

describe('TokenPurchaseBalances', () => {
  it('should render the total price of purchase', () => {
    render(<TokenPurchaseBalances {...balanceProps} />);

    expect(
      screen.getByText(`${balanceProps.totalPriceOfPurchase.toFixed(5)} BNB`)
    ).toBeInTheDocument();
  });

  it('should render the wallet Matic balance', () => {
    render(<TokenPurchaseBalances {...balanceProps} />);

    expect(
      screen.getByText(`${balanceProps.walletMaticBalance.toFixed(5)} BNB`)
    ).toBeInTheDocument();
  });

  it('should render the wallet token balance', () => {
    render(<TokenPurchaseBalances {...balanceProps} />);

    expect(
      screen.getByText(`${balanceProps.walletTokenBalance.toFixed(5)} CLTS`)
    ).toBeInTheDocument();
  });

  it('should render the total price of purchase in red if the user has insufficient balance', () => {
    const insufficientBalance = true;

    render(<TokenPurchaseBalances {...{ ...balanceProps, insufficientBalance }} />);

    expect(screen.getByText(`${balanceProps.totalPriceOfPurchase.toFixed(5)} BNB`)).toHaveStyle(
      'color: rgb(250, 82, 82)'
    );
  });

  it('should render the amount to pay text in red if the user has insufficient balance', () => {
    const insufficientBalance = true;

    render(<TokenPurchaseBalances {...{ ...balanceProps, insufficientBalance }} />);

    expect(screen.getByText('Amount to pay')).toHaveStyle('color: rgb(250, 82, 82)');
  });
});
