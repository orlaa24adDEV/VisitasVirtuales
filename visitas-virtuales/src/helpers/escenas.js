
// Mapeo de ID de centro (BD) al índice de escena en el build de Unity.IMPORTANTE: Debe coincidir exactamente con el orden de las escenas
// Escena 0: Bootstrap (arranque), Escena 1: Madrid, Escena 2: Córdoba las que tenemos
// Los centros sin escena propia apuntan a la escena 1 como fallback por ahora
export const ESCENAS_POR_CENTRO = {
    1: 1, // Instituto Madrid → Escena 1
    2: 1, // Instituto Barcelona → fallback Madrid (sin escena propia aún)
    3: 1, // Instituto Sevilla → fallback Madrid (sin escena propia aún)
    4: 1, // Instituto Valencia → fallback Madrid (sin escena propia aún)
    5: 2, // Instituto Córdoba → Escena 2
};