<script>
    import Select, { Option } from '@smui/select'
    import { FIELDS } from '../../form/FieldTypes.js'

    export let value
    export let label

    const options = FIELDS
</script>

<Select bind:value={value} label={label} variant="filled"
        key={(num) => String(num)}
        style="margin-right: 12px;">
    {#each options as option}
        <Option value={option.value}>{option.name}</Option>
    {/each}
</Select>
