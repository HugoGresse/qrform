
export const FIELD_FILE_ANY = 1
export const FIELD_CAMERA = 2
export const FIELD_EMAIL = 3
export const FIELD_DOB = 4
export const FIELD_TEXT = 5
export const FIELD_CHECKBOX = 6

export const FIELD_FILE = [FIELD_FILE_ANY, FIELD_CAMERA]

export const FIELDS = [
    {
        name: "Camera",
        value: FIELD_CAMERA,
        desc: null
    },{
        name: "Email",
        value: FIELD_EMAIL,
        desc: "Saissisez votre email"
    },{
        name: "Date de naissance",
        value: FIELD_DOB,
        desc: "Date de naissance"
    },{
        name: "Texte",
        value: FIELD_TEXT,
        desc: "Texte libre"
    },{
        name: "Case à cocher",
        value: FIELD_CHECKBOX,
        desc: null
    },{
        name: "Fichier",
        value: FIELD_FILE_ANY,
        desc: null
    }
]

export const getFieldDescs = (type) => {
    return FIELDS.find(f => f.value === type).desc
}
