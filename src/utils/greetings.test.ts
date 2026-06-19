import { getGreeting } from './greetings';

describe('getGreeting', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns "Good Morning!" before 12 PM', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(9);

    expect(getGreeting()).toBe('Good Morning!');
  });

  it('returns "Good Afternoon!" between 12 PM and 4:59 PM', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(14);

    expect(getGreeting()).toBe('Good Afternoon!');
  });

  it('returns "Good Evening!" at 5 PM or later', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(18);

    expect(getGreeting()).toBe('Good Evening!');
  });

  it('returns "Good Afternoon!" exactly at 12 PM', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(12);

    expect(getGreeting()).toBe('Good Afternoon!');
  });
});
