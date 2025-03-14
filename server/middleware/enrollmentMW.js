import { dropPG, enrollPG } from "../services/postgres/enrollmentCRUD.js";
import { sendErrRes } from "../utils/generalUtils.js";

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