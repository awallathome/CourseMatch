const fs = require("fs");
const _ = require("lodash");

let courseIds = [];
let courseData;

fs.readFile("./data/Courses.json", function(err, data) {
  if (data) {
    courseData = JSON.parse(data); // read the data and create course reference keys
    for (let k in courseData) courseIds.push(k);
  }
});

module.exports = app => {
  app.get("/course/instructor/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
    let matches = [];
    courseIds.forEach(function(course) {
      let termKeys = [];
      let courseTerms = courseData[course].terms;  // there are a number of terms it has been offered
      for (let t in courseTerms) termKeys.push(t); // grab each term to create a terms reference key
      termKeys.forEach(function(term) {            // for each term within course
        courseInstructors = courseTerms[term].instructors;
        if (courseInstructors.length > 0) {        // find all instructors, accounting for team-taught courses
          mappedName = _.find(courseInstructors, function(inst) {
            return inst.toLowerCase().includes(name); // find the names that match req.params.name
          });
          courseMatch = courseData[course].course_title;
          if (mappedName !== undefined && !matches.includes(courseMatch)) { // no duplicates
            matches.push(courseMatch);
          }
        }
      });
    });
    if (matches.length > 0) {   // return matches, or message if none found
      res.status(200).send(matches);
    } else res.status(200).send("No match found for this request.");
  });
};
