// ============================================
// EL VLOG DEL CADDIE - TODAS LAS FUNCIONALIDADES
// ============================================

// ========== 1. MODO OSCURO / CLARO ==========
function iniciarModoOscuro() {
    const toggleBtn = document.getElementById('themeToggle');
    const modoActual = localStorage.getItem('tema');
    
    if (modoActual === 'dark') {
        document.body.classList.add('dark-mode');
        toggleBtn.textContent = '☀️';
    } else {
        toggleBtn.textContent = '🌙';
    }
    
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('tema', isDark ? 'dark' : 'light');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
    });
}

// ========== 2. BOTÓN VOLVER ARRIBA ==========
function iniciarVolverArriba() {
    const btnVolver = document.getElementById('btnVolverArriba');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btnVolver.style.display = 'block';
        } else {
            btnVolver.style.display = 'none';
        }
    });
    
    btnVolver.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== 3. CARRUSEL DE IMÁGENES ==========
function iniciarCarrusel() {
    const slides = document.getElementById('carruselSlides');
    if (!slides) return;
    
    let index = 0;
    const totalSlides = document.querySelectorAll('.carrusel-slide').length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    function actualizarCarrusel() {
        slides.style.transform = `translateX(-${index * 100}%)`;
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            index = (index > 0) ? index - 1 : totalSlides - 1;
            actualizarCarrusel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            index = (index < totalSlides - 1) ? index + 1 : 0;
            actualizarCarrusel();
        });
    }
    
    // Auto avance cada 5 segundos
    setInterval(() => {
        if (nextBtn) {
            index = (index < totalSlides - 1) ? index + 1 : 0;
            actualizarCarrusel();
        }
    }, 5000);
}

// ========== 4. GALERÍA INTERACTIVA ==========
function iniciarGaleria() {
    const miniaturas = document.querySelectorAll('.miniatura');
    const imagenPrincipal = document.getElementById('imagenPrincipal');
    
    if (!miniaturas.length || !imagenPrincipal) return;
    
    miniaturas.forEach(mini => {
        mini.addEventListener('click', () => {
            const nuevaImg = mini.getAttribute('data-img');
            imagenPrincipal.src = nuevaImg;
            
            miniaturas.forEach(m => m.classList.remove('activa'));
            mini.classList.add('activa');
        });
    });
}

// ========== 5. LISTA DINÁMICA ==========
function iniciarListaDinamica() {
    const btnAgregar = document.getElementById('btnAgregar');
    const inputItem = document.getElementById('nuevoItem');
    const listaItems = document.getElementById('listaItems');
    
    if (!btnAgregar || !inputItem || !listaItems) return;
    
    // Cargar lista guardada
    const listaGuardada = localStorage.getItem('listaTips');
    if (listaGuardada) {
        listaItems.innerHTML = listaGuardada;
        agregarEventosEliminar();
    }
    
    function guardarLista() {
        localStorage.setItem('listaTips', listaItems.innerHTML);
    }
    
    function agregarEventosEliminar() {
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                this.parentElement.remove();
                guardarLista();
            });
        });
    }
    
    btnAgregar.addEventListener('click', () => {
        const texto = inputItem.value.trim();
        if (texto === '') {
            alert('Escribe un tip para agregar');
            return;
        }
        
        const nuevoLi = document.createElement('li');
        nuevoLi.innerHTML = ` ${texto} <button class="btn-eliminar">Eliminar</button>`;
        listaItems.appendChild(nuevoLi);
        inputItem.value = '';
        guardarLista();
        agregarEventosEliminar();
    });
    
    agregarEventosEliminar();
}

// ========== 6. CONTADOR DE RESPUESTAS (QUIZ) ==========
function iniciarQuiz() {
    const radios = document.querySelectorAll('input[type="radio"]');
    const contadorDiv = document.getElementById('contadorRespuestas');
    
    if (!radios.length || !contadorDiv) return;
    
    function contarRespuestas() {
        const preguntas = document.querySelectorAll('.pregunta');
        let respondidas = 0;
        
        preguntas.forEach(pregunta => {
            const radiosPregunta = pregunta.querySelectorAll('input[type="radio"]');
            let estaRespondida = false;
            radiosPregunta.forEach(radio => {
                if (radio.checked) estaRespondida = true;
            });
            if (estaRespondida) respondidas++;
        });
        
        contadorDiv.textContent = `Respuestas seleccionadas: ${respondidas} / ${preguntas.length}`;
    }
    
    radios.forEach(radio => {
        radio.addEventListener('change', contarRespuestas);
    });
    
    contarRespuestas();
}

// ========== 7. BOTÓN ME GUSTA CON LOCALSTORAGE ==========
function iniciarLike() {
    const btnLike = document.getElementById('btnLike');
    const likeCount = document.getElementById('likeCount');
    
    if (!btnLike || !likeCount) return;
    
    let likes = localStorage.getItem('likesGolf');
    if (likes === null) likes = 0;
    else likes = parseInt(likes);
    
    likeCount.textContent = `${likes} likes`;
    
    btnLike.addEventListener('click', () => {
        likes++;
        likeCount.textContent = `${likes} likes`;
        localStorage.setItem('likesGolf', likes);
        
        // Animación
        btnLike.classList.add('liked');
        setTimeout(() => btnLike.classList.remove('liked'), 300);
    });
}

// ========== 8. VALIDACIÓN DE FORMULARIO ==========
function iniciarValidacionFormulario() {
    const form = document.getElementById('formularioContacto');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let esValido = true;
        
        // Validar nombre
        const nombre = document.getElementById('nombre');
        const errorNombre = document.getElementById('errorNombre');
        if (!nombre.value.trim()) {
            errorNombre.textContent = 'El nombre es obligatorio';
            nombre.classList.add('error');
            esValido = false;
        } else {
            errorNombre.textContent = '';
            nombre.classList.remove('error');
        }
        
        // Validar email
        const email = document.getElementById('email');
        const errorEmail = document.getElementById('errorEmail');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            errorEmail.textContent = 'El email es obligatorio';
            email.classList.add('error');
            esValido = false;
        } else if (!emailRegex.test(email.value)) {
            errorEmail.textContent = 'Formato de email inválido';
            email.classList.add('error');
            esValido = false;
        } else {
            errorEmail.textContent = '';
            email.classList.remove('error');
        }
        
        // Validar mensaje
        const mensaje = document.getElementById('mensaje');
        const errorMensaje = document.getElementById('errorMensaje');
        if (!mensaje.value.trim()) {
            errorMensaje.textContent = 'El mensaje es obligatorio';
            mensaje.classList.add('error');
            esValido = false;
        } else if (mensaje.value.trim().length < 10) {
            errorMensaje.textContent = 'El mensaje debe tener al menos 10 caracteres';
            mensaje.classList.add('error');
            esValido = false;
        } else {
            errorMensaje.textContent = '';
            mensaje.classList.remove('error');
        }
        
        // Validar newsletter
        const newsletter = document.querySelector('input[name="newsletter"]:checked');
        const errorNewsletter = document.getElementById('errorNewsletter');
        if (!newsletter) {
            errorNewsletter.textContent = 'Por favor, indica si deseas recibir newsletters';
            esValido = false;
        } else {
            errorNewsletter.textContent = '';
        }
        
        if (esValido) {
            alert(' Formulario enviado correctamente. ¡Gracias por contactarnos!');
            form.reset();
        } else {
            alert(' Por favor, corrige los errores en el formulario');
        }
    });
    
    // Limpiar errores al escribir
    const inputs = document.querySelectorAll('#formularioContacto input, #formularioContacto textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorDiv = this.parentElement.querySelector('.error-message');
            if (errorDiv) errorDiv.textContent = '';
        });
    });
}

// ========== 9. CONFIRMAR SALIDA A ENLACES EXTERNOS ==========
function iniciarConfirmacionEnlaces() {
    const enlacesExternos = document.querySelectorAll('.enlace-externo');
    
    enlacesExternos.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            const confirmar = confirm('¿Estás seguro de que deseas salir de este sitio?');
            if (!confirmar) {
                e.preventDefault();
            }
        });
    });
}

// ========== INICIALIZAR TODAS LAS FUNCIONES ==========
document.addEventListener('DOMContentLoaded', () => {
    iniciarModoOscuro();
    iniciarVolverArriba();
    iniciarCarrusel();
    iniciarGaleria();
    iniciarListaDinamica();
    iniciarQuiz();
    iniciarLike();
    iniciarValidacionFormulario();
    iniciarConfirmacionEnlaces();
});