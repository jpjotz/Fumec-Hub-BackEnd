const courseService = require("../Services/courseService");

async function getCourses(req, res, next) {
    try {
        const courses = await courseService.getCourses();

        return res.status(200).json(courses);
    } catch (error) {
        next(error);
    }
}

module.exports = { getCourses };