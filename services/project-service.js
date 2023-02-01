const { ProjectRepository } = require("../database");
const { FormateData } = require("../utils");

class ProjectService {
  constructor() {
    this.repository = new ProjectRepository();
  }

  async CreateNewProject(projectInputs) {
    const projectResult = await this.repository.AddProject(projectInputs);
    return FormateData(projectResult);
  }
}

module.exports = ProjectService;
