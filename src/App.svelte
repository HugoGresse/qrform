<script>
    import { Router, Route } from "svelte-routing"
    import FormScreen from './form/Form.svelte'
    import QRCode from './lib/QRCode.svelte'
    import Legal from './lib/Legal.svelte'
    import Login from './user/Login.svelte'
    import UserEdit from './user/UserEdit.svelte'
    import FormEdit from './user/UserFormEdit.svelte'

    export let url = ""
</script>


<Router url="{url}">
    <div>
        <Route path="legal" component="{Legal}"/>
        <Route path="f/:id" let:params component="{FormScreen}"/>
        <Route path="qrcode/:id" let:params component="{QRCode}"/>
        <Route path="login" let:params component="{Login}"/>
        <Route path="user/forms" component="{UserEdit}"/>
        <Route path="user/forms/:id"  let:params  component="{FormEdit}"/>
    </div>
</Router>
