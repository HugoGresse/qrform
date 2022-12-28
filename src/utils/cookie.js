const cookieName = "qrform_login_cookie"
const cookieDurationInDays = 1

export const setLoginTokenCookie = (value) =>  {
    let expires = ""
    const date = new Date()
    date.setTime(date.getTime() + (cookieDurationInDays * 24 * 60 * 60 * 1000))
    expires = "; expires=" + date.toUTCString()
    document.cookie = cookieName + "=" + (value || "") + expires + "; path=/"
}

export const  getLoginTokenCookie = ()  => {
    const nameEQ = cookieName + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
}

export const eraseLoginTokenCookie = () => {
    document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}
