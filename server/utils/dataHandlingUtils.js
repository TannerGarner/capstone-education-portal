import Joi from "joi";
import bcrypt from "bcrypt";
import { throwResErr } from "./errHandlingUtils.js";

// Delete This:
// export function sanitizeAndOrganizeUserData(userData) {
//     return organizeUserData(sanitizeUserData(userData));
// }

export function sanitizeUserData(req) {
    // Extract main request data:
    const userData = req.body;
    userData.user_id = +(req.params.userID);

    // Ensure that the user ID is a number:
    if (isNaN(userData.user_id)) throwResErr(400, "Non-numeric user ID");

    // Use password key (if present) to update password_hash:
    if ("password" in userData) {
        userData.password_hash = bcrypt.hashSync(userData.password, 10);
        delete userData.password;
    }

    // // Ensure user_id and password are removed from userData:
    // delete userData.user_id;
    // delete userData.password;

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
    if (err) throwResErr(400, `Invalid userData: ${err.details[0].message}`);
    
    // Ensure the user's role isn't changed:
    if ("is_admin" in userData) {
        const { sub, isAdmin } = req.auth;

        if (userData.is_admin !== isAdmin && (!isAdmin || +(sub) === userData.user_id)) throwResErr(403, "User cannot change their role");
    }
    
    return userData;
    // return {
    //     userID: userID,
    //     userData: sanitizedUserData
    // };
}

// Delete This:
// function organizeUserData(userData) {
//     // Initialize separated user data objects:
//     const generalData = {
//         first_name: null,
//         last_name: null,
//         password_hash: null,
//         email: null,
//         phone_number: null,
//         is_admin: null
//     };
//     const addressData = {
//         street: null,
//         city: null,
//         state_or_region: null,
//         country: null
//     };

//     // Separate the values from userData into generalData and addressData:
//     Object.entries(userData).forEach(([key, value]) => {
//         if (key in generalData) generalData[key] = value;
//         else if (key in addressData) addressData[key] = value;
//     });

//     // Return the organized data:
//     return { generalData, addressData };
// }