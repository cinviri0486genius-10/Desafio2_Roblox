const preguntasDesafio = {
    1: { p: "Para probar tu juego en Roblox Studio presionas el botón...", o: ["Play (F5)", "Stop", "Pause"], r: 0 },
    2: { p: "¿Cuál propiedad cambia la textura física de un bloque (Hielo, Madera, Metal)?", o: ["Color", "Material", "Size"], r: 1 },
    3: { p: "Para agrupar varios bloques en un solo modelo usas el atajo:", o: ["Ctrl + C", "Ctrl + G", "Ctrl + Z"], r: 1 },
    4: { p: "Si quieres ver la lista de objetos de tu mapa usas la pestaña...", o: ["Toolbox", "Properties", "Explorer"], r: 2 },
    5: { p: "En Luau, ¿qué símbolo se usa para asignar un valor a una variable? (Ej: local x ... 5)", o: ["==", "=", "+"], r: 1 },
    6: { p: "¿Cómo se llama el servicio encargado de almacenar la interfaz gráfica (GUIs)?", o: ["StarterGui", "Lighting", "SoundService"], r: 0 },
    7: { p: "¿Qué propiedad cambia el tamaño exacto de un objeto en ejes X, Y, Z?", o: ["Position", "Size", "Name"], r: 1 },
    8: { p: "Si alteras la propiedad 'Transparency' a 0.5, el bloque quedará:", o: ["Completamente invisible", "Semi-transparente", "Muy brillante"], r: 1 },
    9: { p: "Para hacer que un script espere 3 segundos antes de continuar escribes:", o: ["wait(3)", "stop(3)", "pause(3)"], r: 0 }
};

let posicionActual = 0;
const metaCasilla = 10;
let pasosPendientes = 0;

function inicializarTablero() {
    const contenedor = document.getElementById("tablero");
    contenedor.innerHTML = "";
    
    for (let i = metaCasilla; i >= 0; i--) {
        const div = document.createElement("div");
        div.className = "casilla";
        div.id = `casilla-${i}`;
        
        let nombreCasilla = i === metaCasilla ? "🏁 META: Publicar Juego" : i === 0 ? "🚀 SALIDA" : `Bloque de código #${i}`;
        div.innerHTML = `<span>${nombreCasilla}</span>`;
        if (i === metaCasilla) div.classList.add("meta");
        
        contenedor.appendChild(div);
    }
    actualizarPosicionVisual();
}

function actualizarPosicionVisual() {
    document.querySelectorAll(".casilla").forEach(c => {
        c.classList.remove("activa");
        const token = c.querySelector(".token-noob");
        if (token) token.remove();
    });

    const casillaActiva = document.getElementById(`casilla-${posicionActual}`);
    casillaActiva.classList.add("activa");
    
    const token = document.createElement("span");
    token.className = "token-noob";
    token.innerText = "🤠 Tu Noob";
    casillaActiva.appendChild(token);
    
    document.getElementById("posicion-texto").innerText = posicionActual;
}

function lanzarDado() {
    const botonDado = document.getElementById("btn-dado");
    const resultado = document.getElementById("resultado-dado");
    
    botonDado.disabled = true;
    
    // Simular animación del dado girando
    let giros = 0;
    const intervalo = setInterval(() => {
        resultado.innerText = Math.floor(Math.random() * 3) + 1; // Dados del 1 al 3 para no acabar tan rápido
        giros++;
        if (giros > 8) {
            clearInterval(intervalo);
            pasosPendientes = parseInt(resultado.innerText);
            procesarMovimiento();
        }
    }, 80);
}

function procesarMovimiento() {
    posicionActual += pasosPendientes;
    
    if (posicionActual >= metaCasilla) {
        posicionActual = metaCasilla;
        actualizarPosicionVisual();
        document.getElementById("modal-victoria").style.display = "flex";
        return;
    }
    
    actualizarPosicionVisual();
    cargarDesafio(posicionActual);
}

function cargarDesafio(casilla) {
    const desafio = preguntasDesafio[casilla];
    const texto = document.getElementById("texto-desafio");
    const opcionesContenedor = document.getElementById("opciones-contenedor");
    const feedback = document.getElementById("feedback-desafio");
    
    opcionesContenedor.innerHTML = "";
    feedback.innerText = "";

    texto.innerText = `💥 ¡Casilla ${casilla}! Resuelve este bug: ${desafio.p}`;

    desafio.o.forEach((opcion, index) => {
        const btn = document.createElement("button");
        btn.className = "btn-opcion";
        btn.innerText = opcion;
        btn.onclick = () => evaluarRespuesta(index, desafio.r);
        opcionesContenedor.appendChild(btn);
    });
}

function evaluarRespuesta(seleccionada, correcta) {
    const feedback = document.getElementById("feedback-desafio");
    document.getElementById("opciones-contenedor").innerHTML = "";

    if (seleccionada === correcta) {
        feedback.className = "correcto";
        feedback.innerText = "✅ ¡Bug corregido! El servidor está estable. Puedes volver a tirar.";
        document.getElementById("btn-dado").disabled = false;
    } else {
        feedback.className = "incorrecto";
        feedback.innerText = "❌ Error de sintaxis... Retrocedes 1 casilla por seguridad.";
        setTimeout(() => {
            if (posicionActual > 0) posicionActual--;
            actualizarPosicionVisual();
            document.getElementById("btn-dado").disabled = false;
            document.getElementById("texto-desafio").innerText = "¡Lanza el dado para intentar avanzar de nuevo!";
            feedback.innerText = "";
        }, 2000);
    }
}

function reiniciarJuego() {
    posicionActual = 0;
    document.getElementById("modal-victoria").style.display = "none";
    document.getElementById("btn-dado").disabled = false;
    document.getElementById("resultado-dado").innerText = "-";
    document.getElementById("texto-desafio").innerText = "¡Lanza el dado para iniciar tu aventura en el servidor!";
    inicializarTablero();
}

window.onload = inicializarTablero;
