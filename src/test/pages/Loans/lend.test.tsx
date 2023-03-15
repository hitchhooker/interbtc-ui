import '@testing-library/jest-dom';

import App from '@/App';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { mockTokensBalance } from '@/test/mocks/@interlay/interbtc-api';
import {
  DEFAULT_ASSETS,
  DEFAULT_BORROW_POSITIONS,
  DEFAULT_IBTC,
  DEFAULT_IBTC_LOAN_ASSET,
  DEFAULT_LEND_POSITIONS,
  mockGetBorrowPositionsOfAccount,
  mockGetLendPositionsOfAccount,
  mockGetLoanAssets,
  mockLend
} from '@/test/mocks/@interlay/interbtc-api/parachain/loans';

import { render, screen, userEvent, waitFor } from '../../test-utils';
import { submitForm, withinModalTabPanel } from '../utils/loans';
import { TABLES } from './constants';

const path = '/lending';
const tab = 'lend';

describe('Lending Flow', () => {
  beforeEach(() => {
    mockGetLoanAssets.mockReturnValue(DEFAULT_ASSETS);
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
    mockLend.mockRestore();
  });

  afterAll(() => {
    mockGetBorrowPositionsOfAccount.mockReturnValue(DEFAULT_BORROW_POSITIONS);
    mockGetLendPositionsOfAccount.mockReturnValue(DEFAULT_LEND_POSITIONS);
  });

  it('should be able to lend', async () => {
    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC');

    expect(tabPanel.getByRole('meter', { name: /ltv meter/i })).toBeInTheDocument();

    userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await submitForm(tabPanel, 'lend');

    expect(mockLend).toHaveBeenCalledWith(WRAPPED_TOKEN, DEFAULT_IBTC.MONETARY.MEDIUM);
  });

  it('should not be able to lend over available balance', async () => {
    mockTokensBalance.emptyBalance();

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC');

    userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'lend amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /lend/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockLend).not.toHaveBeenCalled();
    });

    mockTokensBalance.restore();
  });

  it('should not be able to lend due to lack of borrows and supply cap', async () => {
    mockGetLoanAssets.mockReturnValue({
      IBTC: {
        ...DEFAULT_IBTC_LOAN_ASSET,
        totalBorrows: DEFAULT_IBTC.MONETARY.VERY_LARGE,
        supplyCap: DEFAULT_IBTC.MONETARY.EMPTY
      }
    });

    await render(<App />, { path });

    const tabPanel = withinModalTabPanel(TABLES.LEND.POSITION, tab, 'IBTC');

    userEvent.type(tabPanel.getByRole('textbox', { name: 'lend amount' }), DEFAULT_IBTC.AMOUNT.MEDIUM);

    await waitFor(() => {
      expect(tabPanel.getByRole('textbox', { name: 'lend amount' })).toHaveErrorMessage('');
    });

    userEvent.click(tabPanel.getByRole('button', { name: /lend/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockLend).not.toHaveBeenCalled();
    });
  });
});
