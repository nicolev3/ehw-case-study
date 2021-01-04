const htmlmin = require("html-minifier");
//require("dotenv").config();
const cleanCSS = require("clean-css");
const fs = require("fs");
//const pluginRSS = require("@11ty/eleventy-plugin-rss");
//const localImages = require("eleventy-plugin-local-images");
const lazyImages = require("eleventy-plugin-lazyimages");
//const ghostContentAPI = require("@tryghost/content-api");
const path = require("path");
const util= require('util');
const TextEncoder = new util.TextEncoder('utf-8');
require("node-sass"); // @11ty/eleventy is a peer dependency.
const pluginSass = require("eleventy-plugin-sass");
//const pluginDate = require("eleventy-plugin-date");
//const pluginTailwindCSS = require("eleventy-plugin-tailwindcss");

// ...

 const sassPluginOptions = {
    watch: ['**\/*.{scss,sass}', '!node_modules/**'],
    sourcemaps: true,
    cleanCSS: true,
    cleanCSSOptions: {},
    autoprefixer: true,
    outputDir: './dist/assets/css/',
    remap: true
    }; 

module.exports = function(config) {
      config.addPlugin(pluginSass, sassPluginOptions);

  config.addLayoutAlias('base', 'default.njk');
  // Inside the function you export...
config.addFilter("toUTCString", (date) => {
  const utc = date.toUTCString();
  return moment.utc(utc).format("MMMM Do YYYY");
});
config.addWatchTarget("./src/assets");

config.addPlugin(lazyImages, {
  cacheFile: ""
});

  // Inline CSS
  //config.addFilter("cssmin", code => {
   // return new cleanCSS({}).minify(code).styles;
 // });
 /*  config.addFilter("getReadingTime", text => {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  });
 */
  // Date formatting filter


  config.addPassthroughCopy({ "src/assets/img/favicon": "/" });
  config.addPassthroughCopy('src/assets/library/');
  config.addPassthroughCopy('src/assets/js/');
  config.addPassthroughCopy('src/assets/css/');
  config.addPassthroughCopy('src/assets/uploads/');
  config.addPassthroughCopy('src/admin/config.yml');

  config.addPassthroughCopy('src/assets/svg/');
  //config.addPassthroughCopy('src/assets/styles/');
  config.addPassthroughCopy('src/assets/img/');
 // config.addTransform("minify", require("./config/transforms/minify.js"));

  config.setUseGitIgnore(false);
 

  config.addNunjucksShortcode("version", function() {     return String(Date.now());  });

  config.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // Eleventy configuration
  return {
    dir: {
      input: "src",
      layouts: "/_includes/layouts",
      output: "dist",
      includes: "/_includes",

    },

    // Files read by Eleventy, add as needed
    templateFormats: ["css", "njk", "md", "txt", "html", "hbs",],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
}};
