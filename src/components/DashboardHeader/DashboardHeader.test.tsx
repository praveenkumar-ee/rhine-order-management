import { render } from '@testing-library/react';
import DashboardHeader from './DashboardHeader';

jest.mock('@/src/utils/greetings', () => ({
  getGreeting: () => 'Good Morning',
}));

describe('DashboardHeader', () => {
  it('should render header elements', () => {
    const { queryByText } = render(<DashboardHeader />);

    expect(queryByText('Hi, User')).not.toBeNull();
    expect(queryByText('Good Morning')).not.toBeNull();
  });
});