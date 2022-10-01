<script>
    import Textfield from '@smui/textfield'
    import HelperText from '@smui/textfield/helper-text'
    import Icon from '@smui/textfield/icon'
    import Button, { Label } from '@smui/button'
    import CircularProgress from '@smui/circular-progress'

    const STATUS = {
        LOADING: 0,
        LOADED: 1,
        LOAD_ERROR: 2,
        SENDING: 3,
        SENT_SUCCESS: 4,
        SENT_ERROR: 5,
    }

    const FIELD_FILE_ANY = 1
    const FIELD_EMAIL = 3
    const FIELD_TEXT = 5

    const FIELD_FILE = [FIELD_FILE_ANY]

    export let id
    let status = STATUS.LOADING
    let error = null
    let fields = []
    let title
    let values = {}

    const API_URL = import.meta.env.VITE_API_URL
    const SUBMIT_URL = import.meta.env.VITE_SUBMIT_URL

    const getForm = async () => {
        error = null
        status = STATUS.LOADING
        const response = await fetch(`${API_URL}items/form/?fields=fields.*,title,form_type.*&filter[uuid][_eq]=${id}`)
        if (response.ok) {
            status = STATUS.LOADED
        } else {
            status = STATUS.LOAD_ERROR
            error = "Erreur lors de la récupération du formulaire"
            return
        }
        const responseJson = JSON.parse(await response.text()).data[0]
        fields = responseJson.fields
        title = responseJson.title

        fields.sort((a, b) => a.order - b.order).forEach(field => values[field.id] = null)
        status = STATUS.LOADED
    }

    const onSubmit = async (event) => {
        error = null
        status = STATUS.SENDING
        event.preventDefault()

        const formData = new FormData()
        fields.forEach((field) => {
            if (FIELD_FILE.includes(field.field_id) && values[field.id]) {
                if (values[field.id]) {
                    formData.append(`${field.id}`, values[field.id][0])
                }
            } else if (values[field.id]) {
                formData.append(field.id, values[field.id])
            }
        })
        formData.append('formId', id)

        try {
            const response = await fetch(SUBMIT_URL, {
                method: 'POST',
                body: formData
            })
            const responseText = await response.text()
            if (response.ok) {
                status = STATUS.SENT_SUCCESS
            } else {
                error = "Erreur lors de l'envoie du formulaire: <br/>" + responseText
                status = STATUS.SENT_ERROR
            }
        } catch (catchedError) {
            error = "Erreur lors de l'envoie du formulaire"
            status = STATUS.SENT_ERROR
        }
    }

    getForm().catch(() => {
        status = STATUS.LOAD_ERROR
        error = "Erreur lors de la récupération du formulaire"
    })
</script>


<main>
    <h1>{(status !== STATUS.LOADING && status !== STATUS.LOAD_ERROR) ? title : status === STATUS.LOAD_ERROR ? error : "Chargement..."}</h1>

    <form action="{SUBMIT_URL}" method="post">
        {#each fields as field}
            {#if field.field_id === FIELD_EMAIL}
                <Textfield variant="filled" bind:value={values[field.id]} label="{field.label}" type="email"
                           style="width: 100%;"
                           helperLine$style="width: 100%;"
                >
                    <Icon class="material-icons" slot="leadingIcon">email</Icon>
                    <HelperText slot="helper">Saissisez votre email</HelperText>
                </Textfield>
            {:else if field.field_id === FIELD_TEXT}
                <Textfield variant="filled" bind:value={values[field.id]} label="{field.label}" type="text"
                           style="width: 100%;"
                           helperLine$style="width: 100%;"
                >
                    <Icon class="material-icons" slot="leadingIcon">abc</Icon>
                    <HelperText slot="helper">Text libre</HelperText>
                </Textfield>
            {:else if field.field_id === FIELD_FILE_ANY}
                <div class="hide-file-ui">
                    <Textfield variant="filled" bind:files={values[field.id]} label="{field.label}" type="file"
                               style="width: 100%;"
                               helperLine$style="width: 100%;"

                    >
                        <Icon class="material-icons" slot="leadingIcon">attachment</Icon>
                    </Textfield>
                </div>
            {/if}
            <br/>
        {/each}

        <br/>

        {#if status === STATUS.SENT_ERROR}
            <h2>{@html error}</h2>
        {/if}

        {#if (fields.length && status !== STATUS.SENT_SUCCESS)}
            <Button color="secondary" disabled="{status === STATUS.SENDING}" on:click={onSubmit} touch type="submit"
                    variant="outlined">
                <Label>{status === STATUS.SENDING ? "Envoie en cours" : "Envoyer"}</Label>
                {#if status === STATUS.SENDING}
                    <CircularProgress style="height: 24px; width: 24px;" indeterminate/>
                {/if}
            </Button>
        {:else if status === STATUS.SENT_SUCCESS}
            <h2>Formulaire envoyé 🎉</h2>
            <Button color="secondary" on:click={() => location.reload()} touch>
                <Label>Re-remplir</Label>
            </Button>
        {/if}
    </form>
</main>

<style>
    main {
        min-height: 100%;
    }

    .hide-file-ui {
        margin-bottom: 24px;
    }

    .hide-file-ui :global(input[type='file']::file-selector-button) {
        display: none;
    }

    .hide-file-ui :global(:not(.mdc-text-field--label-floating) input[type='file']) {
        color: transparent;
    }

    form :global(.mdc-button) {
        width: 100%;
    }
</style>
