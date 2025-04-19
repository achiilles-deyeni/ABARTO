const bcrypt = require("bcryptjs");

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} The hashed password.
 */
const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password is required for hashing.");
  }
  const salt = await bcrypt.genSalt(10); // 10 rounds is generally recommended
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed password.
 * @param {string} enteredPassword - The plain text password entered by the user.
 * @param {string} hashedPassword - The stored hashed password.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */
const comparePassword = async (enteredPassword, hashedPassword) => {
  if (!enteredPassword || !hashedPassword) {
    return false; // Cannot compare if either is missing
  }
  return bcrypt.compare(enteredPassword, hashedPassword);
};

// Add other security-related utilities here as needed (e.g., JWT functions)

module.exports = {
  hashPassword,
  comparePassword,
};
