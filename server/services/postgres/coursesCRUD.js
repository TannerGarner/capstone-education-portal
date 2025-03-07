import pgPool from "./pgPool.js";

export async function getCoursesPG() {
    const { rows: courses } = await pgPool.query({ text: "SELECT * FROM courses;" });

    return courses;
}