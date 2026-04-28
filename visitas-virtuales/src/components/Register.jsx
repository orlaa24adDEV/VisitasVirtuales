import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import '@/assets/Login.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

   const validateUsername = (value) => {
        if (!value) {
            return "El usuario es requerido";
        }
	}

    const validateName = (value) => {
        if (!value.trim()) {
            return 'El nombre es requerido';
        }
        return null;
    };

    const validateAge = (value) => {
        if (!value.trim()) {
            return 'La edad es requerida';
        }
        const numericAge = Number(value);
        if (!Number.isInteger(numericAge) || numericAge <= 0) {
            return 'Ingresa una edad válida';
        }
        return null;
    };
    const validateEmail = (value) => {
        if (!value.trim()) {
            return 'El correo es requerido';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Ingresa un correo válido';
        }
        return null;
    };

    const validatePhone = (value) => {
        if (!value.trim()) {
            return 'El teléfono es requerido';
        }
        const phoneRegex = /^[0-9]{7,15}$/;
        if (!phoneRegex.test(value)) {
            return 'Ingresa un teléfono válido de 7 a 15 dígitos';
        }
        return null;
    };

    const validatePassword = (value) => {
        if (!value) {
            return 'La contrasena es requerida';
        }
        if (!/[A-Z]/.test(value)) {
            return 'La contrasena debe contener al menos una mayuscula';
        }
        if (!/[0-9]/.test(value)) {
            return 'La contrasena debe contener al menos un numero';
        }
        return null;
    };

    const validateForm = () => {
        const newErrors = {};
		const usernameError = validateUsername(username);
        if (usernameError) newErrors.username = usernameError;
        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;
        const nameError = validateName(name);
        if (nameError) newErrors.name = nameError;
        const ageError = validateAge(age);
        if (ageError) newErrors.age = ageError;
        const emailError = validateEmail(email);
        if (emailError) newErrors.email = emailError;
        const phoneError = validatePhone(phone);
        if (phoneError) newErrors.phone = phoneError;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        console.log('Registro valido:', { username, password, name, age, email, phone });
        setUsername('');
        setPassword('');
        setName('');
        setAge('');
        setEmail('');
        setPhone('');
        setErrors({});
        navigate('/login');
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) setErrors({ ...errors, password: null });
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        if (errors.name) setErrors({ ...errors, name: null });
    };

    const handleAgeChange = (e) => {
        setAge(e.target.value);
        if (errors.age) setErrors({ ...errors, age: null });
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) setErrors({ ...errors, email: null });
    };

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
        if (errors.phone) setErrors({ ...errors, phone: null });
    };

    const handleBackToLogin = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    const handlePeek = () => {
        setShowPassword(!showPassword);
    };

    return (
        <main className='main-content'>
            <section className='login-section'>
                <h2>Crear Cuenta</h2>
                <form onSubmit={handleSubmit} action='#' method='post'>
                    
                <div>
                    <div className='form-group'>
                        <input
                            type='text'
                            id='name'
                            value={name}
                            onChange={handleNameChange}
                            placeholder='Nombre Completo'
                        />
                        {errors.name && <span className='error-message'>{errors.name}</span>}
                    </div>

                    <div className='form-group'>
                        <input
                            type='number'
                            id='edad'
                            value={age}
                            onChange={handleAgeChange}
                            placeholder='Edad'
                        />
                        {errors.age && <span className='error-message'>{errors.age}</span>}
                    </div>

                    <div className='form-group'>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            onChange={handleEmailChange}
                            placeholder='Correo'
                        />
                        {errors.email && <span className='error-message'>{errors.email}</span>}
                    </div>

                    <div className='form-group'>
                        <input
                            type='tel'
                            id='tlfno'
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder='Teléfono'
                        />
                        {errors.phone && <span className='error-message'>{errors.phone}</span>}
                    </div>
					<div className='form-group'>
                        <input
                            type='text'
                            id='username'
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder='Usuario'
                        />
						{errors.username && (
							<span className="error-message">{errors.username}</span>
						)}
                    </div>

                    <div className='form-group'>
                        <div className='password-container'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id='password'
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder='Contraseña'
                            />
                            <span className='password-toggle' onClick={handlePeek}>
                                {showPassword ? <EyeSlashIcon className='icon' /> : <EyeIcon className='icon' />}
                            </span>
                        </div>
                        {errors.password && <span className='error-message'>{errors.password}</span>}
                    </div>
                </div>
                    <p>
                        Ya tienes cuenta?
                        <a href='#' onClick={handleBackToLogin}>
                            Inicia Sesión.
                        </a>
                    </p>

                    <button type='submit'>Registrase</button>
                </form>
            </section>
        </main>
    );
}

export default Register;
