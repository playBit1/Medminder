const User = require('../models/User');

const findUserByEmail = async (email) => {
    return await User.findOne({ user_email: email });
};

const handleErrorResponse = (res, err, message) => {
    console.error(message, err);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
};

const getAllNotifications = async (req, res) => {
    try {
        const user = await findUserByEmail(req.user.user_email);

        if (!user) {
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }

        const results = await user.getAllNotifications();
        res.json({ statusCode: 200, data: results, message: 'get all notifications success' });
    } catch (err) {
        handleErrorResponse(res, err, 'Error getting notifications:');
    }
}

const updateNotificationStatus = async (req, res) => {
    try {
        const user = await findUserByEmail(req.user.user_email);

        if (!user) {
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }

        const { notificationId, status } = req.body;

        await user.updateNotificationStatus(notificationId, status);

        res.json({ statusCode: 200, message: 'update notification status success' });
    } catch (err) {
        handleErrorResponse(res, err, 'Error updating notifications:');
    }
}

module.exports = {
    getAllNotifications,
    updateNotificationStatus
}