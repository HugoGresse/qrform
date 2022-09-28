<!-- App.svelte -->
<script>
    import { Router, Route } from "svelte-routing"
    import Home from './lib/Home.svelte'
    import Form from './form/Form.svelte'

    export let url = ""
</script>


<Router url="{url}">
    <div>
        <Route path="f/:id" component="{Form}"/>
        <Route path="/">
            <Home/>
        </Route>
    </div>
</Router>
