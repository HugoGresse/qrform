<script>
    import { getLoginTokenCookie } from '../utils/cookie.js'
    import CircularProgress from '@smui/circular-progress'
    import FormItem from './form/FormItem.svelte'

    const GET_URL = import.meta.env.VITE_USER_FORM_GET
    const UPDATE_URL = import.meta.env.VITE_USER_FORM_UPDATE

    let loading = false
    let error = null
    let forms = []


    const load = async () => {
        loading = true

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
            if(Array.isArray(json) && json.length > 0){
                forms=json
            } else {
                error= "Erreur lors de la récupération des fomulaires, connexion expiré ?"
            }
        } else {
            error = "Erreur lors de la récupération des formulaires"
        }


        loading = false

    }

    load()
</script>



<main>
    <img src="/qrform.svg" width="200" alt="QRForm"/>
    <h2>Vos formulaires</h2>

    {#if loading}
        <h2>Chargement...</h2>
        <CircularProgress style="height: 24px; width: 24px;" indeterminate/>
    {/if}
    {#if error}
        <h2>{error}</h2>
    {/if}

    {#each forms as form}
        <FormItem form={form}/>
    {/each}
</main>


<style>
    main {
        min-height: 100vh;
    }

    h4 {
        color: #000;
    }

</style>
