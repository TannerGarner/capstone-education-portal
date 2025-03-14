import { throwResErr } from "../../utils/generalUtils.js";
import pgPool from "./pgPool.js";
import { doesCourseExistPG } from "./coursesCRUD.js";
import { getUserPG } from "./usersCRUD.js";
import logger from "../../logging/logger.js";

export async function getCoursesForUserPG(userID) {
    const { rows } = await pgPool.query({ 
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

    return rows;
}

export async function getUsersForCoursePG(courseID) {
    const { rows } = await pgPool.query({ 
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

    return rows;
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

export async function isUserEnrolledInCoursePG(userID, courseID) {
    const res = await pgPool.query({
        text: "SELECT COUNT(*) FROM enrollment WHERE user_id = $1 AND course_id = $2;",
        values: [userID, courseID]
    });

    return res.rows[0].count === "1";
}

async function ensureUserAndCourseExist(userID, courseID) {
    if (!(await getUserPG(userID))) throwResErr(404, `User (with user_id "${userID}") does not exist`);
    if (!(await doesCourseExistPG(courseID))) throwResErr(404, `Course (with course_id "${courseID}") does not exist`);
}

export async function enrollPG(userID, courseID) {
    // Ensure that user and course exist:
    await ensureUserAndCourseExist(userID, courseID);

    // Ensures that the class is not full yet:
    const spaceLeftInClass = await getCourseMaxCapacityPG(courseID) - await getCourseUserCountPG(courseID);
    if (spaceLeftInClass === 0) throwResErr(409, "Course is full");

    // Updates enrollment table:
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
        // Reformat error caused when user is already enrolled:
        if (err.message === `duplicate key value violates unique constraint "pk_enrollment"`) {
            err.message = "User already enrolled";
            err.statusCode = 409;
        }
        
        throw err;
    }
}

export async function dropPG(userID, courseID) {
    // Ensure that user and course exist:
    ensureUserAndCourseExist(userID, courseID);

    await pgPool.query({
        text: ``,
        values: []
    });
}