import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import '@/assets/Login.css';
import { useAuth } from '@/hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

function Login() {
	const [email, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});
	const [isCreateMode, setIsCreateMode] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		try {
			// Peticion a la API
			const response = await fetch('/api/users/auth', {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: email, password: password }),
			});
			const data = await response.json();
			console.log('Respuesta del servidor:', data);

			if (!response.ok) {
				// Mostrar errores de validación del backend si existen
				if (data.details && Array.isArray(data.details)) {
					const errorMessages = data.details.map(d => `${d.field}: ${d.message}`).join(' | ');
					setErrors({ auth: errorMessages });
				} else {
					setErrors({ auth: data.message || 'Error al iniciar sesión' });
				}
				return;
			}

			const token = data.accessToken;
			const userData = {
				email: email,
				username: email.split('@')[0],
				role: email.includes('admin') ? 'admin' :
					email.includes('profesor') ? 'teacher' : 'student'
			};

			console.log(`Login exitoso (${userData.username}) - ${new Date().toLocaleString('es-ES')}`);

			login(userData, token);
			navigate('/home');

		} catch (error) {
			console.error('Error al iniciar sesión:', error);
			setErrors({ auth: error.message });
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmailChange = (e) => {
        setUsername(e.target.value);
    };

	const handlePasswordChange = (e) => {
		const value = e.target.value;
		setPassword(value);
		// Limpiar error cuando el usuario empieza a escribir
		if (errors.password) {
			setErrors({ ...errors, password: null });
		}
	};

	const handleCreateAccount = (e) => {
		e.preventDefault();
		navigate('/register');
	};

	const handlePeek = () => {
		setShowPassword(!showPassword);
	};

	return (
		<main className="main-content">
			<section className="login-section">
				<h2>{isCreateMode ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
				<form onSubmit={handleSubmit}>
					{errors.auth && <div className="error-message">{errors.auth}</div>}
					<div className="form-group">
						<input
							type="text"
							id="email"
							value={email}
							onChange={handleEmailChange}
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
								value={password}
								onChange={handlePasswordChange}
								placeholder="Contraseña"
								disabled={isLoading}
								required
							/>
							<span className="password-toggle" onClick={handlePeek}>
								{showPassword ?
									<EyeSlashIcon className="icon" />
								:	<EyeIcon className="icon" />}
							</span>
						</div>
					</div>
					<button type='submit' disabled={isLoading} className="submit-button">
						{isLoading ? 'Cargando...' : (isCreateMode ? 'Crear Cuenta' : 'Login')}
					</button>

					{!isCreateMode && (
						<p>
							¿Aún no tienes cuenta?
							<a href="#" onClick={handleCreateAccount}>
								Crear cuenta.
							</a>
						</p>
					)}

				</form>
			</section>
		</main>
	);

}


export default Login;
