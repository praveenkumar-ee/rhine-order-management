import { formatDate, formatOrderId, formatPrice } from './formatter';

describe('formatter', () => {
  describe('formatOrderId', () => {
    it('prefixes the id with #', () => {
      expect(formatOrderId('abcdef123456')).toBe('#ABCDEF12');
    });

    it('truncates and formats longer than 8 characters', () => {
      expect(formatOrderId('abcDefghijkl')).toBe('#ABCDEFGH');
    });
  });

  describe('formatDate', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('formats the date using Intl.DateTimeFormat', () => {
      const formatMock = jest.fn().mockReturnValue('Jan 1, 10:30 AM');

      const dateTimeFormatSpy = jest
        .spyOn(Intl, 'DateTimeFormat')
        .mockImplementation(
          () =>
            ({
              format: formatMock,
            } as unknown as Intl.DateTimeFormat)
        );

      const value = '2024-01-01T10:30:00Z';

      expect(formatDate(value)).toBe('Jan 1, 10:30 AM');

      expect(dateTimeFormatSpy).toHaveBeenCalledWith('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });

      expect(formatMock).toHaveBeenCalledWith(new Date(value));
    });
  });

  describe('formatPrice', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('formats the price using Intl.NumberFormat', () => {
      const formatMock = jest.fn().mockReturnValue('$123');

      const numberFormatSpy = jest
        .spyOn(Intl, 'NumberFormat')
        .mockImplementation(
          () =>
            ({
              format: formatMock,
            } as unknown as Intl.NumberFormat)
        );

      expect(formatPrice(12345)).toBe('$123');

      expect(numberFormatSpy).toHaveBeenCalledWith('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      });

      expect(formatMock).toHaveBeenCalledWith(123.45);
    });
  });
});
