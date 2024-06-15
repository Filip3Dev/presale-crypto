import { ConnectKitButton } from 'connectkit';
import { Button, Text } from '@mantine/core';

/**
 * wallet connect button using ConnectKit.Custom
 * @props isFullWidth - whether button should take up parent width
 * @prop size - size of button
 * @prop text - text to display on button
 * @returns React node
 */
const WalletConnectButton: React.FC<{ isFullWidth?: boolean; size?: string; text?: string }> = ({
  isFullWidth = false,
  size = 'md',
  text = 'Connect Wallet',
}) => (
  <ConnectKitButton.Custom>
    {({ isConnected, show, truncatedAddress, ensName }) => (
      <Button
        id="header_button"
        radius="md"
        size={size}
        uppercase
        style={{
          backgroundColor: '#CAFC36',
          color: '#000000',
        }}
        onClick={show}
        fullWidth={isFullWidth}
      >
        <Text fz="md">{isConnected ? ensName ?? truncatedAddress : text}</Text>
      </Button>
    )}
  </ConnectKitButton.Custom>
);

export default WalletConnectButton;
