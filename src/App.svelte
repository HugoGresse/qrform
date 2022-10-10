<script>
    import { Router, Route } from "svelte-routing"
    import Home from './lib/Home.svelte'
    import FormScreen from './form/Form.svelte'
    import QRCode from './lib/QRCode.svelte'
    import Legal from './lib/Legal.svelte'

    export let url = ""
</script>


<Router url="{url}">
    <div>
        <Route path="legal" component="{Legal}"/>
        <Route path="f/:id" let:params component="{FormScreen}"/>
        <Route path="qrcode/:id" let:params component="{QRCode}"/>
        <Route path="/">
            <Home/>
        </Route>
    </div>
</Router>
