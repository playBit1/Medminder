const User = require('../models/User');
var nodemailer = require('nodemailer');

const findUserByEmail = async (email) => {
    return await User.findOne({ user_email: email });
};

const handleErrorResponse = (res, err, message) => {
    res.status(500).json({ statusCode: 500, message: 'Internal server error' + message });
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
        const result = await user.addNewMedication(newMedication);

        res.status(200).json({ statusCode: 200, data: result.data, message: 'Medication created successfully' });
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

const sendEmail = (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // handle base64 pdf 
    const pdfBase64 = req.body.pdf;
    const pdfBuffer = Buffer.from(pdfBase64.split(",")[1], 'base64');

    var mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.user.user_email,
        subject: 'Medication Records',
        text: 'Please find attached the medication records.',
        attachments: [
            {
                filename: 'medication_records.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf'
            }
        ]
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.status(500).json({ statusCode: 500, message: 'Failed to send email', error: error.message });
        } else {
            res.status(200).json({ statusCode: 200, message: 'Email sent successfully' });
        }
    });
};


module.exports = {
    getAllMedication,
    addMedication,
    editMedication,
    deleteMedication,
    sendEmail
}

