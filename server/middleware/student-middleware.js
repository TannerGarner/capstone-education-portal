import bcrypt from "bcrypt";

export function register(req, res) {
    try {
        const saltRounds = 10;

        const passwordHash = bcrypt.hashSync(req.body.password, saltRounds);
        
        
    } catch (err) {
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
}


export function getStudentClasses(req, res) {

}




