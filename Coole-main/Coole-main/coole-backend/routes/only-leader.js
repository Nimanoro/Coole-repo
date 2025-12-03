const express = require('express');
const auth= require('../middleware/auth');
const authRole = require('../middleware/authRole');
const Trip = require('../models/trip');

const router = express.Router();

router.get('/only-leader/:id', auth,  authRole('Leader'), async (req, res) => {
    try {
        const { id } = req.params; 
        const { userId } = req.user;

        const trip = await Trip.findById(id).lean();
        if (!trip) {
            console.log('Trip not found');
            return res.status(404).json({ error: 'Trip not found' });
        }
        if (trip.createdBy.toString() !== userId) {
            console.log('You are not the leader of this trip');
            return res.status(403).json({ error: 'You are not the leader of this trip' });
        }
        res.status(200).json({ message: '✅ Only leader can access this route' });
    } catch (error) {
        console.error('Only Leader Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
module.exports = router;
