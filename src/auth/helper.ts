import cookie from "js-cookie";

// set in cookie
export const setCookie = (key: string, value: any) => {
  if (window !== undefined) {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

// remove from cookie
export const removeCookie = (key: string) => {
  if (window !== undefined) {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

// get from cookie such as stored token
// will be usefull when we need to make request to server with token
export const getCookie = (key: string) => {
  if (window !== undefined) {
    return cookie.get(key);
  }
};

// set in localstorage
export const setLocalStorage = (key: string, value: any) => {
  if (window !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from localstorage

export const removeLocalStorage = (key: string) => {
  if (window !== undefined) {
    localStorage.removeItem(key);
  }
};

// authenicate user by passing data to cookie and localstorage during signin

export const authenicate = (response: any, next: Function) => {
  console.log("AUTHENTICATE HELPER ON SIGNIN RESPONSE ", response);
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

// access user info from localstorage
export const isAuth = () => {
  if (window !== undefined) {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user")!);
      } else {
        return false;
      }
    }
  }
};

export const signout = (next: Function) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();
};

export const updateUser = (response: any, next: Function) => {
  console.log("UPDATE USER IN LOCALSTORAGE HELPERS ", response);
  if (window !== undefined) {
    let auth = JSON.parse(localStorage.getItem("user")!);
    auth = response.data;
    localStorage.setItem("user", JSON.stringify(auth));
  }
  next();
};
