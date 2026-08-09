export function getToken() {
    return localStorage.getItem("jwt");
}

export function logout() {

    localStorage.removeItem("jwt");

    window.location.href = "/login";
}

export function isLoggedIn() {

    return !!localStorage.getItem("jwt");
}
