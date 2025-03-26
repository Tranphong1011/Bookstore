import bcrypt from "bcryptjs";

// Middleware to hash password before saving
const hashPassword = async (req, res, next) => {
    try {
        if (req.body.password) {
            // Generate salt with 10 rounds
            const salt = await bcrypt.genSalt(10);
            // Hash the password
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        next();
    } catch (error) {
        return res.status(500).send('Error hashing password');
    }
};

// Middleware to verify password
const verifyPassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error('Error verifying password');
    }
};

export { hashPassword, verifyPassword };