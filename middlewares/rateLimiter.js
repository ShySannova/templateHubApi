const requestCounts = {};

const rateLimiter = (maxRequests, timeWindow) => {
    const middleware = (req, res, next) => {
        const { ip } = req;

        const currentTime = new Date().getTime();
        const lastRequest = requestCounts[ip] || { time: 0, count: 0 };

        // Check if the time window has passed since the last request
        if (currentTime - lastRequest.time > timeWindow) {
            requestCounts[ip] = { time: currentTime, count: 1 }; // Reset the request count for the new time window
        } else {
            requestCounts[ip].count++; // Increment the request count

            // Check if the request limit has been reached
            if (requestCounts[ip].count > maxRequests) {
                return res.status(429).json({ error: 'Too many requests' });
            }
        }

        // Log for debugging
        // console.log(`IP: ${ip}, Request Count: ${requestCounts[ip].count}`); 

        next();
    };

    return middleware;
};

module.exports = rateLimiter;
