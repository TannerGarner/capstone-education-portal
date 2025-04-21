import Joi from "joi";
import bcrypt from "bcrypt";
import { throwResErr } from "./errHandlingUtils.js";

export function sanitizeUserData(req) {
    // Extract main request data:
    const userData = req.body;
    userData.user_id = req.params.userID;

    // Use password key (if present) to update password_hash:
    if ("password" in userData) {
        userData.password_hash = bcrypt.hashSync(userData.password, 10);
        delete userData.password;
    }

    // Validate the userData:
    const userDataSchema = Joi.object({
        city: Joi.string()
            .allow(null)
            .required(),
        country: Joi.string()
            .allow(null)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        first_name: Joi.string()
            .required(),
        is_admin: Joi.boolean()
            .required(),
        last_name: Joi.string()
            .required(),
        password_hash: Joi.string()
            .optional(),
        phone_number: Joi.string()
            .required(),
        state_or_region: Joi.string()
            .allow(null)
            .required(),
        street: Joi.string()
            .allow(null)
            .required(),
        user_id: Joi.number()
            .integer()
    });
    const { error: err, value: sanitizedUserData } = userDataSchema.validate(userData);

    // Handle errors validating the data or return the data:
    if (err) throwResErr(400, `User data doesn't follow user schema: ${err.details[0].message}`);
    
    // Ensure the user's role isn't changed:
    if ("is_admin" in sanitizedUserData) {
        const { sub, isAdmin } = req.auth;

        if (sanitizedUserData.is_admin !== isAdmin && (!isAdmin || +(sub) === sanitizedUserData.user_id)) {
            throwResErr(403, "User cannot change their role");
        }
    }
    
    // Return sanitized user data:
    return sanitizedUserData;
}