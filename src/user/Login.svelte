<script>
    import { parseQuery } from '../utils/parseQueryString.js'
    import { setLoginTokenCookie } from '../utils/cookie.js'
    import Textfield from '@smui/textfield'
    import HelperText from '@smui/textfield/helper-text'
    import Button, { Label } from '@smui/button'
    import Icon from '@smui/textfield/icon'
    import CircularProgress from '@smui/circular-progress'
    import { STATUS } from '../utils/Status.js'
    import { md5, SUFFIX } from '../utils/md.js'

    const LOGIN_URL = import.meta.env.VITE_LOGIN_URL

    export let location
    let displayLogin = false
    let email = ""
    let status
    let error

    if (location && location.search && parseQuery(location.search).token) {
        const token = parseQuery(location.search).token
        setLoginTokenCookie(token)
        const currentUrl = location.origin + location.pathname
        // Remove token from history
        history.replaceState({}, document.title, currentUrl)
        // Open user forms
        window.location.replace(`${location.origin}/user/forms`)
    } else {
        displayLogin = true
    }


    const onSubmit = async (event) => {
        event.preventDefault()
        error = null
        status = STATUS.SENDING

        const headers = new Headers()
        headers.append("Content-Type", "application/json")

        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    email: email,
                    a: md5(email + SUFFIX)
                })
            })
            const responseText = await response.text()
            if (response.ok) {
                const responseJson = JSON.parse(responseText)
                if (responseJson.error) {
                    status = STATUS.SENT_ERROR
                    error = "Erreur lors de l'envoie du lien de connexion:\n" + responseJson.error
                } else {
                    status = STATUS.SENT_SUCCESS
                }
            } else {
                error = "Erreur lors de l'envoie du lien de connexion:\n" + responseText
                status = STATUS.SENT_ERROR
            }
        } catch (catchedError) {
            console.log(catchedError)
            error = "Erreur lors de l'envoie du lien de connexion"
            status = STATUS.SENT_ERROR
        }

    }

</script>

<main>
    <img src="/qrform.svg" width="200" alt="QRForm"/>

    {#if displayLogin}
        <h3>Connectez-vous à votre compte QRForm</h3>

        <form method="post">
            {#if (status !== STATUS.SENT_SUCCESS)}
                <Textfield variant="filled" bind:value={email} label="Email" type="email"
                           style="width: 100%;"
                           input$autocomplete="email"
                           helperLine$style="width: 100%;"
                >
                    <Icon class="material-icons" slot="leadingIcon">email</Icon>
                    <HelperText slot="helper">L'email sur lequel vous recevez les données de QRForm. Nous vous enverrons
                        le
                        lien de connexion directement par email.
                    </HelperText>
                </Textfield>

                <Button color="secondary" disabled="{status === STATUS.SENDING}" on:click={onSubmit} touch type="submit"
                        variant="outlined">
                    <Label>{status === STATUS.SENDING ? "Envoie..." : "Envoyer le lien"}</Label>
                    {#if status === STATUS.SENDING}
                        <CircularProgress style="height: 24px; width: 24px;" indeterminate/>
                    {/if}
                </Button>
                {#if status === STATUS.SENT_ERROR}
                    <h4>{error}</h4>
                {/if}
            {:else if status === STATUS.SENT_SUCCESS}
                <h4>Email de connexion envoyé.</h4>
            {/if}
        </form>
    {:else}
        <h3>Connexion...</h3>
    {/if}

</main>

<style>
    main {
        min-height: 100%;
    }

    h4 {
        color: #000;
    }
</style>
