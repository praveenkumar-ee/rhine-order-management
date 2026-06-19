import { render } from '@testing-library/react';
import * as icons from './Icons';

describe('Icons', () => {
  it.each(Object.keys(icons))('should match snapshot for %s', (icon) => {
    const Icon = icons[icon as keyof typeof icons];
    const { container } = render(<Icon />);

    expect(container).toMatchSnapshot();
  });
});
