<script>
    import Icon from '@smui/textfield/icon'
    import { Link } from 'svelte-routing'

    export let form
</script>


<Link to="/user/forms/{form.uuid}">
    <button class="container"
            style="border-color: {false ? '#008A87': 'transparent'}">
        <div class="left">
            <h4>{form.title}</h4>
            <span>Destination: {form.email_to}</span>
            <span>Titre de l'email: {form.email_title}</span>
        </div>

        <Icon class="material-icons" slot="chevron-right">chevron_right</Icon>
    </button>

</Link>

<style>
    .container {
        border-radius: 4px;
        background-color: #e0e0e0;
        color: #000;
        display: flex;
        flex-direction: row;
    }

    .container:hover {
        border-radius: 4px;
        filter: brightness(0.8);

    }

    .left {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .left span {
        color: #666;
    }

    h4 {
        margin: 0;
    }

</style>
