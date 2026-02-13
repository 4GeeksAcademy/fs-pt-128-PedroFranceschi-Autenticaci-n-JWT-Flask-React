import { Navigate } from "react-router-dom"

export const login = async (user, navigate) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()
    if(!response.ok){
        alert(data.msg) 
        // data.ERROR esta relacionado a nuestro mensaje de las routes.py |jsonify({"error": "User already exist."}), 400|
        // tuve que cambiarlo a msg.. error me estaba devolvienco undefined.
        return
    }
    //cuando todo sale bien queremos guardar esa data en el local storage
    localStorage.setItem("token", data.token)
    navigate("/private")
}

// esta es la peticion para asegurarnos de que el token este validado
export const privateCheck = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    const data = response.json()
    if(!response.ok){
        return false
    }    
    return data
}