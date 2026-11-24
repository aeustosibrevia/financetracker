process.loadEnvFile();

const app = require("./app");
const pool = require("./src/config/db");

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        console.log("MySQL connected");
    } catch (err) {
        console.error("MySQL connection failed:", err.message);
        process.exit(1);
    }

    const server = app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });

    const shutdown = () => {
        server.close(async () => {
            await pool.end();
            process.exit(0);
        });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
};

start();
