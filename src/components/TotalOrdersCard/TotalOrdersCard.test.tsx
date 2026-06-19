import { render } from '@testing-library/react';
import TotalOrdersCard from './TotalOrdersCard';

describe('TotalOrdersCard', () => {
  it('should match snapshot', () => {
    const { container } = render(<TotalOrdersCard totalOrders={2} />);

    expect(container).toMatchSnapshot();
  });
});
