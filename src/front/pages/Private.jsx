import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { privateCheck } from "../services/backendServices"

export const Private = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    const [user, setUser] = useState(null)

    //esta declaracion de funcion hace la peticion al backend.
    const checkToken = async () => {
        const response = await privateCheck()
        if(response) {
            setUser(response)
            setLoading(false)
        }else{
            localStorage.removeItem("token") // nos asegura que no quede el token en response disponible        
            navigate("/")
        }
    }
    // PREGUNTA... aqui lo que en realidad conecta esta funcion con el backend, es data? ya que la pagina siempre tiene una data disponible? 

    useEffect(()=>{
        if(!localStorage.getItem("token")){
            setTimeout( ()=>{
                navigate("/")
            }, 100)
        }else{
           checkToken() //este llamado a funcion se encarga de ejecutar la peticion al backend. |LINEA 11|
        }
    },[])

    return(
        <>
            {loading ? (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <h1>This is your private page</h1>
            )}
        </>
    )
}