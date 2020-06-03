import Cookies from 'js-cookie'

const TokenKey = 'Yfas-Carrot'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  //console.log(TokenKey + token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
