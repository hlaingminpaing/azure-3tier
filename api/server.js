const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const { DefaultAzureCredential } = require('@azure/identity');
const { Connection, Request } = require('tedious');

const app = express();
app.use(cors());
app.use(express.json());


// // SQL connection config (no password here)
// const config = {
//     server: process.env.DB_SERVER,
//     authentication: {
//         type: 'azure-active-directory-msi-app-service'
//     },
//     options: {
//         database: process.env.DB_NAME,
//         encrypt: true
//     }
// };

// const config = {
//     server: process.env.DB_SERVER, // e.g., "poc-sql-server.privatelink.database.windows.net"
//     authentication: {
//         type: 'azure-active-directory-msi-app-service'
//     },
//     options: {
//         database: process.env.DB_NAME, // e.g., "pocdb"
//         encrypt: true,                 // required for Azure SQL
//         port: 1433
//     }
// };

const sql = require('mssql');

const pool = new sql.ConnectionPool(process.env.DefaultConnection);


app.get('/api/products', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT ProductID, ProductName FROM Products');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).send("Product name is required");

        const pool = await sql.connect(config);
        await pool.request()
            .input('name', sql.NVarChar, name)
            .query('INSERT INTO Products (ProductName) VALUES (@name)');

        res.status(201).send({ message: 'Product added successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.listen(process.env.PORT || 8080, () => {
    console.log('API running...');
});
