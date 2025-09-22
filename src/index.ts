import express from 'express';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import blockRouter from "./routes/block-router.js";
import apiBlockRouter from "./routes/api-block-router.js";
import accountRouter from "./routes/account-router.js";
import apiAccountRouter from "./routes/api-account-router.js";
import {SELECTED_RPC_URL, SELECTED_PROVIDER_URL, SELECTED_PROVIDER} from './utils/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use( express.static(path.join(__dirname, '..', 'static')));
app.use('/bootstrap', express.static(path.join(__dirname, '..', 'node_modules/bootstrap/dist')));
app.use('/handlebars', express.static(path.join(__dirname, '..', 'node_modules/handlebars/dist')));
app.use('/ethers', express.static(path.join(__dirname, '..', 'node_modules/ethers/dist')));
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));
app.use('/block', blockRouter);
app.use('/account', accountRouter);
app.use('/api/block', apiBlockRouter);
app.use('/api/account', apiAccountRouter);


app.listen(port, async () => {
    console.log(`🌐 Server started on http://localhost:${port}`);
    console.log(`🌐 RPC: ${SELECTED_RPC_URL}`);
    console.log(`🌐 Provider: ${SELECTED_PROVIDER}`);
    console.log(`🌐 Provider url: ${SELECTED_PROVIDER_URL.slice(0, SELECTED_PROVIDER_URL.length - 10)}**********`);
});
