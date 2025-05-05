import { throwResErr } from "../../utils/errHandlingUtils.js";
import pgPool from "./pgPool.js";
import { ensureCourseExistsPG } from "./coursesPG.js";
import { ensureUserExistsPG, ensureUserIsNotAdminPG } from "./usersPG.js";

export async function getCoursesWithStudentPG(userID) {
    await ensureUserExistsPG(userID);

    const { rows: courses } = await pgPool.query({ 
        text: `
            SELECT
                c.course_id, c.title, c.description, c.schedule, c.classroom_number, c.maximum_capacity, c.credit_hours, c.tuition_cost
            FROM
                enrollment e INNER JOIN courses c ON e.course_id = c.course_id
            WHERE
                user_id = $1;
        `,
        values: [userID]
    });

    return courses;
}

export async function getCoursesWithoutStudentPG(userID) {
    await ensureUserExistsPG(userID);

    const { rows: courses } = await pgPool.query({ 
        text: `
            SELECT
                c.course_id, c.title, c.description, c.schedule, c.classroom_number, c.maximum_capacity, c.credit_hours, c.tuition_cost
            FROM
                courses c LEFT JOIN enrollment e ON c.course_id = e.course_id AND e.user_id = $1
            WHERE
                e.user_id IS NULL;
        `,
        values: [userID]
    });

    return courses;
}

export async function getStudentsInCoursePG(courseID) {
    await ensureCourseExistsPG(courseID);

    const { rows: users } = await pgPool.query({ 
        text: `
            SELECT
                e.user_id, u.first_name, u.last_name, u.email
            FROM
                enrollment e INNER JOIN users u ON e.user_id = u.user_id
            WHERE
                course_id = $1;
        `,
        values: [courseID]
    });

    return users;
}

export async function getStudentsNotInCoursePG(courseID) {
    await ensureCourseExistsPG(courseID);

    const { rows: users } = await pgPool.query({ 
        text: `
            SELECT
                u.user_id, u.first_name, u.last_name, u.email
            FROM 
                users u LEFT JOIN enrollment e ON u.user_id = e.user_id AND e.course_id = $1
            WHERE
                e.course_id IS NULL AND u.is_admin = FALSE;
        `,
        values: [courseID]
    });

    return users;
}

export async function getCourseMaxCapacityPG(courseID) {
    const res = await pgPool.query({
        text: "SELECT maximum_capacity FROM courses WHERE course_id = $1;",
        values: [courseID]
    });

    return res.rows[0]?.maximum_capacity ?? null;
}

export async function getCourseUserCountPG(courseID) {
    const res = await pgPool.query({
        text: "SELECT COUNT(*) FROM enrollment WHERE course_id = $1;",
        values: [courseID]
    });

    return res.rows[0]?.count ?? null;
}

export async function enrollStudentInCoursePG(userID, courseID) {
    // Ensure that user and course exist:
    await ensureUserExistsPG(userID);
    await ensureCourseExistsPG(courseID);
    await ensureUserIsNotAdminPG(userID);

    // Ensure that the class is not full yet:
    const spaceLeftInClass = await getCourseMaxCapacityPG(courseID) - await getCourseUserCountPG(courseID);
    if (spaceLeftInClass === 0) throwResErr(409, "Course is full");

    // Update enrollment table:
    try {
        await pgPool.query({
            text: `
                INSERT INTO
                    enrollment (user_id, course_id)
                VALUES
                    ($1, $2);
            `,
            values: [userID, courseID]
        });
    } catch (err) {
        // Error caused when user is already enrolled:
        if (err.message === `duplicate key value violates unique constraint "pk_enrollment"`) {
            err.message = "User already enrolled";
            err.statusCode = 409;
        }
        
        throw err;
    }
}

export async function dropStudentFromCoursePG(userID, courseID) {
    // Handle errors before query:
    await ensureUserExistsPG(userID);
    await ensureCourseExistsPG(courseID);
    if (!(await isStudentEnrolledInCoursePG(userID, courseID))) throwResErr(404, "User was not enrolled to begin with");

    await pgPool.query({
        text: "DELETE FROM enrollment WHERE user_id = $1 AND course_id = $2;",
        values: [userID, courseID]
    });
}


async function isStudentEnrolledInCoursePG(userID, courseID) {
    const res = await pgPool.query({
        text: "SELECT COUNT(*) FROM enrollment WHERE user_id = $1 AND course_id = $2;",
        values: [userID, courseID]
    });

    return res.rows[0].count === "1";
}

export async function dropEveryCourseWithStudentPG(userID) {
    await ensureUserExistsPG(userID);

    await pgPool.query({
        text: "DELETE FROM enrollment WHERE user_id = $1;",
        values: [userID]
    });
}