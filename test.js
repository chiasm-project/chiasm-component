var expect = require('chai').expect
var ChiasmComponent = require("./index");

describe("ChiasmComponent", function() {

  it("should set public properties specified in constructor", function () {

    var my = ChiasmComponent({
      x: 5,
      y: 10
    });

    expect(my.publicProperties.length).to.equal(2);
    expect(my.publicProperties).to.contain("x");
    expect(my.publicProperties).to.contain("y");
    expect(my.x).to.equal(5);
    expect(my.y).to.equal(10);
  });

  it("should set public properties specified via addPublicProperty", function () {
    var my = ChiasmComponent();

    my.addPublicProperty("foo", "bar");

    expect(my.publicProperties.length).to.equal(1);
    expect(my.publicProperties).to.contain("foo");
    expect(my.foo).to.equal("bar");
  });

  it("should set public properties specified via addPublicProperties", function () {
    var my = ChiasmComponent();

    my.addPublicProperties({
      x: 50,
      y: 100
    });

    expect(my.publicProperties.length).to.equal(2);
    expect(my.publicProperties).to.contain("x");
    expect(my.x).to.equal(50);
    expect(my.publicProperties).to.contain("y");
    expect(my.y).to.equal(100);
  });
});
