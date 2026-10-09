const User = require('./User');
const Course = require('./Course');

User.belongsTo(Course, { foreignKey: 'courseId' });
Course.hasMany(User, { foreignKey: 'courseId' });