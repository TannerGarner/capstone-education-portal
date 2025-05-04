import Joi from "joi";
import bcrypt from "bcrypt";
import { throwResErr } from "../utils/errHandlingUtils.js";

export function sanitizeUserData(req) {
    // Extract user data request data:
    const userData = req.body;

    // Use password key (if present) to update password_hash:
    if ("password" in userData) {
        userData.password_hash = bcrypt.hashSync(userData.password, 10);
        delete userData.password;
    }

    function nullifyEmptyOrWhitespaceStrs(value) {
        if (typeof value === "string") {
            value = value.trim();
            if (!value) return null;
        }

        return value;
    }

    // Validate the userData:
    const userDataSchema = Joi.object({
        city: Joi.string()
            .allow(null)
            .empty("")
            .custom(nullifyEmptyOrWhitespaceStrs, "nullify empty strings")
            .default(null),
        country: Joi.string()
            .allow(null)
            .empty("")
            .custom(nullifyEmptyOrWhitespaceStrs, "nullify empty strings")
            .default(null),
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
            .empty("")
            .custom(nullifyEmptyOrWhitespaceStrs, "nullify empty strings")
            .default(null),
        street: Joi.string()
            .allow(null)
            .empty("")
            .custom(nullifyEmptyOrWhitespaceStrs, "nullify empty strings")
            .default(null),
        user_id: Joi.number()
            .integer()
            .required()
    }).options({ stripUnknown: true });
    const { error: err, value: sanitizedUserData } = userDataSchema.validate(userData);

    console.log("sanitizedUserData:", sanitizedUserData);

    // Handle errors validating the data or return the data:
    if (err) throwResErr(400, `User data doesn't follow user schema: ${err.details[0].message}`);
    
    // Ensure the user's role isn't changed, and ensure new users can only be admins if created by admins:
    if (req.auth) {
        const { sub, isAdmin } = req.auth;

        if (sanitizedUserData.is_admin !== isAdmin && (!isAdmin || +(sub) === sanitizedUserData.user_id)) {
            throwResErr(403, "User cannot change their own role");
        }
    } else if (sanitizedUserData.is_admin) throwResErr(403, "Lacks authority to be an admin (no JWT)");
    
    // Return sanitized user data:
    return sanitizedUserData;
}