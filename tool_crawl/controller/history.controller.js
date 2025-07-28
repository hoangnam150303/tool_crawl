const History = require("../models/History");

exports.createHistory = async (userId, action) => {
    try {
        if (!userId || !action) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const response = await History.create({ user_id: userId, action });
        return response;
    } catch (error) {
        
    }
};