import pgPool from "./pgPool.js";
import { throwResErr } from "../../utils/generalUtils.js";

export async function getCoursePG(courseID) {
    const res = await pgPool.query({
        text: "SELECT * FROM courses WHERE course_id = $1;",
        // text: `

        // `,
        values: [courseID]
    });

    return res.rows[0] ?? null; // Return course data
}

export async function searchCoursesPG(searchTerm) {
    searchTerm = searchTerm ?? ""; // This ensures that the keyword is not undefined.

    const { rows: courses } = await pgPool.query({
        // text: "SELECT * FROM courses WHERE course_id ILIKE $1 OR title ILIKE $1;",
        text: `
            SELECT
                course_id,
                title,
                description,
                schedule,
                classroom_number,
                
                -- Find the spots_available:
                (SELECT
                    maximum_capacity - (SELECT COUNT(*) FROM enrollment e WHERE e.course_id = c.course_id)::SMALLINT
                AS
                    spots_available),
                
                maximum_capacity,
                credit_hours,
                tuition_cost
            FROM
                courses c
            WHERE
                course_id ILIKE $1 OR title ILIKE $1;
        `,
        values: [`%${searchTerm}%`]
    });

    return courses;
}

export async function createCoursePG(courseData) {
    // if (await doesCourseExistPG(courseData.course_id)) throwResErr(409, "Course already exists");

    try {
        await pgPool.query({
            text: `
                INSERT INTO
                    courses (course_id, title, description, schedule, classroom_number, maximum_capacity, credit_hours, tuition_cost)
                VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8);
            `,
            values: [
                courseData.course_id,
                courseData.title,
                courseData.description,
                courseData.schedule,
                courseData.classroom_number,
                courseData.maximum_capacity,
                courseData.credit_hours,
                courseData.tuition_cost
            ]
        });
    } catch (err) {
        // Error caused when user is already enrolled:
        if (err.message === `duplicate key value violates unique constraint "courses_pkey"`) {
            err.message = `Course already exists`;
            err.statusCode = 409;
        }

        throw err;
    }
}

export async function updateCoursePG(courseID, newCourseData) {
    const oldCourseData = await getCoursePG(courseID);

    newCourseData = {
        ...oldCourseData,
        ...newCourseData
    };

    await pgPool.query({
        text: `
            UPDATE
                courses
            SET
                title = $1,
                description = $2,
                schedule = $3,
                classroom_number = $4,
                maximum_capacity = $5,
                credit_hours = $6,
                tuition_cost = $7
            WHERE
                course_id = $8;
        `,
        values: [
            newCourseData.title,
            newCourseData.description,
            newCourseData.schedule,
            newCourseData.classroom_number,
            newCourseData.maximum_capacity,
            newCourseData.credit_hours,
            newCourseData.tuition_cost,
            courseID
        ]
    });
}

export async function deleteCoursePG(courseID) {

}

// export async function doesCourseExistPG(courseID) {
//     const courses = await searchCoursesPG(courseID);

//     return courses[0] !== undefined;
// }

export async function ensureCourseExistsPG(courseID) {
    const course = await getCoursePG(courseID);
    
    if (!course) throwResErr(404, `Course (with course_id "${courseID}") does not exist`);
}