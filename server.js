const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

//recibe mensajes del formulario
app.post('/contacto', (req, res) => {
    const { nombre, email } = req.body;
    console.log(`Mensaje recibido: ${nombre} <${email}>`);

    res.status(200).json({
        success: true,
        message: `¡Gracias, ${nombre}! Tu mensaje llegó al servidor.`
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});