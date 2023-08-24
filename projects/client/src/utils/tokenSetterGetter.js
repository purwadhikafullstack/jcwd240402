export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
}

export function setCookie(name, value, expirationHours) {
  const date = new Date();
  date.setTime(date.getTime() + expirationHours * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

export function removeCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function getLocalStorage(name) {
  return localStorage.getItem(name);
}

export function setLocalStorage(name, refreshToken) {
  return localStorage.setItem(name, refreshToken);
}

export function removeLocalStorage(name) {
  return localStorage.removeItem(name);
}

export function logout() {
  removeLocalStorage("refresh_token");
  removeCookie("access_token");
}

