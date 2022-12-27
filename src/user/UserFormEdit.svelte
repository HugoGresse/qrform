<script>
    import CircularProgress from '@smui/circular-progress'
    import { getUserForms, loadFormsAction, updateFormAction, userForms } from './core/formStore.js'
    import UserHeader from './components/UserHeader.svelte'
    import FormMetaField from './components/FormMetaField.svelte'
    import { FIELD_TEXT } from '../form/FieldTypes.js'
    import Button, { Label, Icon } from '@smui/button'
    import IconButton from '@smui/icon-button'
    import FieldTypeSelect from './components/FieldTypeSelect.svelte'
    import { dndzone } from 'svelte-dnd-action'
    import { flip } from 'svelte/animate'
    import FormField from '@smui/form-field'
    import Checkbox from '@smui/checkbox'

    export let id

    const flipDurationMs = 200
    let loading = false
    let error = null
    let form = null
    let initialForm = null

    $: hasChanged = form ? JSON.stringify(form) !== JSON.stringify(initialForm) : false

    userForms.subscribe(value => {
        form = value.find(f => f.uuid = id)
        if (form) {
            loading = false
            if (!initialForm) {
                initialForm = JSON.parse(JSON.stringify(form)) // deep clone..
            }
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
    }

    const addNewField = () => {
        if (!form.fields) {
            form.fields = []
        }
        form.fields = [...form.fields, {
            id: "new-" + Date.now(),
            field_id: FIELD_TEXT,
            form_id: form.id,
            label: "Nom du champ",
            order: form.fields[form.fields.length - 1]?.order + 1 || 1,
            required: false
        }]
    }

    const removeField = (formFieldId) => {
        form.fields = form.fields.filter(f => f.id !== formFieldId)
    }

    const handleSort = (e) => {
        form.fields = e.detail.items
    }

    const save = async(form) => {
        loading = true
        const results = await updateFormAction(form)
        // TODO : error
        loading = false
    }

    // TODO : update order when saving on frontend

    load()
</script>


<main>
    <UserHeader title="Modification du formulaire" backText="Liste des formulaires" forwardText="Voir le formulaire" forwardLink="https://qrform.fr/f/{id}"/>

    {#if loading}
        <CircularProgress style="height: 24px; width: 24px;" indeterminate/>
    {/if}
    {#if error}
        <h2>{error}</h2>
    {/if}

    {#if form}
        <div class="row bottomMargin">
            <FormMetaField
                label="Titre du formulaire"
                required="true"
                type="text"
                value="{form.title}"
                icon="title"
            />
        </div>

        <div class="row bottomMargin">
            <FormMetaField
                label="Sujet de l'email"
                required="true"
                type="text"
                value="{form.email_title}"
                icon="subject"
            />
        </div>

        <div class="row bottomMargin">
            <FormMetaField
                label="Destination de l'email"
                disabled="true"
                required="true"
                type="email"
                value="{form.email_to}"
                icon="contact_mail"
            />
        </div>

        <h4>Champs du formulaires :</h4>

        <section use:dndzone={{items: form.fields, flipDurationMs}} on:consider={handleSort} on:finalize={handleSort}>
            {#each form.fields as field(field.id)}
                <div animate:flip={{duration:flipDurationMs}}>
                    <div class="row">
                        <IconButton class="material-icons" disabled>
                            drag_handle
                        </IconButton>
                        <FieldTypeSelect
                            bind:value={field.field_id}
                            label="Type"
                        />
                        <FormMetaField
                            required="{field.required}"
                            label="Intitulé du champ"
                            bind:value={field.label}
                            type="{field.field_id}"
                        />
                        <IconButton
                            class="material-icons"
                            on:click={() => removeField(field.id)}
                            style="margin-left: 12px; color: #000; border: 1px solid #008A87;"
                        >delete
                        </IconButton>
                    </div>
                    <div class="subRow">
                        <FormField align="end">
                            <span slot="label">Champs requis :</span>
                            <Checkbox bind:checked={field.required} touch/>
                        </FormField>
                    </div>
                </div>
            {/each}
        </section>

        <div class="bottomRow">
            <Button color="secondary" on:click={addNewField} touch
                    variant="outlined">
                <Icon class="material-icons">add</Icon>
                <Label>Ajouter un champ</Label>
            </Button>

            <Button color="secondary" disabled={!hasChanged || loading} on:click={() => save(form)} touch
                    variant="raised">
                <Icon class="material-icons">save</Icon>
                <Label>Sauvegarder</Label>
            </Button>
        </div>
    {/if}
</main>

<style>
    main {
        min-height: 100vh;
        width: calc(100vw - 4rem);
        max-width: calc(1024px - 4rem);
    }

    p, h4 {
        color: #000
    }

    .row {
        display: flex;
        flex-wrap: wrap;
    }
    .row.bottomMargin {
        margin-bottom: 12px;
    }

    .subRow {
        margin-top: -12px;
    }

    .bottomRow {
        display: flex;
        justify-content: space-between;
    }

    section {
        transition: all 0.2s;
    }
</style>
