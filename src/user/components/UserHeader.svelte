<script>
    import Button, { Label, Icon } from '@smui/button'

    export let title
    export let backText = null
    export let forwardLink = null
    export let forwardText = null
    export let forwardIcon = "open_in_new"
</script>


<img src="/qrform.svg" width="200" alt="QRForm"/>

{#if (backText || forwardText)}
    <div class="back">

        {#if backText}
            <Button color="secondary" on:click={() => history.back()} touch
                    variant="outlined">
                <Icon class="material-icons">arrow_back</Icon>
                <Label>{backText}</Label>
            </Button>
        {/if}
        {#if forwardText}
            <Button color="secondary" touch
                    variant="outlined"
                    target="_blank" href={forwardLink}>
                <Icon class="material-icons">{forwardIcon}</Icon>
                <Label>{forwardText}</Label>
            </Button>
        {/if}

    </div>
{/if}
<h2>{title}</h2>


<style>
    .back {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>
