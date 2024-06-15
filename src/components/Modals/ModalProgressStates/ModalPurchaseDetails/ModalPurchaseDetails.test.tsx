import { render, screen } from '@testing-library/react';
import ModalPurchaseDetails from '@/components/Modals/ModalProgressStates/ModalPurchaseDetails/ModalPurchaseDetails';

// test props
const detailsProp = {
  totalPriceOfPurchase: 100,
  tokenAmount: '13',
  walletMaticBalance: 2.5,
  stageTokenPrice: 0.00067,
};

describe('ModalPurchaseDetails', () => {
  it('should render the title text', () => {
    const titleText = 'Buy CLTS Tokens';
    render(<ModalPurchaseDetails {...detailsProp} />);

    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it('should render the total price of purchase', () => {
    render(<ModalPurchaseDetails {...detailsProp} />);

    expect(screen.getByText(detailsProp.totalPriceOfPurchase.toFixed(5))).toBeInTheDocument();
  });

  it('should render the wallet Matic balance', () => {
    render(<ModalPurchaseDetails {...detailsProp} />);

    expect(screen.getByText(detailsProp.walletMaticBalance.toFixed(5))).toBeInTheDocument();
  });

  it('should render the token amount to be purchased', () => {
    render(<ModalPurchaseDetails {...detailsProp} />);

    expect(screen.getByText(detailsProp.tokenAmount)).toBeInTheDocument();
  });

  it('should render the stage token price', () => {
    render(<ModalPurchaseDetails {...detailsProp} />);

    expect(screen.getByText(detailsProp.stageTokenPrice.toFixed(5))).toBeInTheDocument();
  });

  it('should render the Matic icon', () => {
    render(<ModalPurchaseDetails {...detailsProp} />);

    expect(screen.getByAltText('matic icon')).toBeInTheDocument();
  });

  it('should render the CLTS icon', () => {
    render(<ModalPurchaseDetails {...detailsProp} />);

    expect(screen.getByAltText('tstk icon')).toBeInTheDocument();
  });
});
