export const getTelegramUrl = (telegram?: string) => {
  const value = telegram?.trim();
  if (!value) return undefined;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://t.me/${value.replace(/^@/, "")}`;
};

export const getTelegramLabel = (telegram?: string) => {
  const value = telegram?.trim();
  if (!value) return undefined;

  const username = value
    .replace(/^https?:\/\/(?:www\.)?t\.me\//i, "")
    .replace(/^https?:\/\/(?:www\.)?telegram\.me\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0];

  return username ? `@${username}` : value;
};
