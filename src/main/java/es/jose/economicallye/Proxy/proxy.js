/*
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/api/ipc", async (req, res) => {
    try {
        const response = await fetch("https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/IPC251856");
        if (!response.ok) {
            // Muestra el status y texto de error si la API del INE falla
            const errorText = await response.text();
            console.error("INE API error:", response.status, errorText);
            return res.status(502).json({ error: `INE API error: ${response.status} - ${errorText}` });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Proxy escuchando en puerto 3000"));

 */