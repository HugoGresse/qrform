<script>
    import Textfield from '@smui/textfield'
    import HelperText from '@smui/textfield/helper-text'
    import Checkbox from '@smui/checkbox'
    import FormField from '@smui/form-field'
    import Icon from '@smui/textfield/icon'
    import Button, { Label } from '@smui/button'
    import CircularProgress from '@smui/circular-progress'
    import { STATUS } from '../utils/Status.js'
    import {
        FIELD_CAMERA,
        FIELD_CHECKBOX,
        FIELD_DOB,
        FIELD_EMAIL,
        FIELD_FILE,
        FIELD_FILE_ANY,
        FIELD_TEXT, getFieldDescs
    } from './FieldTypes.js'

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
        const response = await fetch(`${API_URL}items/form/?fields=status,fields.*,title,form_type.*&filter[uuid][_eq]=${id}`)
        if (response.ok) {
            status = STATUS.LOADED
        } else {
            status = STATUS.LOAD_ERROR
            error = "Erreur lors de la récupération du formulaire"
            return
        }
        const responseJson = JSON.parse(await response.text()).data[0]

        if(responseJson.status === "disabled") {
            error = "Formulaire désactivé. Contactez l'équipe QRForm pour le réactiver."
            status = STATUS.LOAD_ERROR
            return
        }

        fields = responseJson.fields
        title = responseJson.title

        fields.sort((a, b) => a.order - b.order).forEach(field => {
            if(field.field_id === FIELD_CHECKBOX) {
                values[field.id] = false
            } else {
                values[field.id] = null
            }
        })
        status = STATUS.LOADED
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        error = null
        status = STATUS.SENDING

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
                <Textfield variant="filled" bind:value={values[field.id]} label="{field.label + (field.required?' (requis)' : '')}" type="email"
                           style="width: 100%;"
                           helperLine$style="width: 100%;"
                >
                    <Icon class="material-icons" slot="leadingIcon">email</Icon>
                    <HelperText slot="helper">{getFieldDescs(field.field_id)}</HelperText>
                </Textfield>
            {:else if field.field_id === FIELD_TEXT}
                <Textfield variant="filled" bind:value={values[field.id]} label="{field.label + (field.required?' (requis)' : '')}" type="text"
                           style="width: 100%;"
                           helperLine$style="width: 100%;"
                >
                    <Icon class="material-icons" slot="leadingIcon">abc</Icon>
                    <HelperText slot="helper">{getFieldDescs(field.field_id)}</HelperText>
                </Textfield>
            {:else if field.field_id === FIELD_DOB}
                <Textfield variant="filled" bind:value={values[field.id]} label="{field.label + (field.required?' (requis)' : '')}" type="date"
                           style="width: 100%;"
                           helperLine$style="width: 100%;"
                >
                    <Icon class="material-icons" slot="leadingIcon">event</Icon>
                    <HelperText slot="helper">{getFieldDescs(field.field_id)}</HelperText>
                </Textfield>
            {:else if field.field_id === FIELD_CHECKBOX}
                <FormField  align="end">
                    <span slot="label">{field.label + (field.required?' (requis)' : '')}</span>
                    <Checkbox bind:checked={values[field.id]} touch/>
                </FormField>
            {:else if field.field_id === FIELD_CAMERA}
                <div class="hide-file-ui">
                    <Textfield variant="filled"
                               bind:files={values[field.id]}
                               label="{field.label + (field.required?' (requis)' : '')}"
                               type="file"
                               input$accept="image/*"
                               input$capture
                               style="width: 100%;"
                               helperLine$style="width: 100%;"

                    >
                        <Icon class="material-icons" slot="leadingIcon">add_a_photo</Icon>
                    </Textfield>
                </div>
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
            <Button color="secondary" on:click={(event) => {
                event.preventDefault()
                location.reload()
            }} touch>
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
