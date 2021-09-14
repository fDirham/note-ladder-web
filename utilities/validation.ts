export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validateAlphanumeric(string: string, maxLength: number = 30) {
  if (string.length > maxLength) return false;
  const fnameRegex = /^[a-zA-Z0-9]*$/;
  return fnameRegex.test(string);
}
