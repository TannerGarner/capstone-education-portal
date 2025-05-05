import { dropStudentFromCoursePG, enrollStudentInCoursePG, getCoursesWithStudentPG, getCoursesWithoutStudentPG, getStudentsInCoursePG, getStudentsNotInCoursePG } from "../services/postgres/enrollmentPG.js";
import { sendErrRes } from "../utils/errHandlingUtils.js";

export async function getEnrollmentOfStudentMW(req, res) {
    try {
        const { userID } = req.params;

        const coursesForUser = await getCoursesWithStudentPG(userID);
        const coursesNotForUser = await getCoursesWithoutStudentPG(userID);

        res.json({ coursesForUser, coursesNotForUser });
    } catch (err) {
        sendErrRes(err, res);
    }
}

export async function getEnrollmentOfCourseMW(req, res) {
    try {
        const { courseID } = req.params;

        const usersForCourse = await getStudentsInCoursePG(courseID);
        const usersNotForCourse = await getStudentsNotInCoursePG(courseID);

        res.json({ usersForCourse, usersNotForCourse });
    } catch (err) {
        sendErrRes(err, res);
    }
}


export async function enrollStudentInCourseMW(req, res) {
    try {
        const { user_id, course_id } = req.body;

        await enrollStudentInCoursePG(user_id, course_id);

        res.json({ errorMessage: null });
    } catch (err) {
        sendErrRes(err, res);
    }
}

export async function dropStudentFromCourseMW(req, res) {
    try {
        const { user_id, course_id } = req.body;

        await dropStudentFromCoursePG(user_id, course_id);

        res.json({ errorMessage: null });
    } catch (err) {
        sendErrRes(err, res);
    }
}