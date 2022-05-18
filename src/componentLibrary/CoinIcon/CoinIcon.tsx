import { CurrencySymbols } from '../';
import { KbtcIcon, KsmIcon } from './icons';
import { IconWrapper, IconWrapperProps } from './CoinIcon.style';

interface CoinIconProps extends IconWrapperProps {
  coin: CurrencySymbols;
}

const CoinIcon = ({ coin, size = 'small' }: CoinIconProps): JSX.Element => {
  return (
    <IconWrapper size={size}>
      {coin === 'kBTC' ? (
        <KbtcIcon />
      ) : coin === 'KSM' ? (
        <KsmIcon />
      ) : null}
    </IconWrapper>
  );
};

export { CoinIcon };

export type { CoinIconProps };
