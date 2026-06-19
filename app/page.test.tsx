import { render } from '@testing-library/react';
import AppPage from './page';

let mockIsLoading = false;
jest.mock('@/src/providers/warehouse/useWarehouse', () => () => ({
  isLoading: mockIsLoading,
}));

jest.mock('@/src/components/HomeDashboard', () => ({
  __esModule: true,
  default: () => <span>Home Dashboard</span>,
}));

describe('app/page', () => {
  it('should show loading state', () => {
    mockIsLoading = true;

    const { queryByText } = render(<AppPage />);

    expect(queryByText('Greetings! Loading Warehouse...')).not.toBeNull();
  });

  it('should show home dashboard', () => {
    mockIsLoading = false;

    const { queryByText } = render(<AppPage />);

    expect(queryByText('Home Dashboard')).not.toBeNull();
  });
});
