define('utils/Array_from',function () {
  var slice = Array.prototype.slice;
  function Array_from(arrayLike) {
    return slice.call(arrayLike);
  }
  return Array_from;
});
