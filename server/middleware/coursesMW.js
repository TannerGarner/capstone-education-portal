import { createCoursePG, deleteCoursePG, searchCoursesPG, updateCoursePG } from "../services/postgres/coursesPG.js";
import { sendErrRes } from "../utils/errHandlingUtils.js";

export async function searchCoursesMW(req, res) {
    try {
        const { searchTerm } = req.query;

        const courses = await searchCoursesPG(searchTerm);

        res.json(courses);
    } catch (err) {
        sendErrRes(err, res);
    }
}

export async function postCourseMW(req, res) {
    try {
        const courseData = { ...req.body };

        await createCoursePG(courseData);

        res.json({ errorMessage: null });
    } catch (err) {
        sendErrRes(err, res);
    }
}

export async function putCourseMW(req, res) {
    try {
        const { courseID } = req.params;
        const newCourseData = { ...req.body };

        await updateCoursePG(courseID, newCourseData);

        res.json({ errorMessage: null });
    } catch (err) {
        sendErrRes(err, res);
    }
}

export async function deleteCourseMW(req, res) {
    try {
        const { courseID } = req.params;

        await deleteCoursePG(courseID);

        res.json({ errorMessage: null });
    } catch (err) {
        sendErrRes(err, res);
    }
}