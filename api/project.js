const ProjectService = require("../services/project-service");
const { AddProjectValidator } = require("./validator/project-validator");

module.exports = (app) => {
  const Service = new ProjectService();

  app.post("/projects", AddProjectValidator, async (req, res) => {
    const { data } = await Service.CreateNewProject(req.body);

    return res.json({ data });
  });
};
