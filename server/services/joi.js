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

    // Validate the user data:
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

    // Handle validation errors:
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

export function sanitizeCourseData(req) {
    // Extract user data request data:
    const courseData = req.body;

    // Validate the course data:
    const courseSchema = Joi.object({
        classroom_number: Joi.string()
            .required(),
        course_id: Joi.string()
            .required(),
        credit_hours: Joi.number()
            .integer()
            .min(1)
            .required(),
        description: Joi.string()
            .allow(null)
            .empty("")
            .custom(nullifyEmptyOrWhitespaceStrs, "nullify empty strings")
            .default(null),
        maximum_capacity: Joi.number()
            .integer()
            .min(1)
            .required(),
        schedule: Joi.string()
            .required()
            .custom(ensureScheduleIsCorrect, "validate schedule format"),
        title: Joi.string()
            .required(),
        tuition_cost: Joi.string()
            .required()
        // tuition_cost: Joi.number()
        //     .precision(2)
        //     .min(0)
        //     .required()
    }).options({ stripUnknown: true });
    const { error: err, value: sanitizedCourseData } = courseSchema.validate(courseData);

    // Handle validation errors:
    if (err) throwResErr(400, `Course data doesn't follow course schema: ${err.details[0].message}`);

    // Return sanitized course data:
    return sanitizedCourseData;
}

function nullifyEmptyOrWhitespaceStrs(value) {
    if (typeof value === "string") {
        value = value.trim();
        if (!value) return null;
    }
    return value;
}

function ensureScheduleIsCorrect(value, helpers) {
    const validScheduleRegex = /^(MWF|TTH|MTWTHF)\s(1?\d)-(1?\d)$/;
    
    // Test if the value is a valid schedule:
    if (validScheduleRegex.test(value)) {
        // Get the parts (groups) of the validated schedule:
        const regexGroups = value.match(validScheduleRegex);

        // Declare function to take numbers from 1 PM to 6 PM, and write them in military time:
        function convertToMilitaryTime(timeStr) {
            let timeNum = +(timeStr);
            if (1 <= timeNum && timeNum <= 6) timeNum += 12;
            return timeNum;
        }

        // Get the start and end times from regexGroups:
        const startTime = convertToMilitaryTime(regexGroups[2]);
        const endTime = convertToMilitaryTime(regexGroups[3]);

        // Test if startTime is less than endTime, and that they are each between 7 AM to 6 PM:
        if (7 <= startTime && startTime < endTime && endTime <= 18) return value;
    }

    // If the value is invalid, return this helper message:
    return helpers.message(`"schedule" in an invalid format`);
    // return helpers.message(`schedule must be in format: "MWF 9-10", "TTH 10-11", or "MTWTHF 8-9" with hours between 7 AM and 6 PM`);
}