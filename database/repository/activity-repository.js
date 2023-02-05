const { CustomError } = require("../../utils/app-errors");
const { ActivityModel } = require("../models");

class ActivityRepository {
  async AddActivity(activity) {
    try {
      const savedActivity = new ActivityModel({
        user_id: activity.user_id,
        type: activity.type,
        details: activity.details,
      });

      return await savedActivity.save();
    } catch (err) {
      throw new CustomError("Unable to add activity");
    }
  }

  async GetActivities() {
    try {
      return await ActivityModel.find().lean();
    } catch (err) {
      throw new CustomError("Unable to get activities");
    }
  }

  async GetActivity(userId) {
    try {
      const activities = await ActivityModel.find({ user_id: userId })
        .exec()
        .lean();
      return activities;
    } catch (err) {
      throw new CustomError("Unable to get activity");
    }
  }
}

module.exports = ActivityRepository;
