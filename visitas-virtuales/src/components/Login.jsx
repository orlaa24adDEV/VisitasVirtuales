import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import '@/assets/Login.css';
import { useAuth } from '@/hooks/useAuth.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
	const [errors, setErrors] = useState([]);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const { login, fetchProfile } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const rememberedEmail = localStorage.getItem('rememberedEmail');
		if (rememberedEmail) {
			setEmail(rememberedEmail);
			setRememberMe(true);
		}
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		setErrors([]);
		const formData = new FormData(event.currentTarget);
		const emailValue = formData.get('email')?.toString().trim() ?? '';
		const passwordValue = formData.get('password')?.toString() ?? '';
		const payload = JSON.stringify({ email: emailValue, password: passwordValue });

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

			if (rememberMe) {
				localStorage.setItem('rememberedEmail', emailValue);
			} else {
				localStorage.removeItem('rememberedEmail');
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
				<form onSubmit={handleSubmit}>
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
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						autoComplete="username"
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
					<div className="form-group remember-group">
				<label className="remember-label">
					<input
						type="checkbox"
						checked={rememberMe}
						onChange={(event) => setRememberMe(event.target.checked)}
						disabled={isLoading}
					/>
					<span>Recordar correo</span>
				</label>
			</div>
			<button type='submit' disabled={isLoading} className="submit-button">
						{isLoading ? 'Cargando...' : 'Iniciar Sesión'}
					</button>
					{/* <p>
						¿Aún no tienes cuenta?
						<Link to="/register" className="create-account-link">
							Regístrate aquí
						</Link>
					</p> */}
				</form>
			</section>
		</main>
	);
}
