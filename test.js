var assert = require("assert");
var ChiasmComponent = require("./index");

describe("ChiasmComponent", function() {
  it("should set public properties specified in constructor", function () {
    var component = ChiasmComponent({
      x: 5,
      y: 10
    });
    assert.equal(component.publicProperties.length, 2);
  });
});
