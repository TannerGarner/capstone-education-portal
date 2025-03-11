import pgPool from "./pgPool.js";

export async function getCoursesPG(searchTerm) {
    searchTerm = searchTerm ?? ""; // This ensures that the keyword is not undefined.

    const { rows: courses } = await pgPool.query({
        text: "SELECT * FROM courses WHERE course_id ILIKE $1 OR title ILIKE $1;",
        values: [`%${searchTerm}%`]
    });

    return courses;
}