import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import '@/assets/Login.css';

function Login(props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});
	const [isCreateMode, setIsCreateMode] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	// Validación de username: 8+ caracteres, letras, números, símbolos
	const validateUsername = (value) => {
		if (!value) {
			return 'El usuario es requerido';
		}
		if (value.length < 8) {
			return 'El usuario debe tener al menos 8 caracteres';
		}
		// Verificar que contiene letras
		if (!/[a-zA-Z]/.test(value)) {
			return 'El usuario debe contener al menos una letra';
		}
		// Verificar que contiene números
		if (!/[0-9]/.test(value)) {
			return 'El usuario debe contener al menos un número';
		}
		// Verificar que contiene símbolos especiales
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
			return 'El usuario debe contener al menos un símbolo especial (!@#$%^&*...)';
		}
		return null;
	};

	// Validación de password: mayúscula, minúscula, número, símbolo
	const validatePassword = (value) => {
		if (!value) {
			return 'La contraseña es requerida';
		}
		if (!/[A-Z]/.test(value)) {
			return 'La contraseña debe contener al menos una mayúscula';
		}
		if (!/[a-z]/.test(value)) {
			return 'La contraseña debe contener al menos una minúscula';
		}
		if (!/[0-9]/.test(value)) {
			return 'La contraseña debe contener al menos un número';
		}
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
			return 'La contraseña debe contener al menos un símbolo especial (!@#$%^&*...)';
		}
		return null;
	};

	// Validar el formulario completo
	const validateForm = () => {
		const newErrors = {};

		const usernameError = validateUsername(username);
		if (usernameError) {
			newErrors.username = usernameError;
		}

		const passwordError = validatePassword(password);
		if (passwordError) {
			newErrors.password = passwordError;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		// Si la validación pasó, loguear en consola con timestamp
		const userData = {
			username: username,
			password: password,
		};

		const timestamp = new Date().toLocaleString('es-ES');

		if (isCreateMode) {
			console.log(`Cuenta creada exitosamente - ${timestamp}`);
			console.log('Datos del nuevo usuario:', userData);
		} else {
			console.log(`Login exitoso - ${timestamp}`);
			console.log('Datos del usuario:', userData);
		}

		// Enviar datos al componente padre
		props.handleLogin(userData);

		// Limpiar el formulario
		setUsername('');
		setPassword('');
		setErrors({});
	};

	const handleUsernameChange = (e) => {
		const value = e.target.value;
		setUsername(value);
		// Limpiar error cuando el usuario empieza a escribir
		if (errors.username) {
			setErrors({ ...errors, username: null });
		}
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
		// Limpiar errores y formulario
		setUsername('');
		setPassword('');
		setErrors({});
		// Cambiar a modo crear cuenta
		setIsCreateMode(true);
	};

	const handleBackToLogin = (e) => {
		e.preventDefault();
		// Limpiar errores y formulario
		setUsername('');
		setPassword('');
		setErrors({});
		// Volver a modo login
		setIsCreateMode(false);
	};
	const handlePeek = (e) => {
		setShowPassword(!showPassword);
	};

	return (
		<main className="main-content">
			<section className="login-section">
				<h2>{isCreateMode ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
				<form onSubmit={handleSubmit} action="#" method="post">
					<div className="form-group">
						<input
							type="text"
							id="username"
							value={username}
							onChange={handleUsernameChange}
							placeholder="Usuario"
						/>
						{errors.username && (
							<span className="error-message">{errors.username}</span>
						)}
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

					{!isCreateMode && (
						<p>
							¿Aún no tienes cuenta?
							<a href="#" onClick={handleCreateAccount}>
								Crear cuenta.
							</a>
						</p>
					)}

					{isCreateMode && (
						<p>
							¿Ya tienes cuenta?
							<a href="#" onClick={handleBackToLogin}>
								Inicia sesión.
							</a>
						</p>
					)}

					<button type="submit">
						{isCreateMode ? 'Crear Cuenta' : 'Login'}
					</button>
				</form>
			</section>
		</main>
	);
}

export default Login;
