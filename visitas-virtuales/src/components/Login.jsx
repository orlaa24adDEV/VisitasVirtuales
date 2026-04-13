import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import '@/assets/Login.css';
import { useAuth } from '@/hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	
	const handleSubmit = (e) => {
		e.preventDefault();

		let role = 'invitado'; // Rol por defecto.
		const lowerUsername = username.toLowerCase();
		if (lowerUsername.includes('admin')) {
			role = 'admin';
		} else if (lowerUsername.includes('profesor')) {
			role = 'teacher';
		}

		const userData = {
			id: Math.floor(Math.random() * 1000) + 1,
			username,
			role,
			password,
			name: username.split(' ')[0] || username,
		};

		const timestamp = new Date().toLocaleString('es-ES');

		login(userData); // Guardar el usuario en el contexto global
		if (role === 'admin' || role === 'teacher') {
			navigate('/dashboard');
		} else {
			navigate('/home');
		}

		alert(`Login exitoso - ${timestamp}\nBienvenido, ${userData.role} (${userData.name})`);

		// Limpiar el formulario
		setUsername('');
		setPassword('');
		setErrors({});
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
				<h2>Iniciar Sesión</h2>
				<form onSubmit={handleSubmit} action="#" method="post">
					<div className="form-group">
						<input
							type="text"
							id="username"
							value={username}
							onChange={handleUsernameChange}
							placeholder="Usuario"
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
							/>
							<span className="password-toggle" onClick={handlePeek}>
								{showPassword ?
									<EyeSlashIcon className="icon" />
								:	<EyeIcon className="icon" />}
							</span>
						</div>
						{errors.password && (
							<span className="error-message">{errors.password}</span>
						)}
					</div>
						<p>
							¿Aún no tienes cuenta?
							<a href="#" onClick={handleCreateAccount}>
								Crear cuenta.
							</a>
						</p>

					<button type="submit">
						Login
					</button>
				</form>
			</section>
		</main>
	);

}


export default Login;
