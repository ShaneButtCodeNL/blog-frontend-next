export const getDateString = (input: Date): string => {
  const date = new Date(input);
  return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${
    date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
  }/${date.getFullYear()}`;
};
