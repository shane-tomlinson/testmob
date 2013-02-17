#!/usr/bin/env node

const assets = require("../server/assets.js").assets,
      path = require("path"),
      fs = require("fs"),
      mkdirp = require("mkdirp"),
      uglifyjs = require("uglify-js"),
      uglifycss = require('uglifycss/uglifycss-lib'),
      output_root = path.join(__dirname, "..", "client", "static"),
      input_root = path.join(__dirname, "..", "client", "static"),
      cachify = require('connect-cachify'),
      connect_fonts = require('connect-fonts'),
      chunkfive = require('connect-fonts-chunkfive');

function readFileList(file_list) {
  var output = "";

  file_list.forEach(function(input_name) {
    var contents = fs.readFileSync(path.join(input_root, input_name), "utf8");
    output += contents;
  });

  return output;
}

function writeFile(output_name, data) {
  var output_path = path.join(output_root, output_name);
  console.log("Writing file", output_path);
  mkdirp.sync(path.dirname(output_path));
  fs.writeFileSync(output_path, data, "utf8");
}

function compressJS(output_name) {
  var output = readFileList(assets[output_name]);

  var jsp = uglifyjs.parser;
  var pro = uglifyjs.uglify;

  var ast = jsp.parse(output); // parse code and get the initial AST
  ast = pro.ast_mangle(ast); // get a new AST with mangled names
  ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
  var final_code = pro.gen_code(ast); // compressed code here

  writeFile(output_name, final_code);
}

function cachify_embedded (css_src) {
  // RegExp is set up to handle multiple url's per declaration, which is
  // possible for things like background-images.
  return css_src.replace(/url\s*\(['"]([^\)'"]+)\s*['"]\s*\)/g, function (str, url) {
    // This will throw an error if url doesn't exist. This is good as we will
    // catch typos during build.
    console.log("For " + str + " making " + url + " into " + cachify.cachify(url));

    return "url('" + cachify.cachify(url) + "')";
  });
}

function compressCSS(output_name) {
  var output = cachify_embedded(readFileList(assets[output_name])),
      options = {
        maxLineLen: 0,
        expandVars: false,
        cuteComments: true
      };

  var final_code = uglifycss.processString(output, options);

  writeFile(output_name, final_code);
}

function createFontCSS(css_output_path, done) {
  connect_fonts.generate_css("all", "default", [ "chunkfive" ], function(err, css) {
    writeFile(css_output_path, css.css);
  });
};

connect_fonts.setup({
  fonts: [ chunkfive ],
  allow_origin: "*"
});

cachify.setup({}, {
  root: input_root,
  url_to_paths: connect_fonts.urlToPaths
});


createFontCSS("/en/chunkfive/fonts.css");
compressJS("/production/main.min.js");
compressCSS("/production/main.min.css");

