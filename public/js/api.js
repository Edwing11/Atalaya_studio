
export async function fetchTestimonios() {
    const URL = 'https://jsonplaceholder.typicode.com/posts?_limit=3';
    try {
        const response = await fetch(URL);
        if (!response.ok) throw new Error('Error en la red');
        return await response.json();
    } catch (error) {
        console.error("Error al cargar testimonios:", error);
        return [];
    }
}

export async function enviarAAtalayaServer(datos) {
    const URL_LOCAL = 'http://localhost:3000/contacto';
    
    try {
        const response = await fetch(URL_LOCAL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        return await response.json();
    } catch (error) {
        console.error("Error de conexión con el servidor local:", error);
        return { success: false, message: "No se pudo contactar al servidor." };
    }
}