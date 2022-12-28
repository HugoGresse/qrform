<script>
    import Button, { Label } from '@smui/button'
    import CircularProgress from '@smui/circular-progress'

    export let id
    let loadingFormData = false
    let formTitle = null
    let loadingQRCode = false
    let qrCode = null
    let error = null

    const loadForm = async () => {
        loadingFormData = true
        const API_URL = import.meta.env.VITE_API_URL
        const response = await fetch(`${API_URL}items/form/?fields=title&filter[uuid][_eq]=${id}`)
        if (response.ok) {
            formTitle = JSON.parse(await response.text()).data[0].title
        } else {
            error = "Erreur lors de la récupération du formulaire"
        }
        loadingFormData = false
    }

    const loadQRCode = async () => {
        loadingQRCode = true

        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'qrcode3.p.rapidapi.com'
            },
            body: `{"data":"https://qrform.fr/f/${id}","style":{"module":{"color":"black","shape":"horizontal_lines"},"inner_eye":{"shape":"lightround"},"outer_eye":{"shape":"lightround", "color":"#018786"},"background":{}},"size":{"width":300,"quiet_zone":2,"error_correction":"M"},"output":{"filename":"qrcode","format":"png"}}`
        }

        fetch('https://qrcode3.p.rapidapi.com/qrcode/text', options)
            .then(response => response.blob())
            .then(response => {
                loadingQRCode = false
                qrCode = URL.createObjectURL(response)
            })
            .catch(err => {
                loadingQRCode = false
                error = "Failed to generate QRCode"
            })
    }

    const print = () => {
        const prtContent = document.getElementById("print")
        const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0')
        windowPrint.document.write(prtContent.innerHTML)
        windowPrint.document.close()
        windowPrint.focus()
        windowPrint.print()
        windowPrint.close()
    }

    loadForm()
</script>

<main>
    {#if !formTitle}
        <h1>Chargement...</h1>
    {/if}
    {#if error}
        <h1>{error}</h1>
    {/if}

    {#if qrCode}
        <div id="print">
            <div
                style="width:100%;text-align: center; margin:0 auto; font-family: sans-serif; justify-content: center; align-items: center; align-content: center; display: flex; flex-direction: column;">
                <h1 style="width:100%;text-align: center; margin:0 auto; font-family: sans-serif;">{formTitle}</h1>
                <br/>
                <img src="{qrCode}" width="300" height="300" alt="QRCode"/>
                <img src="https://qrform.fr/qrform.svg" width="130"/>
            </div>
        </div>
        <Button color="secondary" on:click={print} touch type="submit"
                variant="outlined">
            <Label>Imprimer</Label>
        </Button>
    {:else}
        <h1>{formTitle}</h1>
    {/if}

    <br/>
    <Button color="secondary" disabled="{loadingQRCode}" on:click={loadQRCode} touch type="submit"
            variant="outlined">
        <Label>Générer le QR Code</Label>
        {#if loadingQRCode}
            <CircularProgress style="height: 24px; width: 24px;" indeterminate/>
        {/if}
    </Button>
    <br/>
    <Button color="secondary" href="/f/{id}" touch type="submit"
    >
        <Label>Afficher le formulaire</Label>
    </Button>
</main>

<style>
    main {
        min-height: 100%;
    }
</style>
