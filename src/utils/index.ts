export const addLeadZero = (value: number): string | number =>
  value.toString().length > 1 ? value : "0" + value;

export const getDateTime = (): string => {
  const d = new Date();
  return `${addLeadZero(d.getHours())}.${addLeadZero(
    d.getMinutes()
  )}.${addLeadZero(d.getSeconds())} ${addLeadZero(
    d.getMonth() + 1
  )}/${addLeadZero(d.getDate())}/${d.getFullYear()}`;
};

export const getUser = (): string => process.env.USER || "anon";
