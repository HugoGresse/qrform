<script>
    import CircularProgress from '@smui/circular-progress'
    import FormItem from './components/FormItem.svelte'
    import { loadFormsAction, userForms } from './core/formStore.js'
    import UserHeader from './components/UserHeader.svelte'

    let loading = false
    let error = null
    let forms = []

    userForms.subscribe(value => {
        forms = value
    })

    const load = async () => {
        loading = true
        const results = await loadFormsAction()
        error = results.error
        loading = false
    }

    load()
</script>

<main>
    <UserHeader title="Vos formulaires"/>

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
