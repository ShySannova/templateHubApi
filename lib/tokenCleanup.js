const mongoose = require('mongoose');
const User = require('../model/Users');
const cleanupExpiredRefreshTokens = async () => {
    try {
        const expiredTokens = await User.find({
            'refreshToken': { $lt: new Date() },
        });

        for (const user of expiredTokens) {
            // Remove expired refresh tokens from the user's record
            user.refreshToken = user.refreshToken.filter(
                (token) => token.expiresAt >= new Date()
            );

            // Save the updated user record
            await user.save();
        }

        console.log('Expired refresh tokens cleaned up successfully.');
    } catch (error) {
        console.error('Error cleaning up expired refresh tokens:', error);
    }
}

// Run the cleanup job every hour
setInterval(cleanupExpiredRefreshTokens, 60 * 60 * 1000); //1hr inteval

// Initial cleanup on server start
// cleanupExpiredRefreshTokens();

module.exports = { cleanupExpiredRefreshTokens }