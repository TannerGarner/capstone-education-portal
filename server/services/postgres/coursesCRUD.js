import pgPool from "./pgPool.js";
import { throwResErr } from "../../utils/generalUtils.js";

export async function getCoursePG(courseID) {
    const res = await pgPool.query({
        text: "SELECT * FROM courses WHERE course_id = $1;",
        values: [courseID]
    });

    return res.rows[0] ?? null; // Return course data
}

export async function searchCoursesPG(searchTerm) {
    searchTerm = searchTerm ?? ""; // This ensures that the keyword is not undefined.

    const { rows: courses } = await pgPool.query({
        text: "SELECT * FROM courses WHERE course_id ILIKE $1 OR title ILIKE $1;",
        values: [`%${searchTerm}%`]
    });

    return courses;
}

export async function createCoursePG(courseData) {
    if (await doesCourseExistPG(courseData.course_id)) throwResErr(409, "Course already exists");

    await pgPool.query({
        text: `
            INSERT INTO
                courses (course_id, title, description, schedule, classroom_number, maximum_capacity, credit_hours, credit_hours)
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
            courseData.credit_hours
        ]
    });
}

// export async function doesCourseExistPG(courseID) {
//     const courses = await searchCoursesPG(courseID);

//     return courses[0] !== undefined;
// }



export async function ensureCourseExistsPG(courseID) {
    const course = await getCoursePG(courseID);
    
    if (!course) throwResErr(404, `Course (with course_id "${courseID}") does not exist`);
}