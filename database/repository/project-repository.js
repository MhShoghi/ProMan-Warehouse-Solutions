const { APIError } = require("../../utils/app-errors");
const { ProjectModel } = require("../models");

class ProjectRepository {
  async AddProject({
    name,
    owner,
    operator,
    description,
    address,
    latitude,
    longitude,
    status,
    number,
  }) {
    try {
      const project = new ProjectModel({
        name,
        owner,
        operator,
        description,
        address,
        "location.latitude": latitude,
        "location.longitude": longitude,
        status,
        number,
      });

      return await project.save();
    } catch (err) {
      throw APIError("Unable to add project");
    }
  }
  async DeleteProjectById() {}
  async Projects() {}
  async FindProjectById(projectId) {}
  async FindProjectByQuery(key, value) {}
  async UpdateProjectById() {}
}
module.exports = ProjectRepository;
