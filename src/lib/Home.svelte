<script>
    import { Link } from "svelte-routing"


    let contactId = import.meta.env.VITE_CONTACT_ID
</script>


<main>
    <p>
        QRForm.fr fournit une solution de formulaire pour les pharmaciens, en respect avec les données des patients,
        hébergé en France, sans suivit utilisateur.
    </p>

    <nav>
        <Link to="/f/{contactId}">Nous contacter</Link>
    </nav>
</main>


<style>
    p {
        color: #111;
        max-width: 400px;
    }
</style>
