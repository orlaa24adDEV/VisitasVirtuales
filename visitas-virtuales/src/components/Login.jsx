import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import '@/assets/Login.css';
import { useAuth } from '@/hooks/useAuth.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
	const [errors, setErrors] = useState([]);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (formData) => {
		setIsLoading(true);
		setErrors([]);
		const payload = JSON.stringify(Object.fromEntries(formData));

		try {
			// Autenticar usuario y obtener token de acceso
			const response = await fetch('/api/users/auth', {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				},
				body: payload
			});

			const responseData = await response.json();
			const { details, accessToken } = responseData;

			if (!response.ok) {
				// Mostrar errores de validación del backend si existen
				if (details) {
					setIsLoading(false);
					const errorMessages = details.map((error) => {
						const message = error.message || 'Error desconocido';
						return message.charAt(0).toUpperCase() + message.slice(1);
					});
					setErrors(errorMessages);
				} else {
					setErrors(['Error desconocido al iniciar sesión']);
				}
				return;
			}
        
			if (!accessToken) {
				setIsLoading(false);
				setErrors(['No se recibió token de acceso']);
				return;
			}

			setIsLoading(false);
			await login(accessToken);
			navigate('/home');
		} catch (error) {
			console.error('Error al iniciar sesión:', error);
			setErrors(['Error de red al iniciar sesión']);
		}
	};

	return (
		<main className="main-content">
			<section className="login-section">
				<h2>Iniciar Sesión</h2>
				<form action={handleSubmit}>
						{errors && errors.length > 0 && (
							<div className="error-message">
								{errors.length === 1 ? (
									<span>{errors[0]}</span>
								) : (
									<ul>
										{errors.map((err, idx) => <li key={idx}>{err}</li>)}
									</ul>
								)}
							</div>
						)}
					<div className="form-group">
						<input
							type="text"
							name="email"
							id="email"
							placeholder="Correo electrónico"
							disabled={isLoading}
							required
						/>
					</div>
					<div className="form-group">
						<div className="password-container">
							<input
								type={showPassword ? 'text' : 'password'}
								id="password"
								name="password"
								placeholder="Contraseña"
								disabled={isLoading}
								required
							/>
							<span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
								{showPassword ?
									<EyeSlashIcon className="icon" />
								:	<EyeIcon className="icon" />}
							</span>
						</div>
					</div>
					<button type='submit' disabled={isLoading} className="submit-button">
						{isLoading ? 'Cargando...' : 'Iniciar Sesión'}
					</button>
					<p>
						¿Aún no tienes cuenta?
						<Link to="/register" className="create-account-link">
							Regístrate aquí
						</Link>
					</p>
				</form>
			</section>
		</main>
	);
}
