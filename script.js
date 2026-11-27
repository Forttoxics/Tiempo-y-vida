/* "TIEMPO Y VIDA"*/
(function () {
  const el = document.getElementById('bookTitle');
  const text = 'TIEMPO Y VIDA';
  let i = 0;

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 95);
    } else {
      el.classList.add('done'); // oculta el cursor parpadeante
    }
  }

  setTimeout(type, 400); // pequeño delay para que se note al cargar
})();

//Cita flotante
(function () {
  const quotes = [
    '"El tiempo no espera a nadie, pero la vida sí."',
    '"Hay decisiones que duran segundos y consecuencias que duran toda la vida."',
    '"No todo lo que se pierde es una pérdida."',
    '"A veces el destino se escribe con errores."',
  ];

  const el = document.getElementById('floatingQuote');
  el.textContent = quotes[Math.floor(Math.random() * quotes.length)];

  // Aparece con fade-in tras el typewriter
  setTimeout(() => el.classList.add('visible'), 1600);
})();


/*PARTÍCULAS*/
(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.floor((W * H) / 14000); // densidad relativa al tamaño
    particles = Array.from({ length: count }, () => ({
      x:   Math.random() * W,
      y:   Math.random() * H,
      r:   Math.random() * 1.4 + 0.3,          // radio 0.3–1.7 px
      dx:  (Math.random() - 0.5) * 0.18,
      dy:  (Math.random() - 0.5) * 0.18,
      o:   Math.random() * 0.5 + 0.15,         // opacidad 0.15–0.65
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(143,211,255,${p.o})`; // acento azul suave
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      // rebote en bordes
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  draw();
})();


/*REPRODUCTOR + BARRA DE PROGRESO*/
(function () {
  const audioPlayer = document.getElementById('audioPlayer');
  const wraps       = document.querySelectorAll('.music-btn-wrap');

  let activeWrap = null;
  let rafId      = null;

  function updateBar(wrap) {
    const bar = wrap.querySelector('.progress-bar');
    if (!bar) return;

    const pct = audioPlayer.duration
      ? (audioPlayer.currentTime / audioPlayer.duration) * 100
      : 0;
    bar.style.width = pct + '%';

    if (!audioPlayer.paused) {
      rafId = requestAnimationFrame(() => updateBar(wrap));
    }
  }

  function stopBar() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function activateWrap(wrap) {
  
    if (activeWrap && activeWrap !== wrap) {
      activeWrap.classList.remove('playing');
      const prevBar = activeWrap.querySelector('.progress-bar');
      if (prevBar) prevBar.style.width = '0%';
      const prevBtn = activeWrap.querySelector('.music-btn');
      if (prevBtn) prevBtn.textContent = prevBtn.textContent.replace('⏸', '🎵');
    }
    activeWrap = wrap;
  }

  wraps.forEach(wrap => {
    const btn = wrap.querySelector('.music-btn');
    const src = btn.dataset.audio;
    if (!src) return;

    btn.addEventListener('click', () => {
      const isThisTrack = audioPlayer.src.includes(encodeURIComponent(src).replace(/%20/g, ' '))
                       || audioPlayer.src.endsWith(src);

      if (isThisTrack && !audioPlayer.paused) {
        // Pausar
        audioPlayer.pause();
        wrap.classList.remove('playing');
        btn.textContent = btn.textContent.replace('⏸', '🎵');
        stopBar();
        return;
      }

      // Cambiar pista
      activateWrap(wrap);
      audioPlayer.src = src;
      audioPlayer.currentTime = 0;

      audioPlayer.play().then(() => {
        wrap.classList.add('playing');
        stopBar();
        updateBar(wrap);

       
        wraps.forEach(w => {
          const b = w.querySelector('.music-btn');
          if (b) b.textContent = b.textContent.replace('⏸', '🎵');
        });
        btn.textContent = btn.textContent.replace('🎵', '⏸');
      }).catch(() => {});
    });
  });

 
  audioPlayer.addEventListener('ended', () => {
    if (activeWrap) {
      activeWrap.classList.remove('playing');
      const bar = activeWrap.querySelector('.progress-bar');
      if (bar) bar.style.width = '0%';
      const btn = activeWrap.querySelector('.music-btn');
      if (btn) btn.textContent = btn.textContent.replace('⏸', '🎵');
    }
    stopBar();
    activeWrap = null;
  });
})();
(function () {
  const naturalezas = [
    {
      icono: '/Mi-pagina-web/assets/iconos/naturaleza/explorador.svg',
      nombre: 'Explorador',
      texto: 'Vas donde otros dudan, porque tu alma florece cuando descubre.'
    },
    {
      icono: '/Mi-pagina-web/assets/iconos/naturaleza/sword.svg',
      nombre: 'Guerrero',
      texto: 'Luchas por lo que quieres, pero nunca olvides que también mereces tu propia paz.'
    },
    {
      icono: '/Mi-pagina-web/assets/iconos/naturaleza/protector.svg',
      nombre: 'Protector',
      texto: 'Defiendes a quienes amas, pero tu corazón también merece refugio.'
    },
    {
      icono: '/Mi-pagina-web/assets/iconos/naturaleza/mediador.svg',
      nombre: 'Mediador',
      texto: 'Tu fuerza está en calmar, unir y darle forma al equilibrio.'
    },
    {
      icono: '/Mi-pagina-web/assets/iconos/naturaleza/sabio.svg',
      nombre: 'Sabio',
      texto: 'Ves más allá de la prisa; tu poder está en comprender antes de decidir.'
    },
  ];

  const btn       = document.getElementById('naturaleza-btn');
  const resultado = document.getElementById('naturaleza-resultado');
  const icono     = document.getElementById('naturaleza-icono');
  const nombre    = document.getElementById('naturaleza-nombre');
  const texto     = document.getElementById('naturaleza-texto');

  btn.addEventListener('click', () => {
    const eleccion = naturalezas[Math.floor(Math.random() * naturalezas.length)];

    icono.src        = eleccion.icono;
    icono.alt        = eleccion.nombre;
    nombre.textContent = eleccion.nombre;
    texto.textContent  = eleccion.texto;

    resultado.classList.add('hidden');
    requestAnimationFrame(() => {
      resultado.classList.remove('hidden');
    });
  });
})();

(function () {

  /* ── Textos para respuesta INCORRECTA ── */
  const textosFallo = [
    'Tu elección abrió un nuevo camino en la vida de Timit.',
    'Tu reacción cambió la historia como la conocemos.',
    'Estás destinado a crear tu propia historia.',
    'La historia no coincide; una nueva línea temporal acaba de abrirse.',
  ];

  /* ── Rangos de puntaje final ── */
  const rangos = [
    {
      min: 50, max: 50,
      titulo: 'Leyenda de Tiempo y Vida',
      desc: 'Tu afinidad con Timit es única.',
    },
    {
      min: 30, max: 40,
      titulo: 'Viajero del Tiempo',
      desc: 'Conoces bien el camino, aunque aún hay momentos por descubrir.',
    },
    {
      min: 10, max: 20,
      titulo: 'Aprendiz',
      desc: 'Estás comenzando a comprender el mundo de Timit.',
    },
    {
      min: 0, max: 0,
      titulo: 'Tu línea temporal es única',
      desc: 'Quizás tu historia aún no ha sido escrita.',
    },
  ];

  // ESCENARIOS — 10 pts por acierto, 5 escenarios = 50 pts/
  const escenarios = [

    /* ── EVENTO 1: La lluvia / Sócrates ── */
    {
      escena: 'Estás herido bajo la lluvia. Una lámpara se enciende entre el agua. Un hombre de barba te observa con calma; parece misterioso, pero tranquilo.',
      opciones: [
        { texto: 'Conversas con él',                             correcta: true  },
        { texto: 'Te vas sin decir nada',                        correcta: false },
        { texto: 'Agradeces la compañía, pero guardas silencio', correcta: false },
        { texto: 'Preguntas quién es',                           correcta: false },
      ],
      textoAcierto: 'Elegiste hablar. La lluvia no fue un obstáculo, sino la puerta de entrada a un encuentro histórico; ese hombre era Sócrates y en Tiempo y Vida, esa conversación se volvió un destello decisivo para Timit.',
      extracto: 'Me llamo Sócrates, ¿Me conoces de algún lado, pequeño?', //EXTRACTO DEL LIBRO
    },

    /* ── EVENTO 2: El reloj viejo ── */
    {
      escena: 'Te detienes frente a un reloj viejo. Sientes que el tiempo pesa más de lo normal.',
      opciones: [
        { texto: 'Lo observas con atención',           correcta: true  },
        { texto: 'Lo ignoras y sigues caminando',      correcta: false },
        { texto: 'Intentas arreglarlo',                correcta: false },
        { texto: 'Preguntas por qué es tan importante', correcta: false },
      ],
      textoAcierto: 'Mirarlo fue entenderlo. El reloj no era solo un objeto, era una advertencia. En el libro, el tiempo aparece como algo que debe ser respetado, no perseguido.',
      extracto: 'El tiempo es valioso, y la vida depende de nuestras acciones, debes mantenerte consciente para lograr controlarla', //EXTRACTO DEL LIBRO
    },

    /* ── EVENTO 3: El cuaderno vacío ── */
    {
      escena: 'Tienes un cuaderno vacío. Quieres escribir algo, pero la caligrafía te traiciona.',
      opciones: [
        { texto: 'Escribes de todos modos',         correcta: false },
        { texto: 'Reescribes hasta que quede bien', correcta: true  },
        { texto: 'Cierras el cuaderno y lo dejas',  correcta: false },
        { texto: 'Pides ayuda',                     correcta: false },
      ],
      textoAcierto: 'Reescribir fue un pequeño sacrificio, pero también una victoria. En Tiempo y Vida, la escritura se vuelve una forma de disciplina, paciencia y crecimiento interior.',
      extracto: 'Mi ortografia es horrible, escribí una pagina y entiendo la mitad.', //EXTRACTO DEL LIBRO
    },

    /* ── EVENTO 4: La discusión familiar ── */
    {
      escena: 'Escuchas una discusión en casa. La tensión pesa más que cualquier ruido.',
      opciones: [
        { texto: 'Intervienes',                                correcta: false },
        { texto: 'Te quedas callado',                          correcta: false },
        { texto: 'Sales de la casa',                           correcta: true  },
        { texto: 'Intentas calmar el ambiente con una frase',  correcta: false },
      ],
      textoAcierto: 'Salir fue la respuesta de Timit; no para huir, sino para buscar aire, sentido y un camino propio dentro del conflicto.',
      extracto: '¡Ya basta!! la luz del dia apenas nos acompaña, no es tiempo de discutir', //EXTRACTO DEL LIBRO
    },

    /* ── EVENTO 5: El fuego ── */
    {
      escena: 'Un fuego arde frente a ti. Sientes que su luz responde al estado de tu mente.',
      opciones: [
        { texto: 'Te acercas',               correcta: false },
        { texto: 'Lo contemplas de lejos',   correcta: true  },
        { texto: 'Intentas apagarlo',        correcta: false },
        { texto: 'Preguntas qué representa', correcta: false },
      ],
      textoAcierto: 'El fuego no solo calienta: enseña. En el libro, el abuelo lo usa como símbolo de reflexión, energía y tiempo que se consume.',
      extracto: 'La hoguera parece estar débil, sus llamas quieren apagarse', //EXTRACTO DEL LIBRO
    },

  ];

    // LÓGICA //

  const iconoPuerta = '/Mi-pagina-web/assets/iconos/eventos/puerta.svg';
  const PTS_ACIERTO = 10;

  const elEscena      = document.getElementById('evento-escena');
  const elPuertas     = document.getElementById('evento-puertas');
  const elIntro       = document.getElementById('evento-intro');
  const elResultado   = document.getElementById('evento-resultado');
  const elResTexto    = document.getElementById('evento-resultado-texto');
  const elExtracto    = document.getElementById('evento-extracto');
  const elSiguiente   = document.getElementById('evento-siguiente');
  const elFinal       = document.getElementById('evento-final');
  const elPuntajeTxt  = document.getElementById('evento-puntaje-texto');
  const elRangoTxt    = document.getElementById('evento-rango-texto');
  const elRangoDesc   = document.getElementById('evento-rango-desc');
  const elReiniciar   = document.getElementById('evento-reiniciar');
  const elContador    = document.getElementById('evento-contador');
  const elPuntosLive  = document.getElementById('evento-puntos-live');

  let cola    = [];   // escenarios mezclados pendientes
  let actual  = 0;    // índice dentro de la cola (0-4)
  let puntos  = 0;

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function iniciar() {
    cola   = shuffle(escenarios);
    actual = 0;
    puntos = 0;
    actualizarLive();
    mostrarEscenario();

    elFinal.classList.add('hidden');
    elResultado.classList.add('hidden');
    elIntro.style.display = '';
  }

  function actualizarLive() {
    elContador.textContent   = `Momento ${actual + 1} de ${escenarios.length}`;
    elPuntosLive.textContent = `⬡ ${puntos} pts`;
  }

  function mostrarEscenario() {
    const s = cola[actual];
    elEscena.textContent = s.escena;
    elPuertas.innerHTML  = '';

    shuffle(s.opciones).forEach(op => {
      const btn = document.createElement('button');
      btn.className = 'puerta-btn';
      btn.innerHTML = `<img src="${iconoPuerta}" alt="Puerta"><span>${op.texto}</span>`;
      btn.addEventListener('click', () => elegir(op, s));
      elPuertas.appendChild(btn);
    });

    actualizarLive();
    elIntro.style.display = '';
    elResultado.classList.add('hidden');
  }

  function elegir(opcion, escenario) {
    elIntro.style.display = 'none';

    if (opcion.correcta) {
      puntos += PTS_ACIERTO;
      elPuntosLive.textContent = `⬡ ${puntos} pts`;
      elResTexto.textContent   = escenario.textoAcierto;

      if (escenario.extracto && escenario.extracto.trim() !== '') {
        elExtracto.textContent = escenario.extracto;
        elExtracto.classList.remove('hidden');
      } else {
        elExtracto.classList.add('hidden');
      }
    } else {
      elResTexto.textContent = textosFallo[Math.floor(Math.random() * textosFallo.length)];
      elExtracto.classList.add('hidden');
    }

    /* Texto del botón según si es el último */
    const esUltimo = actual === escenarios.length - 1;
    elSiguiente.textContent = esUltimo ? '★ Ver resultado final' : '→ Siguiente momento';

    elResultado.classList.remove('hidden');
  }

  elSiguiente.addEventListener('click', () => {
    actual++;
    if (actual >= escenarios.length) {
      mostrarFinal();
    } else {
      elResultado.classList.add('hidden');
      mostrarEscenario();
    }
  });

  function mostrarFinal() {
    elResultado.classList.add('hidden');

    const rango = rangos.find(r => puntos >= r.min && puntos <= r.max)
                || rangos[rangos.length - 1];

    elPuntajeTxt.textContent = `${puntos} / ${escenarios.length * PTS_ACIERTO}`;
    elRangoTxt.textContent   = rango.titulo;
    elRangoDesc.textContent  = rango.desc;

    elFinal.classList.remove('hidden');
    window.dispatchEvent(new CustomEvent('tv:juegoCompletado', {
      detail: { puntos }
    }));
  }

  elReiniciar.addEventListener('click', iniciar);

  /* Arranque */
  iniciar();

})();

(function () {

  /* ════════════════════════════
     CLAVES DE LOCALSTORAGE
     ════════════════════════════ */
  const KEY_PUNTOS      = 'tv_puntos';        // puntos acumulados
  const KEY_CANJEADOS   = 'tv_canjeados';     // array de IDs canjeados
  const KEY_ULTIMO_JUEGO = 'tv_ultimo_juego'; // timestamp del último juego completado

  const MS_24H = 24 * 60 * 60 * 1000;

  /* ════════════════════════════
     HELPERS DE STORAGE
     ════════════════════════════ */
  function getPuntos() {
    return parseInt(localStorage.getItem(KEY_PUNTOS) || '0', 10);
  }

  function setPuntos(n) {
    localStorage.setItem(KEY_PUNTOS, String(n));
  }

  function getCanjeados() {
    try {
      return JSON.parse(localStorage.getItem(KEY_CANJEADOS) || '[]');
    } catch { return []; }
  }

  function addCanjeado(id) {
    const lista = getCanjeados();
    if (!lista.includes(id)) lista.push(id);
    localStorage.setItem(KEY_CANJEADOS, JSON.stringify(lista));
  }

  function puedeJugarHoy() {
    const ultimo = parseInt(localStorage.getItem(KEY_ULTIMO_JUEGO) || '0', 10);
    return Date.now() - ultimo > MS_24H;
  }

  function registrarJuegoCompletado() {
    localStorage.setItem(KEY_ULTIMO_JUEGO, String(Date.now()));
  }

  function tiempoRestante() {
    const ultimo = parseInt(localStorage.getItem(KEY_ULTIMO_JUEGO) || '0', 10);
    const diff   = MS_24H - (Date.now() - ultimo);
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  }

  /* ════════════════════════════
     ELEMENTOS DEL DOM — CANJE
     ════════════════════════════ */
  const elPuntosTotal    = document.getElementById('canje-puntos-total');
  const elAvisoBloqueo   = document.getElementById('canje-aviso-bloqueo');

  function actualizarPanelCanje() {
    const pts = getPuntos();
    elPuntosTotal.textContent = `${pts} pts disponibles`;

    const canjeados = getCanjeados();
    [1, 2, 3].forEach(id => {
      const btn      = document.getElementById(`canje-btn-${id}`);
      const card     = document.getElementById(`canje-card-${id}`);
      const contenido = document.getElementById(`canje-texto-${id}`);
      if (!btn) return;

      if (canjeados.includes(id)) {
        /* Ya canjeado — mostrar contenido, deshabilitar botón */
        btn.textContent = '✅ Desbloqueado';
        btn.classList.add('ya-canjeado');
        btn.disabled = true;
        card.classList.add('desbloqueada');
        contenido.classList.remove('hidden');
      } else {
        const costo = parseInt(btn.dataset.costo, 10);
        btn.disabled = pts < costo;
      }
    });

    /* Aviso si el juego está bloqueado */
    const restante = tiempoRestante();
    if (restante && !puedeJugarHoy()) {
      elAvisoBloqueo.textContent = `⏳ Podrás ganar más puntos en ${restante}. ¡Vuelve mañana!`;
      elAvisoBloqueo.classList.remove('hidden');
    } else {
      elAvisoBloqueo.classList.add('hidden');
    }
  }

  /* ════════════════════════════
     BOTONES DE CANJE
     ════════════════════════════ */
  [1, 2, 3].forEach(id => {
    const btn = document.getElementById(`canje-btn-${id}`);
    if (!btn) return;

    btn.addEventListener('click', () => {
      const costo     = parseInt(btn.dataset.costo, 10);
      const ptsActual = getPuntos();

      if (ptsActual < costo) return;

      setPuntos(ptsActual - costo);
      addCanjeado(id);
      actualizarPanelCanje();
    });
  });

  /* ════════════════════════════
     INTEGRACIÓN CON EL MINIJUEGO
     Al terminar los 5 eventos, sumar puntos al localStorage
     y bloquear el juego por 24h
     ════════════════════════════ */

  /* Esperamos a que el minijuego dispare un evento custom */
  window.addEventListener('tv:juegoCompletado', (e) => {
    const ganados = e.detail.puntos;
    if (!puedeJugarHoy()) return; // ya jugó hoy, no suma

    const nuevos = getPuntos() + ganados;
    setPuntos(nuevos);
    registrarJuegoCompletado();
    actualizarPanelCanje();
  });

  /* Carga inicial */
  actualizarPanelCanje();

})();


/* ════════════════════════════════════════════════════
   CHATBOT — "El Narrador de Tiempo y Vida"
   IA: Pollinations (modelo "openai") · Sin API key
   ════════════════════════════════════════════════════ */
(function () {

  /* ╔═══════════════════════════════════════════════════╗
     ║   ✏️  ZONA EDITABLE — TODO LO QUE LA IA SABE        ║
     ║                                                    ║
     ║   Aquí puedes poner TODA la información que        ║
     ║   quieras del libro: sinopsis, personajes,         ║
     ║   capítulos, curiosidades, citas, dónde comprar…   ║
     ║   Cuanto mejor ordenada esté, mejor responderá.    ║
     ╚═══════════════════════════════════════════════════╝ */
  const CONOCIMIENTO = `
## EL LIBRO
- Título: "Tiempo y Vida"
- Autor: Christian Yandel
- Género: reflexivo / aventura sobre el valor del tiempo
- Frase central del libro: "Nunca debes menospreciar a los demás por querer ser felices, aún si no toman tu camino. Pensar que por no hacerlo hacen mal es egocentrismo."
- Frase de apertura: "El tiempo apurará, esperando un resultado, un proceso, un inicio..."

## SINOPSIS
"Tiempo y Vida" sigue la historia de Timit, un niño con una mirada que se pierde en un viejo reloj extraviado. Entre conversaciones con su abuelo junto a la hoguera, encuentros imposibles bajo la lluvia (como el del legendario Sócrates, que le pregunta: "Me llamo Sócrates, ¿Me conoces de algún lado, pequeño?"), discusiones familiares que duelen y páginas escritas con una ortografía honesta, Timit aprenderá que el tiempo es valioso y que la vida depende de nuestras acciones.

## PERSONAJES
- Timit: el protagonista. Un niño observador, sensible, destinado a cambiar la vida de quienes lo rodean. Cree en la escritura como forma de disciplina y crecimiento.
- El abuelo: guía silencioso de Timit. Usa la hoguera y el fuego como símbolos de reflexión, energía y tiempo que se consume. Retiene su preocupación con cariño.
- La madre: observa a su hijo con ternura y preocupación; le narraba historias de actuaciones del pasado.
- Sócrates: el filósofo griego aparece en un encuentro bajo la lluvia que se vuelve un destello decisivo para Timit.
- Habert: un ser que, agradecido de ser amado, no quería ser quien era; el caos lo consumió hasta hacerle olvidar su identidad. Timit lo descifra y lo hace consciente de quién es.
- Gin: padre de Habert; considera a Timit un creador, una persona valiosa, y le debe todo.

## TEMAS DEL LIBRO
- El valor del tiempo: "El tiempo es valioso, y la vida depende de nuestras acciones; debes mantenerte consciente para lograr controlarla."
- Las decisiones: duran segundos, sus consecuencias toda la vida.
- No todo lo que se pierde es una pérdida; a veces el destino se escribe con errores.
- La felicidad de los demás, aunque tomen un camino distinto al tuyo.
- La escritura como paciencia y crecimiento ("Mi ortografía es horrible, escribí una página y entiendo la mitad").

## DÓNDE LEERLO / COMPRARLO
- Amazon: https://www.amazon.com/dp/B0GDV7CG6M
- Wattpad (gratis): https://www.wattpad.com/story/403445678-tiempo-y-vida
- Adelanto gratuito: botón "Ver adelanto" en esta misma web
- Libro completo gratis a cambio de una reseña: botón "Recibir libro completo" en esta web
- Instagram del autor: https://www.instagram.com/yandellvillalobos
`;

  /* Personalidad del asistente (también editable) */
  const PERSONALIDAD = `
Eres "El Narrador", el guardián y voz misteriosa del libro "Tiempo y Vida" de Christian Yandel.
Tu misión: responder las preguntas de los visitantes de la web oficial del libro.

Reglas:
1. Responde SIEMPRE en español, con un tono misterioso y poético, como quien narra una leyenda alrededor de una hoguera… pero claro, cálido y útil.
2. Tus respuestas son breves: entre 2 y 5 frases (salvo que pidan detalles).
3. Usas ÚNICAMENTE la información del libro que se te entrega más abajo. Si te preguntan algo que no está allí, admítelo con elegancia ("Eso, viajero, aún permanece entre las páginas que no he revelado…") e invita a leer el adelanto o el libro. NUNCA inventes datos del libro.
4. No reveles spoilers de las partes avanzadas de la historia; invita al lector a descubrirlos por sí mismo.
5. Si preguntan dónde comprar o leer el libro, menciona Amazon, Wattpad o el botón de adelanto de esta web.
6. Si te preguntan algo ajeno al libro, guíalos amablemente de vuelta al mundo de Timit.
7. Puedes usar metáforas sobre el tiempo, los relojes y la vida para dar sabor a tus respuestas, sin exagerar.
`;

  /* ⚙️ Configuración técnica — no necesitas tocar nada de aquí abajo */
  const MODELO   = 'openai';                              // modelo de Pollinations
  const API_URL  = 'https://text.pollinations.ai/openai'; // endpoint (sin API key)
  const MAX_MSJ  = 16;        // cuántos mensajes recuerda la IA en la conversación
  const SALUDO   = 'Ah… siento pasos entre mis páginas. Bienvenido, viajero. Yo soy El Narrador, guardián de "Tiempo y Vida".\nPregúntame lo que quieras sobre el libro: su historia, sus personajes, sus misterios…';

  /* Elementos del DOM */
  const burbuja   = document.getElementById('chatbot-burbuja');
  const ventana   = document.getElementById('chatbot-ventana');
  const cerrarBtn = document.getElementById('chatbot-cerrar');
  const mensajes  = document.getElementById('chatbot-mensajes');
  const form      = document.getElementById('chatbot-form');
  const input     = document.getElementById('chatbot-input');
  const enviarBtn = document.getElementById('chatbot-enviar');
  const tip       = document.getElementById('chatbot-tip');

  let historial = [];   // [{role, content}]
  let abierta   = false;
  let ocupado   = false;
  let saludado  = false;

  /* ── Utilidades ── */
  function crearMensaje(texto, clase) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + clase;
    div.textContent = texto;
    mensajes.appendChild(div);
    mensajes.scrollTop = mensajes.scrollHeight;
    return div;
  }

  function mostrarEscribiendo() {
    const div = document.createElement('div');
    div.className = 'chat-escribiendo';
    div.id = 'chatbot-escribiendo';
    div.innerHTML = '<span></span><span></span><span></span>';
    mensajes.appendChild(div);
    mensajes.scrollTop = mensajes.scrollHeight;
  }

  function quitarEscribiendo() {
    const div = document.getElementById('chatbot-escribiendo');
    if (div) div.remove();
  }

  /* ── Abrir / cerrar ── */
  function abrir() {
    abierta = true;
    ventana.classList.remove('hidden');
    ventana.setAttribute('aria-hidden', 'false');
    burbuja.classList.add('abierto');
    tip.classList.remove('visible');

    if (!saludado) {
      saludado = true;
      crearMensaje(SALUDO, 'narrador');
    }
    setTimeout(() => input.focus(), 150);
  }

  function cerrar() {
    abierta = false;
    ventana.classList.add('hidden');
    ventana.setAttribute('aria-hidden', 'true');
    burbuja.classList.remove('abierto');
  }

  burbuja.addEventListener('click', () => (abierta ? cerrar() : abrir()));
  cerrarBtn.addEventListener('click', cerrar);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && abierta) cerrar();
  });

  /* Tooltip de invitación: aparece a los 4s y se esconde solo */
  setTimeout(() => {
    if (!abierta) tip.classList.add('visible');
  }, 4000);
  setTimeout(() => tip.classList.remove('visible'), 14000);

  /* ── Enviar mensaje a la IA ── */
  async function preguntarIA(textoUsuario) {
    historial.push({ role: 'user', content: textoUsuario });

    const cuerpo = {
      model: MODELO,
      messages: [
        { role: 'system', content: PERSONALIDAD + '\n--- INFORMACIÓN OFICIAL DEL LIBRO ---' + CONOCIMIENTO },
        ...historial.slice(-MAX_MSJ)
      ],
      temperature: 0.8,
      referrer: 'tiempo-y-vida'
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo)
    });

    if (!res.ok) throw new Error('HTTP ' + res.status);

    const data = await res.json();
    const texto = data?.choices?.[0]?.message?.content;
    if (!texto) throw new Error('Respuesta vacía');

    historial.push({ role: 'assistant', content: texto });
    return texto;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto || ocupado) return;

    input.value = '';
    crearMensaje(texto, 'usuario');

    ocupado = true;
    enviarBtn.disabled = true;
    input.disabled = true;
    mostrarEscribiendo();

    try {
      const respuesta = await preguntarIA(texto);
      quitarEscribiendo();
      crearMensaje(respuesta, 'narrador');
    } catch (err) {
      quitarEscribiendo();
      crearMensaje('El tiempo se detuvo un instante… No pude contactar al Narrador. Revisa tu conexión e inténtalo de nuevo.', 'error');
    } finally {
      ocupado = false;
      enviarBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });

})();
