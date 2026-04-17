import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../services/backendServices.js";

export const Register = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!user.email || !user.password) {
            alert("Missing Fields")
            return
        }
        // ahora nos toca llamar/conectar a el backend -> importando de esta manera
        register(user, navigate) // esta es nuestra funcion de register_user en routes.py
    }

    return (
        <div className="container mt-5">
            <h1>Please register your account!</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="text"
                        name="email"
                        className="form-control"
                        placeholder="Enter your Email"
                        value={user.email}
                        onChange={handleChange}
                    />

                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="text"
                        name="password"
                        className="form-control"
                        placeholder="Enter your Password"
                        value={user.password}
                        onChange={handleChange}
                    />

                </div>
                <div className="container d-flex justify-content-center gap-4">
                    <button className="btn btn-success">Create Account</button>
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    )
}