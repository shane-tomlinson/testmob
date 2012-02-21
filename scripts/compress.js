#!/usr/bin/env node

const assets = require("../server/assets.js").assets,
      fs = require("fs"),
      uglifyjs = require("uglify-js"),
      uglifycss = require('uglifycss/uglifycss-lib'),
      output_root = __dirname + "/../client/static",
      input_root = __dirname + "/../client/static";

function readFileList(file_list) {
  var output = "";

  file_list.forEach(function(input_name) {
    var contents = fs.readFileSync(input_root + input_name, "utf8");
    output += contents;
  });

  return output;
}

function writeFile(output_name, final_code) {
  fs.writeFileSync(output_root + output_name, final_code, "utf8");
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

function compressCSS(output_name) {
  var output = readFileList(assets[output_name]),
      options = {
        maxLineLen: 0,
        expandVars: false,
        cuteComments: true
      };

  var final_code = uglifycss.processString(output, options);

  writeFile(output_name, final_code);
}

compressJS("/production/main.min.js");
compressCSS("/production/main.min.css");

