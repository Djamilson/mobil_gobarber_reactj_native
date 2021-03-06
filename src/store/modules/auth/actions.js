export function signInRequest(email, password, navPageActiveCount) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: {email, password, navPageActiveCount},
  };
}

export function signInSuccess(token, user) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: {token, user},
  };
}

export function signUpRequest(name, email, password, privacy, resetForm) {
  return {
    type: '@auth/SIGN_UP_REQUEST',
    payload: {name, email, password, privacy, resetForm},
  };
}

export function tokenUpRequest(token) {
  return {
    type: '@auth/TOKEN_UP_REQUEST',
    payload: {token},
  };
}

export function signSuccess() {
  return {type: '@auth/SIGN_SUCCESS'};
}

export function signFailure() {
  return {type: '@auth/SIGN_FAILURE'};
}

export function sigUpFailure() {
  return {type: '@user/SIGNUP_FAILURE'};
}

export function signOut() {
  return {
    type: '@auth/SIGN_OUT',
  };
}

export function acceptionRegulation(token, newPrivacy, navigate) {
  return {
    type: '@auth/ACCEPT_REGULATION',
    payload: {token, newPrivacy, navigate},
  };
}
