var $__8,
    $__9;
var square = (function(x) {
  return x * x;
});
var x = y + z;
alert(square(2) + 4);
var $__3 = true;
var $__4 = false;
var $__5 = undefined;
try {
  for (var $__1 = void 0,
      $__0 = ([1, 2, 3])[$traceurRuntime.toProperty(Symbol.iterator)](); !($__3 = ($__1 = $__0.next()).done); $__3 = true) {
    var element = $__1.value;
    {
      res.push(element * element);
    }
  }
} catch ($__6) {
  $__4 = true;
  $__5 = $__6;
} finally {
  try {
    if (!$__3 && $__0.return != null) {
      $__0.return();
    }
  } finally {
    if ($__4) {
      throw $__5;
    }
  }
}
var t = 3 * 5;
var k1 = 5;
var $p = 5;
var $__7 = ['hello', 'world'],
    a = ($__8 = $__7[$traceurRuntime.toProperty(Symbol.iterator)](), ($__9 = $__8.next()).done ? void 0 : $__9.value),
    b = ($__9 = $__8.next()).done ? void 0 : $__9.value;
