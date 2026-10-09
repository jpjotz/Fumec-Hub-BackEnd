const Course = require('../Models/Course');

async function getCourses() {
    const courses = await Course.findAll();

    return courses
}

module.exports = { getCourses };