let moduloActual = 1;
const totalModulos = 5;
let puntosTotales = 0;
let puntosJuego1 = 0;

const btnIniciar = document.getElementById('btnIniciar');
const btnHome = document.getElementById('btnHome');
const pantallaInicio = document.getElementById('pantalla-inicio');
const ovaContainer = document.getElementById('ova-container');
const btnAvanzar = document.getElementById('btnAvanzar');
const btnAtras = document.getElementById('btnAtras');
const tabs = document.querySelectorAll('.tab-modulo');

function irAInicio() {
    ovaContainer.classList.remove('activa');
    pantallaInicio.classList.add('activa');
    window.scrollTo(0, 0);
}

function irAOva() {
    pantallaInicio.classList.remove('activa');
    ovaContainer.classList.add('activa');
    window.scrollTo(0, 0);
    mostrarModulo(1);
}

btnIniciar.addEventListener('click', irAOva);
btnHome.addEventListener('click', irAInicio);

function mostrarModulo(num) {
    moduloActual = num;
    document.querySelectorAll('.modulo').forEach(m => m.classList.remove('activo'));
    document.getElementById(`modulo${num}`).classList.add('activo');
    document.getElementById('progreso').style.width = (num / totalModulos * 100) + '%';
    document.getElementById('indicador').innerText = `Módulo ${num} de ${totalModulos}`;
    tabs.forEach(t => t.classList.toggle('activo', parseInt(t.dataset.modulo) === num));
    btnAtras.style.visibility = num === 1 ? 'hidden' : 'visible';
    btnAvanzar.style.visibility = num === totalModulos ? 'hidden' : 'visible';
    document.querySelector('.contenido-modulos').scrollTo(0, 0);
}

btnAvanzar.addEventListener('click', () => { if (moduloActual < totalModulos) mostrarModulo(moduloActual + 1); });
btnAtras.addEventListener('click', () => { if (moduloActual > 1) mostrarModulo(moduloActual - 1); });
tabs.forEach(tab => tab.addEventListener('click', () => mostrarModulo(parseInt(tab.dataset.modulo))));

document.querySelectorAll('.acordeon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const cont = btn.nextElementSibling;
        cont.style.display = cont.style.display === 'block' ? 'none' : 'block';
    });
});

function actualizarPuntos() {
    document.getElementById('puntos').innerText = `⭐ Puntos: ${puntosTotales}`;
}

// ===== JUEGO 1: ARRASTRA Y UNE =====
let dragged = null;
const textoOriginalZonas = new Map();

document.querySelectorAll('.draggable').forEach(d => {
    d.addEventListener('dragstart', () => dragged = d);
});

document.querySelectorAll('.dropzone').forEach(zone => {
    textoOriginalZonas.set(zone, zone.innerHTML);
    zone.addEventListener('dragover', e => e.preventDefault());
    zone.addEventListener('drop', () => {
        if (!dragged || zone.dataset.completado === 'true') return;
        const retro = document.getElementById('juego1-retro');
        if (dragged.dataset.match === zone.dataset.accept) {
            zone.classList.add('correct');
            zone.innerHTML = "✅ " + zone.innerHTML + " → " + dragged.innerHTML;
            zone.dataset.completado = 'true';
            retro.innerHTML = "¡Correcto! +50 puntos";
            puntosTotales += 50;
            puntosJuego1 += 50;
            actualizarPuntos();
            dragged.style.display = 'none';
        } else {
            retro.innerHTML = "Esa no es la pareja correcta, inténtalo de nuevo.";
        }
    });
});

document.getElementById('btnResetJuego1').addEventListener('click', () => {
    document.querySelectorAll('.dropzone').forEach(zone => {
        zone.innerHTML = textoOriginalZonas.get(zone);
        zone.classList.remove('correct');
        zone.dataset.completado = 'false';
    });
    document.querySelectorAll('.draggable').forEach(d => d.style.display = '');
    puntosTotales -= puntosJuego1;
    puntosJuego1 = 0;
    actualizarPuntos();
    document.getElementById('juego1-retro').innerHTML = "Selección reiniciada. ¡Inténtalo de nuevo!";
});

// ===== JUEGO 2: CASO CLÍNICO =====
document.querySelectorAll('.opcion').forEach(btn => {
    btn.addEventListener('click', () => {
        const puntos = parseInt(btn.dataset.puntos);
        const retro = document.getElementById('retro-caso');
        if (puntos > 0) {
            retro.innerHTML = "✅ ¡Excelente! 100 puntos. Eso es IAMII.";
            retro.style.color = "var(--pine)";
            puntosTotales += puntos;
        } else {
            retro.innerHTML = "❌ Incorrecto. IAMII prohíbe el biberón. Corrige el agarre.";
            retro.style.color = "var(--rose)";
        }
        actualizarPuntos();
    });
});

// ===== EVALUACIÓN FINAL =====
document.getElementById('btnEvaluar').addEventListener('click', () => {
    let nota = 0;
    for (let i = 1; i <= 10; i++) {
        const val = document.querySelector(`input[name="p${i}"]:checked`)?.value;
        if (val) nota += parseInt(val);
    }
    const res = document.getElementById('resultado-final');
    res.innerHTML = `Sacaste ${nota}/10. Puntos de juegos: ${puntosTotales}. ${nota >= 7 ? '🎉 ¡Felicidades! Eres enfermera IAMII de 5.0' : 'Repasa los módulos.'}`;
    res.style.fontWeight = "bold";
    res.style.marginTop = "15px";
});
