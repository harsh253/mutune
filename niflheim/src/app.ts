import express from 'express';
import db from './db';
import middlewares from './middlewares/index';

const app = express();
const PORT = 3002;

const initApp = async () => {
    try {
        await db.initDb()
    } catch (err) {
        console.error('Could not initiate database connection')
        process.exit()
    }

    try {
        middlewares.forEach((middleware) => {
            app.use(middleware);
        })
    } catch (err) {
        console.error("Could not initiate app ")
        console.error(err)
    }
}

app.listen(PORT, async () => {
    try {
        await initApp()
        console.log("Niflheim listening on ", PORT)
    } catch (err) {
        console.error('Something went wrong initiating the app')
    }
});