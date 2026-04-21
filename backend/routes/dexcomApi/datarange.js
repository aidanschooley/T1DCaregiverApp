import { Router } from 'express';
import tokenService from '../../services/dexcom/tokenService.js'
import {fetchDataRange} from '../../services/dexcom/fetchDataRange.js'
const router = Router();

router.get('/dataRange', async (req, res) => {
    try {
        const AuthToken = await tokenService()
        const data = await fetchDataRange(AuthToken);
        res.send(data);
    } catch (error) {
        console.error('Error fetching data range:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router