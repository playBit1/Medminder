const User = require('../models/User');

const getAllMedication = async (req, res) => {
    try {
        const results = await User.getAllUserMedications();
        res.json({ statusCode: 200, data: results, message: 'get all meds success' });
    } catch (err) {
        console.error('Error getting meds:', err);
        res.status(500).json({ statusCode: 500, message: 'Internal server error:' });
    }
}

const addMedication = async (req, res) => {
    try {        
        const user = await User.findOne({ user_email: req.user.user_email });
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

        // Convert medication_name to string to ensure it's a valid key for the map
        const medicationKey = String(medication_name);

        // Add the new medication to the user's medication map
        user.user_medication.set(medicationKey, newMedication);
        await user.save();

        res.status(201).json({ statusCode: 201, data: newMedication, message: 'Medication created successfully' });
    } catch (err) {
        console.error('Error adding med:', err);
        res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
}

module.exports = {
    getAllMedication,
    addMedication
}

