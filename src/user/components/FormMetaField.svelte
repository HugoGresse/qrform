<script>
    import Textfield from '@smui/textfield'
    import HelperText from '@smui/textfield/helper-text'

    export let value
    export let label
    export let type = "email"
    export let helperText = null
    export let required = false
    export let disabled = false
    export let icon = "email"

</script>

<Textfield variant="filled" bind:value={value} label="{label + (required?' (requis)' : '')}" type={type}
           disabled="{disabled}"
           style="flex: 1; min-width: 200px;"
           helperLine$style="width: 100%;"
>
    {#if helperText}
        <HelperText slot="helper">{helperText}</HelperText>
    {/if}
</Textfield>


<style>
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
