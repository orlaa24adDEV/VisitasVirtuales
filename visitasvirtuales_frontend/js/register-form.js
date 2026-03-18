 // MOSTRAR CENTROS SEGÚN LA COMUNIDAD QUE SE SELECCIONE:

  // Objeto con comunidades y sus centros

  const centrosPorComunidad = {
     andalucia: ["Al Andalus", "Almenara", "Almería", "Arena", "Aventura", "Aurora", "Cádiz", "Córdoba", "El Ejido", "Fátima", "Flores", "Granada", "Hispanidad", "Huelva", "Jaén", "Jerez", "Málaga", "Malasaña", "Nevada", "Nova", "Nuevo Torneo", "Ortega y Gasset", "Pacífico", "Sevilla", "Sevilla Este", "Vandelvira", "Velázquez" ],
     aragon: ["El Olivar", "Formacciona", "Zaragoza"],
     asturias: ["Oviedo"],
     "castilla-la-mancha": ["Albacete"],
     cataluna: ["CampusNET", "Hospitalet", "Roger de Lluria"],
    murcia: ["Murcia", "Cartagena"],
    "comunidad-de-madrid": ["Albalá", "Alcorcón", "Fuenlabrada", "Mendivil", "Móstoles", "Pinto", "San Sebastián de los Reyes", "Vallecas"],
    "comunidad-valenciana": ["Alicante", "Castellón", "Elche", "Pastora", "Valencia"]
};

// FUNCIÓN PARA FILTRAR CENTROS

    function cambiaCentros() {
        const comunidadSelect = document.getElementById("comunidad");
        const centroSelect = document.getElementById("centro");
        const comunidadSeleccionada = comunidadSelect.value


     // Limpiar centros anteriores

        centroSelect.innerHTML = '<option value="">Centro de estudios *</option>';

     // Si no hay comunidad seleccionada, no se hace nada

        if (!comunidadSeleccionada) return;

     // Obtener centros de la comunidad seleccionada
     
        const centros = centrosPorComunidad[comunidadSeleccionada];

    // Insertar los centros en el formulario

        centros.forEach(centro => {
            const option = document.createElement("option");
            option.value = centro.toLowerCase().replace(/\s+/g, "-");
            option.textContent = centro;
            centroSelect.appendChild(option);
            });
    };


    // FILTRAR TITULACIONES SEGÚN EL GRADO QUE SE SELECCIONE:

    // Objetos con los grados (medio/superior) y sus titulaciones

    const titulacionesPorGrado = {
        "grado-medio": [ "Actividades Comerciales", "Atención a las Personas en Situación de Dependencia", "Auxiliar de Enfermería", "Emergencias Sanitarias", "Estética y Belleza", "Farmacia y Parafarmacia", "Gestión Administrativa", "Instalaciones de Telecomunicaciones", "Instalaciones Eléctricas y Automáticas", "TECO (Deporte)", "Técnico en Sistemas Microinformáticos y Redes" ],
        "grado-superior": [ "Acondicionamiento físico", "Administración de Sistemas Informáticos en Red", "Administración y Finanzas", "Anatomía Patológica y Citodiagnóstico", "Animaciones 3D, Juegos y Entornos Interactivos", "Asistencia a la Dirección", "Audiología Protésica", "Auxiliar de Enfermería", "Comercio Internacional", "Desarrollo de Aplicaciones Multiplataforma", "Desarrollo de Aplicaciones Web", "Documentación y Administración Sanitarias", "Dietética", "Educación Infantil", "Enseñanza y animación sociodeportiva", "Estética Integral y Bienestar", "Formación en Movilidad Segura y Sostenible", "Higiene Bucodental", "Imagen para el disgnóstico", "Integración Social", "Laboratorio Clínico y Biomédico", "Marketing y Publicidad", "Mediación Comunicativa", "Proyectos de Edificación", "Prótesis Dental", "Radioterapia y Dosimetría", "Transporte y Logística" ]
    }

    // FUNCIÓN PARA FILTRAR GRADOS

    function cambiaGrados() {
        const gradoSelect = document.getElementById("grado");
        const titulacionSelect = document.getElementById("titulacion");
        const gradoSeleccionado = gradoSelect.value


     // Limpiar titulaciones anteriores

        titulacionSelect.innerHTML = '<option value="">Titulación *</option>';

     // Si no hay tipo de grado seleccionado, no se hace nada

        if (!gradoSeleccionado) return;

     // Obtener titulaciones del tipo de grado seleccionado
     
        const titulaciones = titulacionesPorGrado[gradoSeleccionado];

    // Insertar los centros en el formulario

        titulaciones.forEach(titulacion => {
            const option = document.createElement("option");
            option.value = titulacion.toLowerCase().replace(/\s+/g, "-");
            option.textContent = titulacion;
            titulacionSelect.appendChild(option);
            });
    };

