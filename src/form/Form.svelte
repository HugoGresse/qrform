<script>
    import Textfield from '@smui/textfield'
    import HelperText from '@smui/textfield/helper-text'

    export let id
    let fields = []
    let title
    let values = {}

    const API_URL = import.meta.env.VITE_API_URL

    const getForm = async () => {
        const response = await fetch(`${API_URL}items/form/${id}?fields=fields.*,title,form_type.*`)
        const responseJson = JSON.parse(await response.text())
        fields = responseJson.data.fields

        fields.forEach(field => values[field] = null)
    }

    getForm()


</script>


<main>

    {#each fields as field}
        <Textfield variant="filled" bind:value={values[field]} label="Label">
            <HelperText slot="helper">Helper Text</HelperText>
        </Textfield>
    {/each}


</main>
