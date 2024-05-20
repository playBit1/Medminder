const User = require('../models/User');

const findUserByEmail = async (email) => {
    return await User.findOne({ user_email: email });
};

const handleErrorResponse = (res, err, message) => {
    console.error(message, err);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
};

const getAllMedication = async (req, res) => {
    try {
        const user = await findUserByEmail(req.user.user_email);

        if (!user) {
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }

        const results = await user.getAllUserMedications();
        res.json({ statusCode: 200, data: results, message: 'get all meds success' });
    } catch (err) {
        handleErrorResponse(res, err, 'Error getting meds:');
    }
}

const addMedication = async (req, res) => {
    try {        
        const user = await findUserByEmail(req.user.user_email);

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

        // Call the addNewMedication method in User.js
        await user.addNewMedication(newMedication);

        res.status(201).json({ statusCode: 201, data: newMedication, message: 'Medication created successfully' });
    } catch (err) {
        handleErrorResponse(res, err, 'Error adding med:');
    }
}


const editMedication = async (req, res) => {
    try {
        const user = await findUserByEmail(req.user.user_email);
    
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
        handleErrorResponse(res, err, 'Error updating medication:');
    }
};

const deleteMedication = async (req, res) => {
    try {
        const user = await findUserByEmail(req.user.user_email);
    
        if (!user) {
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }

        const medication_id = req.body._id;

        await user.deleteMedication(medication_id);

        res.status(200).json({ statusCode: 200, message: 'Medication deleted successfully' });

    } catch (err) {
        handleErrorResponse(res, err, 'Error deleting medication:');
    }
}

module.exports = {
    getAllMedication,
    addMedication,
    editMedication,
    deleteMedication
}

