export type ApiOptions = {
  allowUnauthorized: boolean;
};

export type NavigateFunction = (path: string) => void;

export type ApiResponse<T> = [number, T];

export function getDefaultApiOptions(): ApiOptions {
  return {
    allowUnauthorized: false,
  };
}

async function processResponse(
  navigate: NavigateFunction | undefined,
  response: Response,
  ignoreUnauthorized = false
): Promise<[number, any]> {
  if (response.status === 401 && !ignoreUnauthorized) {
    navigate?.("/login");

    return [response.status, undefined];
  } else {
    if (response.headers.get("Content-Type") === "application/json") {
      return [response.status, await response.json()];
    } else {
      return [response.status, await response.text()];
    }
  }
}

export async function getMe(
  navigate?: NavigateFunction
): Promise<ApiResponse<{ username: string; is_admin: boolean } | undefined>> {
  return fetch("/api/v1/users/me").then(processResponse.bind(null, navigate));
}

export async function getUserProfile(
  username: string,
  navigate?: NavigateFunction
): Promise<ApiResponse<{ username: string } | undefined>> {
  return fetch(`/api/v1/users/${encodeURIComponent(username)}`).then(
    processResponse.bind(null, navigate)
  );
}

export async function registerUser(
  username: string,
  password: string,
  navigate?: NavigateFunction
): Promise<
  ApiResponse<
    { Ok: { two_factor_url: string; two_factor_qr: string } } | undefined
  >
> {
  return fetch(`/api/v1/users/register`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(processResponse.bind(null, navigate));
}

export async function loginUser(
  username: string,
  password: string,
  twoFactorCode?: string,
  navigate?: NavigateFunction
): Promise<
  ApiResponse<
    | "Ok"
    | "TwoFactorRequired"
    | "InvalidCredentials"
    | "InvalidTwoFactor"
    | undefined
  >
> {
  return fetch(`/api/v1/users/login`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
      two_factor_code: twoFactorCode,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => processResponse(navigate, response, true));
}

export async function logoutUser() {
  return fetch(`/api/v1/users/logout`, {
    method: "POST",
  }).then(processResponse.bind(null, undefined));
}
