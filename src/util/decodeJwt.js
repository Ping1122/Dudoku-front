export function decodeJwt(token) {
  if (token === null) return null;
  let base64Url = token.split(".")[1];
  let decodedValue = JSON.parse(window.atob(base64Url));
  return decodedValue.sub;
}
