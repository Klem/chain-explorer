import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve account.html when user navigates to /account/:address
router.get('/:address', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../static/account.html'));
});
export default router;
