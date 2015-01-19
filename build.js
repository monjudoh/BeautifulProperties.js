var main = module.exports = function main(options) {
  var path = require('path');
  var fs = require('fs');
  var _ = require('underscore');
  var baseOptions = {
    requireConfig:{
      baseUrl:path.resolve(__dirname, 'src')
    },
    moduleName:'BeautifulProperties',
    exclude:[]
  };
  require('amdbuilder').build(_.defaults({},baseOptions,{
    templateType:'amd',
    distDir:path.resolve(__dirname, 'dist/amd')
  }),function (builtFilePath,code){
  });
  require('amdbuilder').build(_.defaults({},baseOptions,{
    templateType:'cjs',
    distDir:path.resolve(__dirname, 'dist/cjs')
  }),function (builtFilePath,code){
  });
  require('amdbuilder').build(_.defaults({},baseOptions,{
    templateType:'global',
    distDir:path.resolve(__dirname, 'dist/global')
  }),function (builtFilePath,code){
  });
};
if (require.main === module) {
  main();
}