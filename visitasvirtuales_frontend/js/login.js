const LOGIN_API_URL = "http://localhost:8080/api/auth/login";

// FUNCIÓN DE LOGOUT
function handleLogout(){
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');

    // recarga la página para instaurar la sesión 
    window.location.reload();
}

// FUNCIÓN PARA VERIFICACIÓN AL CARGAR LA PÁGINA
function checkLoginStatus(){
    const token = localStorage.getItem('jwtToken');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const authButtonsContainer = document.getElementById('auth-buttons');
    const userSessionContainer = document.getElementById('user-session');

    const ADMIN_ROLE = "ROLE_ADMINISTRADOR";
    const PROFESOR_ROLE = "ROLE_PROFESOR";
    const ALUM_ROLE = "ROLE_ALUMNO";

    if (token && userName && authButtonsContainer && userSessionContainer) {
        // 1. Ocultar los botones de Login/Registro
        authButtonsContainer.style.display = 'none';
        // 2. Mostrar el saludo y el botón de Cerrar Sesión
        userSessionContainer.style.display = 'flex';

        let adminPanelButton = '';
        if(userRole === ADMIN_ROLE){
            // Si el rol coincide con el administrador, crea el botón
            adminPanelButton = `<a href="ViewAdmin.html" class="boton2" style="margin-right: 10px;">Panel de Admin</a>`;
        } else if(userRole === PROFESOR_ROLE){
            // Si el rol coincide con el profesor, crea el botón que lleva a la misma página que el administrador.
            // En ViewAdmin.html están añadidos los roles para que se muestre sólo lo que debe mostrarse al rol de profesor
            adminPanelButton = `<a href="ViewAdmin.html" class="boton2" style="margin-right: 10px;">Panel de Profesor</a>`;
        }
        // Construye el HTML de la sesión
        userSessionContainer.innerHTML = `
            <span class="user-name-display" style="color: #ececec; font-weight: 600; margin-right: 25px;">
                Hola, <br>${userName}
            </span>
            ${adminPanelButton}<button class="boton" onclick="handleLogout()">Cerrar sesión</button>
        `;
    } else if (authButtonsContainer) {
        // Si no hay token, aseguramos que se muestren los botones de autenticación por defecto
        authButtonsContainer.style.display = 'flex';
        userSessionContainer.style.display = 'none';
    }
}

// LÓGICA DE LOGIN
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) { 
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            handleLogin();
        });
    } else {
        console.error("No se encontró el formulario de login ('loginForm').");
    }
});


// Obtiene los elementos del backend
async function handleLogin() {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const loginMessage = document.getElementById('loginMessage'); 

    if (!emailInput || !passwordInput || !loginMessage) {
        console.error("Error: Uno o más elementos del formulario de login no se encontraron en el DOM.");
        return; 
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    loginMessage.textContent = ""; 

    if (!email || !password) {
        loginMessage.textContent = "Por favor, introduce email y contraseña.";
        return;
    }

    const loginRequest = {
        email: email,
        password: password
    };

    try {
        const response = await fetch(LOGIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginRequest)
        });

        if (response.ok) {
            const data = await response.json();
            const jwtToken = data.token || data.accessToken; 
            const userName = data.nombre;
            const userRole = data.rol;
            // Almacena el token, el email y el nombre
            localStorage.setItem('jwtToken', jwtToken);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', userName);
            localStorage.setItem('userRole', userRole);

            loginMessage.textContent = "¡Inicio de sesión exitoso! Redirigiendo...";
            loginMessage.style.color = "green";
            
            window.location.reload(); 
        } else {
            const errorData = await response.text(); 
            let errorMessage = "Error en el inicio de sesión. Credenciales incorrectas.";

            if (response.status === 401) {
                errorMessage = "Credenciales incorrectas. Vuelve a intentarlo.";
            } else if (response.status === 400 && errorData) {
               errorMessage = "Solicitud inválida: " + errorData;
            }

            loginMessage.textContent = errorMessage;
            loginMessage.style.color = "red";
        }
    } catch (error) {
        console.error('Error de red al intentar iniciar sesión:', error);
        loginMessage.textContent = "Error de conexión con el servidor. Inténtalo más tarde.";
        loginMessage.style.color = "red";
    }
}