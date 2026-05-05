import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import '@/assets/Login.css';
import { useAuth } from '@/hooks/useAuth.js';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
	const [errors, setErrors] = useState([]);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState(
		localStorage.getItem('rememberedEmail') || '',
	);
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const origin = location.state?.from;

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (rememberMe && email) {
			localStorage.setItem('rememberedEmail', email);
		} else {
			localStorage.removeItem('rememberedEmail');
		}
		setIsLoading(true);
		setErrors([]);
		const formData = new FormData(event.currentTarget);
		const emailValue = formData.get('email')?.toString().trim() ?? '';
		const passwordValue = formData.get('password')?.toString() ?? '';
		const payload = JSON.stringify({
			email: emailValue,
			password: passwordValue,
		});

		try {
			// Autenticar usuario y obtener token de acceso
			const response = await fetch('/api/users/auth', {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
				},
				body: payload,
			});

			let responseData = null;
			try {
				responseData = await response.json();
			} catch {
				responseData = {};
			}

			const { details, accessToken, message } = responseData;

			if (!response.ok) {
				//Antes solo añadía details al error, ahora también el mensaje general
				setIsLoading(false);
				if (details && Array.isArray(details) && details.length > 0) {
					const errorMessages = details.map((item) => {
						const text = item?.message || item?.msg || 'Error desconocido';
						return text.charAt(0).toUpperCase() + text.slice(1);
					});
					setErrors(errorMessages);
					return;
				}

				if (typeof message === 'string' && message.trim()) {
					setErrors([message.trim()]);
					return;
				}

				setErrors(['Error desconocido al iniciar sesión']);
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
			// Redirigir a la ruta de origen o a la selección de centros si no hay origen
			if (origin && origin !== '/login' && origin !== '/') {
				navigate(origin, { replace: true });
			} else {
				navigate('/centros', { replace: true });
			}
		} catch (error) {
			console.error('Error al iniciar sesión:', error);
			setIsLoading(false);
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
									{errors.map((err, idx) => (
										<li key={idx}>{err}</li>
									))}
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
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								disabled={isLoading}
								required
							/>
							<span
								className="password-toggle"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeSlashIcon className="icon" />
								) : (
									<EyeIcon className="icon" />
								)}
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
					<button type="submit" disabled={isLoading} className="submit-button">
						{isLoading ? 'Cargando...' : 'Iniciar Sesión'}
					</button>
				</form>
			</section>
		</main>
	);
}
