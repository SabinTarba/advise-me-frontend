import { decrypt } from "./crypto";

export function getToken() : string | null {
    return localStorage.getItem("token");
}

export function isUserLoggedIn() : boolean {

    if(!localStorage.getItem("l_u") || !localStorage.getItem("token")) return false;

    const userData = getUserLoggedData();

    if(!userData?.email ||  !userData?.password || !userData?.id) return false;

    return true;
}

export function setToken(token: string){
    localStorage.setItem("token", token);
}

export function getUserLoggedData() : any | null {

    try {
        return JSON.parse(decrypt(localStorage.getItem("l_u")));
    } catch(ex){
        return null;
    }
}

export function saveUserLoggedData(data: string){
    localStorage.setItem("l_u", data);
}