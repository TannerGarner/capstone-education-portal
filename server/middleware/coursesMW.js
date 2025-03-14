import { sendErrRes } from "../utils/generalUtils.js";
import { searchCoursesPG } from "../services/postgres/coursesCRUD.js";

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
    
}

export async function putCourseMW(req, res) {
    
}

export async function deleteCourseMW(req, res) {
    
}