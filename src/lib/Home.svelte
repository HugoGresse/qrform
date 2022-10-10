<script>
    import { Link } from "svelte-routing"

    let contactId = import.meta.env.VITE_CONTACT_ID
</script>


<main>
    <p>
        QRForm.fr fournit une solution de formulaire pour les pharmaciens, en respect avec les données des patients,
        hébergé en France, sans suivi utilisateur.
    </p>

    <nav>
        <Link to="/f/{contactId}" class="link">Nous contacter</Link>
        <Link to="/legal"  class="link">Mentions légales</Link>
    </nav>
</main>


<style>
    p {
        color: #111;
        max-width: 400px;
    }
    :global(.link) {
        margin: 10px;
    }
</style>
