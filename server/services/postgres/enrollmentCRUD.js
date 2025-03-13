import pgPool from "./pgPool.js";

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

    return res.rows[0].maximum_capacity;
}

export async function getCoursesUsersCountPG(courseID) {
    const res = await pgPool.query({
        text: "SELECT COUNT(*) FROM enrollment WHERE course_id = $1;",
        values: [courseID]
    });

    return res.rows[0].count;
}