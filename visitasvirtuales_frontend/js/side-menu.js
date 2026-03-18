// Elementos necesarios
const movilMenu = document.getElementById("movil_menu");
const nav = document.getElementById("nav");
const background_menu = document.getElementById("back_menu");

// Al hacer clic en el icono
movilMenu.addEventListener("click", () => {
    if (nav.style.right === "0px") {
        // Si ya está abierto, se cierra
        nav.style.right = "-220px";
        background_menu.style.display = "none";
    } else {
        // Si está cerrado, se abre
        nav.style.right = "0px";
        background_menu.style.display = "block";
    }
});

// Al hacer clic en el fondo oscuro se cierra
background_menu.addEventListener("click", () => {
    nav.style.right = "-220px";
    background_menu.style.display = "none";
});
