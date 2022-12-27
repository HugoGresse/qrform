import { writable, get } from 'svelte/store'
import { getLoginTokenCookie } from '../../utils/cookie.js'

export const userForms = writable([])

export const getUserForms = () => get(userForms)

export const loadFormsAction = async () => {
    const GET_URL = import.meta.env.VITE_USER_FORM_GET
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const response = await fetch(GET_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            token: getLoginTokenCookie(),
        })
    })

    if (response.ok) {
        const json = await response.json()
        if (Array.isArray(json) && json.length > 0) {
            userForms.set(json)
            return {
                success: true,
                data: json
            }
        }

        return {
            success: false,
            askRelogin: true,
            error: "Erreur lors de la récupération des fomulaires, reconnectez-vous."
        }
    }
    return {
        success: false,
        error: "Erreur lors de la récupération des fomulaires."
    }
}

export const updateFormAction = async (form) => {
    const UPDATE_URL = import.meta.env.VITE_USER_FORM_UPDATE
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const response = await fetch(UPDATE_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            token: getLoginTokenCookie(),
            form
        })
    })

    if (response.ok) {
        const text = await response.text()
        if(text === "ok") {
            return await loadFormsAction()
        }

        return {
            success: false,
            error: "Erreur lors de la récupération des fomulaires, reconnectez-vous."
        }
    }
    return {
        success: false,
        error: "Erreur lors de la récupération des fomulaires."
    }
}
