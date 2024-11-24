const adminMiddleware = async (req, res, next) => {
    try {
        const { isAdmin, isRector, isHighAuth } = req.user; // Destructure roles from the user object
        
        // Check if any of the roles is true
        if (!(isAdmin || isRector || isHighAuth)) {
            return res.status(403).json({ message: "Access denied. User does not have sufficient privileges." });
        }
        
        // If any role is true, proceed to the next middleware
        next();
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};

module.exports = adminMiddleware;
