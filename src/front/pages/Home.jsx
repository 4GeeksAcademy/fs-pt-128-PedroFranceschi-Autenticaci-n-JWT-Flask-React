import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { login } from "../services/backendServices.js";
import { useNavigate } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
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
		login(user, navigate) // esta es nuestra funcion de login en routes.py
	}
	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL
			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })
			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}
	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (

		<div className="container mt-5">
			<h1>Welcome!</h1>

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
				<button type="submit" className="btn btn-primary w-100">Login</button>
				{/* boton para registrar */}
			</form>

		</div>
	);
}; 