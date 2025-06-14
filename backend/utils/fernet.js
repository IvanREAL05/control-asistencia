const crypto = require('crypto');
const { Buffer } = require('buffer');
const { createDecipheriv } = require('crypto');
const fernet = require('fernet');

// ⚠️ Sustituye esta clave por la que imprimiste al generar los QR
const SECRET_KEY = "iPMTcqaeqCguTEbEm3Q_ra0ZtUYDgMSiJLmoFmkyeXE=";

const secret = new fernet.Secret(SECRET_KEY);

function decryptQR(encrypted) {
    try {
        const token = new fernet.Token({
            secret: secret,
            token: encrypted,
            ttl: 0 // sin expiración
        });

        return token.decode();
    } catch (err) {
        console.error("Error desencriptando QR:", err);
        throw new Error("QR inválido o clave incorrecta");
    }
}

module.exports = { decryptQR };