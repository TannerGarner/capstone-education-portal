import { dropPG, enrollPG, getCoursesForUserPG, getCoursesNotForUserPG, getUsersForCoursePG } from "../services/postgres/enrollmentPG.js";
import { sendErrRes } from "../utils/errHandlingUtils.js";

export async function getCoursesForUserMW(req, res) {
    try {
        const { userID } = req.params;

        const coursesForUser = await getCoursesForUserPG(userID);
        const coursesNotForUser = await getCoursesNotForUserPG(userID);

        res.json({ coursesForUser, coursesNotForUser });
    } catch (err) {
        sendErrRes(err, res);
    }
}

export async function getUsersForCourseMW(req, res) {
    try {
        const { courseID } = req.params;

        const users = await getUsersForCoursePG(courseID);

        res.json(users);
    } catch (err) {
        sendErrRes(err, res);
    }
}


export async function enrollMW(req, res) {
    try {
        const { user_id, course_id } = req.body;

        await enrollPG(user_id, course_id);

        res.json({ errorMessage: null });
    } catch (err) {
        sendErrRes(err, res);
    }
}

export async function dropMW(req, res) {
    try {
        const { user_id, course_id } = req.body;

        await dropPG(user_id, course_id);

        res.json({ errorMessage: null });
    } catch (err) {
        sendErrRes(err, res);
    }
}