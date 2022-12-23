<script>
    import { Router, Route } from "svelte-routing"
    import FormScreen from './form/Form.svelte'
    import QRCode from './lib/QRCode.svelte'
    import Legal from './lib/Legal.svelte'
    import Login from './lib/Login.svelte'
    import UserEdit from './lib/UserEdit.svelte'

    export let url = ""
</script>


<Router url="{url}">
    <div>
        <Route path="legal" component="{Legal}"/>
        <Route path="f/:id" let:params component="{FormScreen}"/>
        <Route path="qrcode/:id" let:params component="{QRCode}"/>
        <Route path="login" let:params component="{Login}"/>
        <Route path="user/forms" component="{UserEdit}"/>
    </div>
</Router>
