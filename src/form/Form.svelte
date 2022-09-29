<script>
    import Textfield from '@smui/textfield'
    import HelperText from '@smui/textfield/helper-text'
    import Icon from '@smui/textfield/icon'
    import Button, { Label } from '@smui/button'

    const FIELD_FILE_ANY = 1
    const FIELD_EMAIL = 3
    const FIELD_TEXT = 5

    export let id
    let fields = []
    let title
    let values = {}

    const API_URL = import.meta.env.VITE_API_URL
    const SUBMIT_URL = import.meta.env.VITE_SUBMIT_URL

    const getForm = async () => {
        const response = await fetch(`${API_URL}items/form/?fields=fields.*,title,form_type.*&filter[uuid][_eq]=${id}`)
        const responseJson = JSON.parse(await response.text()).data
        fields = responseJson.fields
        title = responseJson.title

        fields.sort((a, b) => a.order - b.order).forEach(field => values[field.id] = null)
    }

    const onSubmit = async (event) => {
        event.preventDefault()

        const formData = new FormData()
        fields.forEach((field) => {
                formData.append(field.id, values[field.id])
        })
        formData.append('user', 'hubot')

        const response = await fetch(SUBMIT_URL, {
            method: 'POST',
            body: formData
        })
        console.log(response)
    }

    getForm()
</script>


<main>
    <h1>{title || "Chargement..."}</h1>

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

        <Button color="secondary" on:click={onSubmit} touch type="submit" variant="outlined">
            <Label>Envoyer</Label>
        </Button>

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
