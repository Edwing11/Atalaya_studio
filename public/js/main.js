import { fetchTestimonios, enviarAAtalayaServer } from './api.js';

const themeToggle = document.getElementById('theme-toggle'); //tema oscuro o claro
const body = document.body;

/**
 * Inicializa las preferencias del usuario guardadas en LocalStorage
 */
function cargarPreferencias() {
    const savedTheme = localStorage.getItem('atalaya_theme');
    const savedName = localStorage.getItem('atalaya_user');
    const welcomeMsg = document.getElementById('welcome-msg');

    // Aplicar tema guardado
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    // Personalizar bienvenida si ya conocemos al usuario
    if (savedName && welcomeMsg) {
        welcomeMsg.textContent = `¡Hola de nuevo, ${savedName}!`;
    }
}

// Evento para cambiar el tema
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // guardar en storage la elección
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('atalaya_theme', theme);
});

/**
 * Carga testimonios desde la API y los inyecta en el DOM
 */
async function renderTestimonios() {
    const container = document.getElementById('grid-testimonios');
    if (!container) return;

    // Feedback visual inicial
    container.innerHTML = '<p>Cargando experiencias de clientes...</p>';

    const data = await fetchTestimonios();
    container.innerHTML = ''; // Limpiar contenedor

    if (data.length === 0) {
        container.innerHTML = '<p>No hay testimonios disponibles en este momento.</p>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('article');
        card.className = 'testimonio-card';

        // Estructura interna del artículo (Microinteracción visual)
        card.innerHTML = `
            <strong>Cliente Satisfecho</strong>
            <p>"${item.body.substring(0, 120)}..."</p>
        `;
        
        container.appendChild(card);
    });
}

const contactForm = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nombreInput = document.getElementById('nombre');
        const emailInput = document.getElementById('email');
        const datos = {
            nombre: nombreInput.value,
            email: emailInput.value
        };

        // Validación de UX (Feedback inmediato)
        if (!datos.email.includes('@')) {
            mostrarFeedback("Por favor, ingresa un correo electrónico válido.", "error");
            return;
        }

        // Microinteracción: Estado de carga
        mostrarFeedback("Enviando mensaje al servidor...", "info");

        // Llamada a la API local (server.js)
        const respuesta = await enviarAAtalayaServer(datos);

        if (respuesta && respuesta.success) {
            // Persistencia: Guardar nombre para personalizar futuras visitas
            localStorage.setItem('atalaya_user', datos.nombre);
            
            mostrarFeedback(respuesta.message, "success");
            contactForm.reset();
        } else {
            mostrarFeedback("Error: No se pudo conectar con el servidor de Atalaya.", "error");
        }
    });
}

/**
 * mostrar mensajes de feedback al usuario
 */
function mostrarFeedback(mensaje, tipo) {
    if (!feedback) return;
    feedback.textContent = mensaje;
    feedback.className = `feedback-msg ${tipo}`; 
}

document.addEventListener('DOMContentLoaded', () => {
    cargarPreferencias();
    renderTestimonios();
});