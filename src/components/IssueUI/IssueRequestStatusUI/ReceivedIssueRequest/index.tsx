import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import ExternalLink from 'components/ExternalLink';
import ErrorFallback from 'components/ErrorFallback';
import Ring48, { Ring48Title, Ring48Value } from 'components/Ring48';
import { BTC_EXPLORER_TRANSACTION_API } from 'config/blockstream-explorer-links';
import { shortAddress } from 'common/utils/utils';
import { getColorShade } from 'utils/helpers/colors';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import useCurrentActiveBlockNumber from 'services/hooks/use-current-active-block-number';
import useStableBitcoinConfirmations from 'services/hooks/use-stable-bitcoin-confirmations';
import { StoreType } from 'common/types/util.types';

interface Props {
  // TODO: should type properly (`Relay`)
  request: any;
}

const ReceivedIssueRequest = ({ request }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: stableBitcoinConfirmationsIdle,
    isLoading: stableBitcoinConfirmationsLoading,
    data: stableBitcoinConfirmations = 1, // TODO: double-check
    error: stableBitcoinConfirmationsError
  } = useStableBitcoinConfirmations();
  useErrorHandler(stableBitcoinConfirmationsError);

  const {
    isIdle: stableParachainConfirmationsIdle,
    isLoading: stableParachainConfirmationsLoading,
    data: stableParachainConfirmations = 100, // TODO: double-check
    error: stableParachainConfirmationsError
  } = useQuery<number, Error>(
    [GENERIC_FETCHER, 'btcRelay', 'getStableParachainConfirmations'],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(stableParachainConfirmationsError);

  const {
    isIdle: currentActiveBlockNumberIdle,
    isLoading: currentActiveBlockNumberLoading,
    data: currentActiveBlockNumber = 0, // TODO: double-check
    error: currentActiveBlockNumberError
  } = useCurrentActiveBlockNumber();
  useErrorHandler(currentActiveBlockNumberError);

  // TODO: should use skeleton loaders
  if (stableBitcoinConfirmationsIdle || stableBitcoinConfirmationsLoading) {
    return <>Loading...</>;
  }
  if (stableParachainConfirmationsIdle || stableParachainConfirmationsLoading) {
    return <>Loading...</>;
  }
  if (currentActiveBlockNumberIdle || currentActiveBlockNumberLoading) {
    return <>Loading...</>;
  }

  const requestConfirmations = request.backingPayment.includedAtParachainActiveBlock
    ? currentActiveBlockNumber - request.backingPayment.includedAtParachainActiveBlock
    : 0;

  return (
    <RequestWrapper>
      <h2 className={clsx('text-3xl', 'font-medium')}>{t('received')}</h2>
      <Ring48 className={getColorShade('green')}>
        <Ring48Title>{t('issue_page.waiting_for')}</Ring48Title>
        <Ring48Title>{t('confirmations')}</Ring48Title>
        <Ring48Value className={getColorShade('green')}>
          {`${request.backingPayment.confirmations ?? 0}/${stableBitcoinConfirmations}`}
        </Ring48Value>
        <Ring48Value className={getColorShade('green')}>
          {`${requestConfirmations}/${stableParachainConfirmations}`}
        </Ring48Value>
      </Ring48>
      <p className='space-x-1'>
        <span
          className={clsx(
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
        >
          {t('issue_page.btc_transaction')}:
        </span>
        <span className='font-medium'>{shortAddress(request.backingPayment.btcTxId || '')}</span>
      </p>
      <ExternalLink className='text-sm' href={`${BTC_EXPLORER_TRANSACTION_API}${request.backingPayment.btcTxId}`}>
        {t('issue_page.view_on_block_explorer')}
      </ExternalLink>
    </RequestWrapper>
  );
};

export default withErrorBoundary(ReceivedIssueRequest, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
