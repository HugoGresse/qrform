<script>
    import CircularProgress from '@smui/circular-progress'
    import { getUserForms, loadFormsAction, userForms } from './core/formStore.js'
    import UserHeader from './components/UserHeader.svelte'
    import FormMetaField from './components/FormMetaField.svelte'
    import { FIELD_TEXT, FIELDS, getFieldDescs } from '../form/FieldTypes.js'
    import Button, { Label, Icon } from '@smui/button'
    import IconButton from '@smui/icon-button';
    import FieldTypeSelect from './components/FieldTypeSelect.svelte'

    export let id

    const UPDATE_URL = import.meta.env.VITE_USER_FORM_UPDATE

    let loading = false
    let error = null
    let form = null
    let availableFields = []

    userForms.subscribe(value => {
        form = value.find(f => f.uuid = id)
        if (form) {
            console.log("form loaded", form)
            loading = false
        }
    })

    const load = async () => {
        const forms = getUserForms()
        if (forms.length === 0) {
            loading = true
            const results = await loadFormsAction()
            error = results.error
            loading = false
        }
        // Not needed for now
        // const fieldsResults = await loadFieldsAction()
        // if(fieldsResults.success) {
        //     availableFields = fieldsResults.data
        // }
    }

    const addNewField = () => {
        if (!form.fields) {
            form.fields = []
        }
        form.fields.push({
            field_id: FIELD_TEXT,
            form_id: form.id,
            label: "Nom du champ (TODO)",
            order: form.fields[form.fields.length - 1]?.order + 1 || 1,
            required: false
        })
    }

    const removeField = (formFieldId) => {

    }

    const changeFieldType = () => {

    }

    console.log(form)

    // TODO: édition des infos des champs + delete
    // TODO: reorder
    // TODO: new : ajout de form_field + update du form

    load()
</script>


<main>
    <UserHeader title="Modification du formulaire" backText="Liste des formulaires"/>

    {#if loading}
        <CircularProgress style="height: 24px; width: 24px;" indeterminate/>
    {/if}
    {#if error}
        <h2>{error}</h2>
    {/if}

    {#if form}
        <FormMetaField
            label="Titre du formulaire"
            required="true"
            type="text"
            value="{form.title}"
            icon="title"
        />

        <FormMetaField
            label="Sujet de l'email"
            required="true"
            type="text"
            value="{form.email_title}"
            icon="subject"
        />

        <FormMetaField
            label="Destination de l'email"
            disabled="true"
            required="true"
            type="email"
            value="{form.email_to}"
            icon="contact_mail"
        />

        <h4>Champs du formulaires :</h4>
        {#each form.fields as field}
            <div class="row">
                <FieldTypeSelect
                    value={field.field_id}
                    label="Type"
                    />
                <FormMetaField
                    required="{field.required}"
                    label="Intitulé du champ"
                    value={field.label || ""}
                    type="{field.field_id}"
                />
                <IconButton
                    class="material-icons"
                    on:click={() => removeField(field.id)}
                    style="margin-left: 12px; color: #000; border: 1px solid #008A87;"
                >delete</IconButton>
            </div>
        {/each}

        <div class="bottomRow">
            <Button color="secondary" on:click={addNewField} touch
                    variant="outlined">
                <Icon class="material-icons">add</Icon>
                <Label>Ajouter un champ</Label>
            </Button>

            <Button color="secondary" on:click={addNewField} touch
                    variant="outlined">
                <Icon class="material-icons">save</Icon>
                <Label>Sauvegarder</Label>
            </Button>

        </div>
    {/if}
</main>

<style>
    main {
        min-height: 100vh;
    }

    p, h4 {
        color: #000
    }

    .row {
        display: flex;
    }

    .bottomRow {
        display: flex;
        justify-content: space-between;
    }

</style>
