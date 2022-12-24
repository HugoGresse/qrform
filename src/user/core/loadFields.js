export const loadFieldsAction = async () => {
    const API_URL = import.meta.env.VITE_API_URL
    const response = await fetch(`${API_URL}items/field/?fields=*.*`)
    if (response.ok) {
        const json = await response.json()
        return {
            success: true,
            data: json.data
        }
    }
    return {
        success: false,
        error: "Erreur lors de la récupération des champs du formulaire"
    }
}
