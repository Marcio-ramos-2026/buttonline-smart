export const dateUTC = (defaultDate?: string | Date) => {
  const date = defaultDate ? new Date(defaultDate) : new Date()

  const brazilOffset = -3 * 60 * 60 * 1000;

  const brazilianTime = new Date(date.getTime() + brazilOffset);

  return brazilianTime
};
