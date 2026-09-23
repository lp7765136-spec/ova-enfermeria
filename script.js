let moduloActual = 1;
const totalModulos = 5;
let estrellasTotales = 0;
let estrellasJuego1 = 0;

const btnIniciar = document.getElementById('btnIniciar');
const btnHome = document.getElementById('btnHome');
const pantallaInicio = document.getElementById('pantalla-inicio');
const ovaContainer = document.getElementById('ova-container');
const btnAvanzar = document.getElementById('btnAvanzar');
const btnAtras = document.getElementById('btnAtras');
const tabs = document.querySelectorAll('.tab-modulo');
const estrellasBadge = document.getElementById('estrellasBadge');
const estrellasValor = document.getElementById('estrellasValor');

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

// ===== SISTEMA DE ESTRELLAS =====
function otorgarEstrellas(cantidad, origenEl) {
    estrellasTotales += cantidad;
    if (estrellasTotales < 0) estrellasTotales = 0;
    const puntosEl = document.getElementById('puntos');
    if (puntosEl) puntosEl.innerText = estrellasTotales;
    if (estrellasValor) estrellasValor.innerText = estrellasTotales;
    if (estrellasBadge) {
        estrellasBadge.classList.remove('pop');
        void estrellasBadge.offsetWidth; // reinicia la animación
        estrellasBadge.classList.add('pop');
    }
    if (cantidad !== 0 && origenEl) {
        mostrarEstrellaFlotante(origenEl, cantidad);
    }
}

function mostrarEstrellaFlotante(target, cantidad) {
    const rect = target.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'estrella-flotante';
    el.textContent = `${cantidad > 0 ? '+' : ''}${cantidad} ⭐`;
    el.style.left = (rect.left + rect.width / 2) + 'px';
    el.style.top = rect.top + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
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
            retro.innerHTML = "¡Correcto! +1 estrella";
            estrellasJuego1 += 1;
            otorgarEstrellas(1, zone);
            dragged.style.display = 'none';
        } else {
            retro.innerHTML = "Esa no es la pareja correcta, inténtalo de nuevo.";
        }
    });
});

document.getElementById('btnResetJuego1').addEventListener('click', (e) => {
    document.querySelectorAll('.dropzone').forEach(zone => {
        zone.innerHTML = textoOriginalZonas.get(zone);
        zone.classList.remove('correct');
        zone.dataset.completado = 'false';
    });
    document.querySelectorAll('.draggable').forEach(d => d.style.display = '');
    otorgarEstrellas(-estrellasJuego1, null);
    estrellasJuego1 = 0;
    document.getElementById('juego1-retro').innerHTML = "Selección reiniciada. ¡Inténtalo de nuevo!";
});

// ===== JUEGO 2: CASO CLÍNICO =====
let juego2Respondido = false;
document.querySelectorAll('.opcion').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (juego2Respondido) return;
        juego2Respondido = true;
        const estrellas = parseInt(btn.dataset.estrellas);
        const retro = document.getElementById('retro-caso');
        const todas = document.querySelectorAll('.opcion');
        todas.forEach(b => b.disabled = true);
        if (estrellas > 0) {
            btn.classList.add('correcta');
            retro.innerHTML = "✅ ¡Excelente! +3 estrellas. Eso es IAMII.";
            retro.style.color = "var(--pine)";
        } else {
            btn.classList.add('incorrecta');
            retro.innerHTML = "❌ Incorrecto. IAMII prohíbe el biberón. Corrige el agarre.";
            retro.style.color = "var(--rose)";
        }
        otorgarEstrellas(estrellas, btn);
    });
});

// ===== JUEGO 3: VERDADERO O FALSO =====
const preguntasVF = [
    { texto: "La IAMII promueve el contacto piel a piel inmediato después del parto.", respuesta: true },
    { texto: "Según IAMII, se debe ofrecer biberón si la madre tiene el pezón agrietado.", respuesta: false },
    { texto: "La lactancia materna exclusiva debe mantenerse hasta los 6 meses.", respuesta: true },
    { texto: "El alojamiento conjunto madre-hijo debe ser de solo 12 horas al día.", respuesta: false },
    { texto: "IAMII permite el uso de chupos y biberones sin restricción.", respuesta: false },
    { texto: "El personal de salud debe estar capacitado en las políticas de lactancia.", respuesta: true }
];

const listaVF = document.getElementById('listaVF');
const vfProgreso = document.getElementById('vfProgreso');
let vfRespondidas = 0;

preguntasVF.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'vf-pregunta';
    card.innerHTML = `
        <p><b>${i + 1}.</b> ${p.texto}</p>
        <div class="vf-botones">
            <button class="vf-btn" data-valor="true">Verdadero</button>
            <button class="vf-btn" data-valor="false">Falso</button>
        </div>
        <p class="vf-retro"></p>
    `;
    listaVF.appendChild(card);

    card.querySelectorAll('.vf-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (card.dataset.respondida === 'true') return;
            card.dataset.respondida = 'true';
            const elegido = btn.dataset.valor === 'true';
            const retro = card.querySelector('.vf-retro');
            card.querySelectorAll('.vf-btn').forEach(b => b.disabled = true);
            vfRespondidas++;
            vfProgreso.innerText = `${vfRespondidas} de ${preguntasVF.length} respondidas`;
            if (elegido === p.respuesta) {
                card.classList.add('acertada');
                retro.innerHTML = "✅ Correcto. +1 estrella";
                retro.style.color = "var(--pine)";
                otorgarEstrellas(1, btn);
            } else {
                card.classList.add('fallada');
                retro.innerHTML = `❌ Incorrecto. La respuesta es ${p.respuesta ? 'Verdadero' : 'Falso'}.`;
                retro.style.color = "var(--rose)";
            }
        });
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
    res.innerHTML = `Sacaste ${nota}/10. ⭐ Estrellas acumuladas en el OVA: ${estrellasTotales}. ${nota >= 7 ? '🎉 ¡Felicidades! Eres enfermera IAMII de 5.0' : 'Repasa los módulos.'}`;
    res.style.fontWeight = "bold";
    res.style.marginTop = "15px";
});
