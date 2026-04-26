const validator = require("validator");

const validateSignupData = (req) => {
  const { Name, userName, emailId, password } = req.body;

  if (!Name || !userName || !emailId || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

const validateprofileEditData = (req) => {
  const allowedFields = ["stream", "class"];
  const fieldsToUpdate = Object.keys(req.body);

  const isValidOperation = fieldsToUpdate.every((field) =>
    allowedFields.includes(field),
  );
  return isValidOperation;
};

module.exports = { validateSignupData, validateprofileEditData };
