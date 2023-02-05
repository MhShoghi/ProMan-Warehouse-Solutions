const APP_LANGUAGE = process.env.APP_LANGUAGE;

module.exports = {
  errorMessages: require(`./errorMessages-${APP_LANGUAGE.toLowerCase()}`),
};
