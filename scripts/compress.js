#!/usr/bin/env node

const assets = require("../server/assets.js").assets,
      fs = require("fs"),
      output_root = __dirname + "/../client/static",
      input_root = __dirname + "/../client/static";

for(var output_name in assets) {
  var file_list = assets[output_name],
      output = "";

  file_list.forEach(function(input_name) {
    var contents = fs.readFileSync(input_root + input_name, "utf8");
    output += contents;
  });

  var jsp = require("uglify-js").parser;
  var pro = require("uglify-js").uglify;

  var ast = jsp.parse(output); // parse code and get the initial AST
  ast = pro.ast_mangle(ast); // get a new AST with mangled names
  ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
  var final_code = pro.gen_code(ast); // compressed code here

  fs.writeFileSync(output_root + output_name, final_code, "utf8");
}

