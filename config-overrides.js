module.exports = function override(config) {
  if (process.env.CYPRESS_COVERAGE === "true") {
    const babelLoaderRule = config.module.rules
      .find((rule) => rule.oneOf)
      .oneOf.find(
        (rule) => rule.loader && rule.loader.includes("babel-loader") && rule.include
      );

    if (babelLoaderRule) {
      babelLoaderRule.options.plugins = [
        ...(babelLoaderRule.options.plugins || []),
        "istanbul",
      ];
    }
  }

  return config;
};
