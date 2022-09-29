<!-- App.svelte -->
<script>
    import { Router, Route } from "svelte-routing"
    import Home from './lib/Home.svelte'
    import FormScreen from './form/Form.svelte'

    export let url = ""
</script>


<Router url="{url}">
    <div>
        <Route path="f/:id" let:params component="{FormScreen}"/>
        <Route path="/">
            <Home/>
        </Route>
    </div>
</Router>
