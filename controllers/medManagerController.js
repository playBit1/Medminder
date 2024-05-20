const User = require('../models/User');
const mongoose = require('mongoose');

const getAllMedication = async (req, res) => {
    try {
        const user = await User.findOne({ user_email: req.user.user_email });

        if (!user) {
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }

        const results = await user.getAllUserMedications();
        res.json({ statusCode: 200, data: results, message: 'get all meds success' });
    } catch (err) {
        console.error('Error getting meds:', err);
        res.status(500).json({ statusCode: 500, message: 'Internal server error:' });
    }
}

const addMedication = async (req, res) => {
    try {        
        const user = await User.findOne({ user_email: req.user.user_email });

        if (!user) {
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }

        const { medication_name, dosage, frequency, time1, time2, time3, time4, start_date, end_date } = req.body;

        // Create a new medication object using the inner schema structure
        const newMedication = {
            medication_name: medication_name,
            dosage: dosage,
            frequency: frequency,
            time: {
                time1: time1,
                time2: time2,
                time3: time3,
                time4: time4,
            },
            start_date: start_date,
            end_date: end_date,
        };

        // Call the addNewMedication method
        await user.addNewMedication(newMedication);

        res.status(201).json({ statusCode: 201, data: newMedication, message: 'Medication created successfully' });
    } catch (err) {
        console.error('Error adding med:', err);
        res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
}


const editMedication = async (req, res) => {
    try {
        const user = await User.findOne({ user_email: req.user.user_email });
    
        if (!user) {
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }

        const { _id, medication_name, dosage, frequency, time1, time2, time3, time4, start_date, end_date } = req.body;
        
        // Create a new medication object using the inner schema structure
        const newMedication = {
            _id: _id,
            medication_name: medication_name,
            dosage: dosage,
            frequency: frequency,
            time: {
                time1: time1,
                time2: time2,
                time3: time3,
                time4: time4,
            },
            start_date: start_date,
            end_date: end_date,
        };

        await user.editMedication(_id, newMedication);
    
        res.status(200).json({ statusCode: 200, data: newMedication, message: 'Medication updated successfully' });
    } catch (err) {
        console.error('Error updating medication:', err);
        res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
};

module.exports = {
    getAllMedication,
    addMedication,
    editMedication
}

