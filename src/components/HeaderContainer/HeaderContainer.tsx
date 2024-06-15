import { Container, Group, Image } from '@mantine/core';
import WalletConnectButton from '@/components/WalletConnectButton/WalletConnectButton';

/**
 * Header section component.
 * renders a brand logo and the wallet connect button
 * @returns
 */
const HeaderContainer: React.FC = () => (
  <div>
    <Container size="lg">
      <Group position="apart">
        <div>
          <Image maw={140} mx="auto" radius="md" src="https://ik.imagekit.io/abkvohwfl/creditLedgerLogo_mGj-5_iV9.png" alt="brand logo" />
        </div>
        <WalletConnectButton />
      </Group>
    </Container>
  </div>
);

export default HeaderContainer;
