<script>
    import Button, { Label, Icon } from '@smui/button'

    export let title
    export let backText = null
</script>


<img src="/qrform.svg" width="200" alt="QRForm"/>

{#if backText}
    <div class="back">
        <Button color="secondary" on:click={() => history.back()} touch
                variant="outlined">
            <Icon class="material-icons">arrow_back</Icon>
            <Label>{backText}</Label>
        </Button>

    </div>
{/if}
<h2>{title}</h2>


<style>
    .back {
        display: flex;
        flex-direction: row;
    }
</style>
