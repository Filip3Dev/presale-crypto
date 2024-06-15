import { render, screen } from '@testing-library/react';
import ModalSuccessState from '@/components/Modals/ModalProgressStates/ModalSuccessState/ModalSuccessState';

const successProps = {
  tokenAmount: '4',
  closeModal: () => {},
};

describe('ModalSuccessState', () => {
  it('should render the success icon', () => {
    render(<ModalSuccessState {...successProps} />);

    expect(screen.getByAltText('success icon')).toBeInTheDocument();
  });

  it('should render the success title text', () => {
    const titleText = 'Request successful';
    render(<ModalSuccessState {...successProps} />);

    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it('should render the token amount purchased text', () => {
    render(<ModalSuccessState {...successProps} />);

    expect(
      screen.getByText(`You just purchased ${successProps.tokenAmount} CLTS tokens.`)
    ).toBeInTheDocument();
  });

  it('should render the Polygonscan link if a transaction hash is provided', () => {
    const transactionHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    render(<ModalSuccessState {...{ ...successProps, transactionHash }} />);

    expect(screen.getByText('View on Polygonscan')).toBeInTheDocument();
  });

  it('should not render the Polygonscan link if a transaction hash is not provided', () => {
    render(<ModalSuccessState {...successProps} />);

    expect(screen.queryByText('View on Polygonscan')).not.toBeInTheDocument();
  });

  it('should render the close button', () => {
    render(<ModalSuccessState {...successProps} />);

    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('should call the closeModal function when the close button is clicked', () => {
    const closeModalMock = jest.fn();

    render(<ModalSuccessState {...{ ...successProps, closeModal: closeModalMock }} />);

    screen.getByText('Close').click();

    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });
});
