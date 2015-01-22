define('utils/hasConsoleError',function(){
  return (typeof console !== 'undefined' && !!console.error);
});