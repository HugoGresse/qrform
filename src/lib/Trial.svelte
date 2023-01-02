<script>
    import UserHeader from '../user/components/UserHeader.svelte'
    import Textfield from '@smui/textfield'
    import Icon from '@smui/textfield/icon'
    import HelperText from '@smui/textfield/helper-text'
    import Button, { Label } from '@smui/button'
    import { STATUS } from '../utils/Status.js'
    import CircularProgress from '@smui/circular-progress'
    import { validateEmail } from '../utils/validateEmail.js'

    let email = ""
    let status = null
    let error = null
    $: validEmail = validateEmail(email)
    let formUuid

    const url = import.meta.env.VITE_TRIAL_URL

    const onSubmit = async () => {
        status = STATUS.SENDING

        try {
            const response = await fetch(`${url}?email=${email}`)
            const json = await response.json()

            console.log(json)
            if (Array.isArray(json) && json[0].uuid) {
                status = STATUS.SENT_SUCCESS
                formUuid = json[0].uuid
            } else {
                status = STATUS.SENT_ERROR
                error = json.error
            }
        } catch (err) {
            status = STATUS.SENT_ERROR
            error = err.toString()
        }
    }
</script>


<main>
    <UserHeader title="Créer un formulaire"/>

    <p>
        Créer votre premier formulaire gratuitement, vous serez limité à 20 envois de documents.
        Si vous souhaitez poursuivre l utilisation de votre formulaire, vous devrez souscrire à <a
        href="https://qrform.fr/#pricing">une offre ici</a>.
    </p>

    {#if status !== STATUS.SENT_SUCCESS}
        <Textfield variant="filled" bind:value={email} label="Email" type="email"
                   style="width: 100%;"
                   input$autocomplete="email"
                   helperLine$style="width: 100%;"
                   invalid={!validEmail}
        >
            <Icon class="material-icons" slot="leadingIcon">email</Icon>
            <HelperText slot="helper">
                Saississez l'email de destination du formulaire
            </HelperText>
        </Textfield>
        {#if !validEmail && email.length > 3}
            <p class="fieldError">Email invalide</p>
        {/if}

        <Button color="secondary" disabled="{status === STATUS.SENDING || !validEmail}" on:click={onSubmit} touch type="submit"
                variant="outlined">
            <Label>{status === STATUS.SENDING ? "Création..." : "Créer le formulaire"}</Label>
            {#if status === STATUS.SENDING}
                <CircularProgress style="height: 24px; width: 24px;" indeterminate/>
            {/if}
        </Button>
    {/if}

    {#if status === STATUS.SENT_ERROR}
        <h4>{error}</h4>
    {/if}

    {#if status === STATUS.SENT_SUCCESS}
        <h4>Formulaire créé 🚀</h4>
        <div class="vertical">
            <Button color="secondary" touch
                    variant="outlined"
                    target="_blank" href="https://qrform.fr/f/{formUuid}">
                <Icon class="material-icons">open_in_new</Icon>
                <Label>Voir le formulaire</Label>
            </Button>
            <!--            <code>https://qrform.fr/f/{formUuid}</code>-->
            <Button color="secondary" touch
                    variant="outlined"
                    target="_blank" href="https://qrform.fr/qrcode/{formUuid}">
                <Icon class="material-icons">qr_code_2</Icon>
                <Label>QR Code</Label>
            </Button>
        </div>
    {/if}

</main>


<style>
    main {
        min-height: 100vh;
        min-width: 300px;
    }

    p, h4, code {
        color: #000;
    }

    .fieldError {
        color: #E11;
        text-align: left;
        margin: 0;
    }

    .vertical {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: center;
    }
</style>
