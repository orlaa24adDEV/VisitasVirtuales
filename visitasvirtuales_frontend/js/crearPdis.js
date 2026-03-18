const API_BASE = "http://localhost:8080/api/";
const token = localStorage.getItem("jwtToken");
const JWT_TOKEN = token ? `Bearer ${token}` : "";

// Lista de nombres fijos de PDIs
const NOMBRES_PDI_FIJOS = ["A1", "A2", "A3", "H1", "H2", "H3", "P1", "P2", "P3"];
// Elementos del DOM
const btnCrear = document.getElementById("btnCrear");
const btnModificar = document.getElementById("btnModificar")
const labelPDI = document.getElementById("labelPDI");
const centroSelect = document.getElementById("centroSelect");
const pdiSelect = document.getElementById("pdiSelect");
const contenidoInput = document.getElementById("contenidoJson");
const btnEnviar = document.getElementById("btnEnviar");
const confirmModal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const mensajeElement = document.getElementById("mensaje");

let centros = []; // Array para guardar los centros existentes
let pdIs = []; // Almacena los PDIs cargados del centro
let editingPdiId = null; // ID del PDI que estamos editando
let currentMode = 'MODIFICAR'; // Toggle para Crear  Modificar


// Seleccionar elementos según el rol
function seleccionRoles() {
    let rol = localStorage.getItem("userRole"); // rol del usuario
    if (!rol) return;
    
    const elementos = document.querySelectorAll('[data-rol]'); // todos los elementos con data-rol

    elementos.forEach(el => {
        const roles = el.dataset.rol.split(',').map(r => r.trim().toUpperCase());
        if (!roles.includes(rol)) {
            el.style.display = 'none'; // ocultar si el usuario no tiene permiso
        } else {
            el.style.display = ''; // mostrar solo si coincide
        }
    });
}

document.addEventListener('DOMContentLoaded', seleccionRoles);



// Función para poder emplear el showMessage
function showMessage(message, isSuccess = true) {
    mensajeElement.style.color = isSuccess ? "green" : "red";
    mensajeElement.innerText = message;
}

// --------------------------------------------------
// 1. Seleccionar Crear o Modificar PDI
// --------------------------------------------------
btnModificar.addEventListener("click", ()=>{
    btnModificar.classList.add('activo');
    btnCrear.classList.remove('activo')
    pdiSelect.style.display='block';
    labelPDI.setAttribute("for", "pdiSelect");
    labelPDI.textContent = "Selecciona un PDI a modificar";
    currentMode = 'MODIFICAR';
    
    // Asegurar el reset de inputs y forzar re-lectura del centro
    contenidoInput.value = "";
    pdiSelect.value = "";
    editingPdiId = null;
    if (centroSelect.value) centroSelect.dispatchEvent(new Event('change'));
});

btnCrear.addEventListener("click", ()=>{
    btnCrear.classList.add('activo');
    btnModificar.classList.remove('activo');
    pdiSelect.style.display = 'block';
    labelPDI.setAttribute("for", "pdiSelect");
    labelPDI.textContent = "Selecciona el nombre del PDI a crear";
    currentMode = 'CREAR';

    // Asegurar el reset de inputs y forzar re-lectura del centro
    contenidoInput.value = "";
    pdiSelect.value = "";
    editingPdiId = null;
    if (centroSelect.value) centroSelect.dispatchEvent(new Event('change'));
});

// --------------------------------------------------
// Cargar Nombre Pdis fijos
// --------------------------------------------------
function cargarNombresPDI() {
    pdiSelect.innerHTML = '<option value="">-- Selecciona el PDI --</option>';
    NOMBRES_PDI_FIJOS.forEach(nombre => {
        const option = document.createElement("option");
        option.value = nombre;
        option.textContent = nombre;
        pdiSelect.appendChild(option);
    });
}

// --------------------------------------------------
// Cargar Centros
// --------------------------------------------------
async function cargarCentros() {
    try{
        const resp = await fetch(API_BASE + "centros",{
            headers: {Authorization: JWT_TOKEN},
        });
        if(!resp.ok) throw new Error("Acceso denegado o error al cargar centros.");
        const dataCentros = await resp.json();
        dataCentros.forEach((centros)=>{
            const option = document.createElement("option");
            option.value = centros.idCentros;
            option.textContent = centros.nombre;
            centroSelect.appendChild(option);
        });
        
        // Si hay centros, forzar la carga de PDIs del primer centro disponible.
        if (centroSelect.options.length > 1) {
            centroSelect.value = centroSelect.options[1].value;
            centroSelect.dispatchEvent(new Event('change')); 
        }
        
    }catch(error){
        console.error("Error cargando centros:", error);
        showMessage("Error cargando centros. Verifique token y permisos.", false);
    }
}


// --------------------------------------------------
// Cargar PDIs existentes (Filtrado por Centro)
// --------------------------------------------------
async function cargarPDIs(idCentro) {
    pdIs = []; // reset de PDIs
    if(!idCentro) return; // si no existe el ID se sale

    try {
        const URL_FILTRO = `${API_BASE}pdis/centros/${idCentro}`;
        
        const resp = await fetch(URL_FILTRO, {
            headers:{Authorization: JWT_TOKEN},
        });
        
        if(resp.status === 204){
            showMessage(`No hay PDIs asignados a este Centro.`, true);
            pdiSelect.value = ""; 
            return;
        }
        if (!resp.ok) throw new Error("Error al cargar PDIs");

        // Se almacena la lista completa de PDIs para el Centro
        pdIs = await resp.json();
        showMessage(`Cargados ${pdIs.length} PDIs existentes.`, true)
        
    } catch (error) {
        console.error("Error cargando PDIs:", error);
        showMessage("No se pudieron cargar los PDIs existentes.", false);
    }
}

// --------------------------------------------------
// Manejar cambio de Centro
// --------------------------------------------------
centroSelect.addEventListener("change", ()=>{
    const idCentro = centroSelect.value;

    // Se limpian los inputs al cambiar de Centro
    contenidoInput.value = "";
    editingPdiId = null;
    pdiSelect.value = "";

    if(idCentro){
        cargarPDIs(idCentro);
        // Muestra los inputs al seleccionar el Centro
        pdiSelect.style.display = 'block'; 
        contenidoInput.style.display = 'block';
    }else{
        // Reseteo visual
        pdiSelect.style.display = 'block';
        contenidoInput.style.display = 'none';
    }
});

// --------------------------------------------------
// Seleccionar PDI (Editar o Crear nuevo)
// --------------------------------------------------
pdiSelect.addEventListener("change", () => {
    // selectedName es el nombre fijo (A1, A2, etc.)
    const selectedName = pdiSelect.value; 
    
    contenidoInput.value = "";
    editingPdiId = null;

    if (selectedName) {
        // Buscar en la lista local por el campo 'nombre'
        const pdi = pdIs.find((p) => p.nombre === selectedName);
        
        if (pdi) {
            // Existe: Modo Edición (PUT)
            contenidoInput.value = pdi.descripcion;
            editingPdiId = pdi.idPdi;
            showMessage(`PDI '${selectedName}' cargado para edición (ID: ${pdi.idPdi}).`, true);
        } else {
            // No Existe: Modo Creación (POST) con nombre fijo
            editingPdiId = null; 
            contenidoInput.value = "Escribe aquí el contenido del PDI..."; 
            showMessage(`PDI '${selectedName}' no existe. Se creará al guardar.`, false);
        }
    } else {
        editingPdiId = null;
    }
});

// --------------------------------------------------
// Mostrar modal de confirmación
// --------------------------------------------------
btnEnviar.addEventListener("click", () => {
    const nombrePdi = pdiSelect.value; 
    const contenidoJson = contenidoInput.value.trim();
    const idCentro = centroSelect.value;
    
    if (!idCentro) {
        showMessage("Debes seleccionar un Centro.", false);
        return;
    }
    // Solo validamos si el nombre fijo fue seleccionado
    if (!nombrePdi || nombrePdi === "") {
        showMessage("Debes seleccionar el PDI fijo (A1, H2, etc.)", false);
        return;
    }
    if (!contenidoJson) {
        showMessage("El contenido JSON no puede estar vacío.", false);
        return;
    }

    confirmText.textContent = JSON.stringify(
        { Nombre_PDI: nombrePdi, Contenido_JSON: contenidoJson },
        null,
        2
    );
    confirmModal.style.display = "flex";
});

// --------------------------------------------------
// Confirmar envio (POST o PUT) - Incluye el idCentro
// --------------------------------------------------
confirmBtn.addEventListener("click", async () => {
    const nombrePdi = pdiSelect.value; 
    const contenidoJson = contenidoInput.value.trim();
    const idCentro = centroSelect.value;

    const pdiDTO = { nombre: nombrePdi, contenidoJson };

    const urlBase = editingPdiId ? `${API_BASE}pdis/${editingPdiId}` : `${API_BASE}pdis/infoPdi`;
    const url = `${urlBase}?idCentro=${idCentro}`;

    const method = editingPdiId ? "PUT" : "POST";

    try {
        const respuesta = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: JWT_TOKEN,
            },
            body: JSON.stringify(pdiDTO),
        });

        if (respuesta.ok) {
            const data = await respuesta.json();
            const successMessage = editingPdiId
                ? `PDI ID ${editingPdiId} actualizado con éxito.`
                : `PDI creado con éxito. ID asignado: <b>${data.idPdi}</b>`;
            
            showMessage(successMessage, true);

            // Limpiar contenido y recargar lista de PDIs para actualizar el estado local
            contenidoInput.value = ""; 
            editingPdiId = null;
            pdiSelect.value = "";
            
            // Recargar la lista de PDIs para el centro actual
            await cargarPDIs(idCentro); 
            
        } else {
            const errorData = await respuesta.text();
            showMessage(`Error ${respuesta.status}: ${errorData || 'Error desconocido'}`, false);
        }
    } catch (error) {
        console.error("Error de red:", error);
        showMessage("Error de conexión con el servidor.", false);
    } finally {
        confirmModal.style.display = "none";
    }
});

// --------------------------------------------------
// 6. Cancelar modal y cerrar al click fuera
// --------------------------------------------------
cancelBtn.addEventListener(
    "click",
    () => (confirmModal.style.display = "none")
);
confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) confirmModal.style.display = "none";
});

// --------------------------------------------------
// 7. Inicializar
// --------------------------------------------------
cargarNombresPDI(); // Llenar el select de PDIs fijos
cargarCentros();