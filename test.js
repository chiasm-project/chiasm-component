var expect = require('chai').expect
var ChiasmComponent = require("./index");

describe("ChiasmComponent", function() {

  it("should set public properties specified in constructor", function () {
    var component = ChiasmComponent({
      x: 5,
      y: 10
    });
    expect(component.publicProperties.length).to.equal(2);
    expect(component.publicProperties).to.contain("x");
    expect(component.publicProperties).to.contain("y");
    expect(component.x).to.equal(5);
    expect(component.y).to.equal(10);
  });

  it("should set public properties specified via addPublicProperty", function () {
    var component = ChiasmComponent();
    component.addPublicProperty("foo", "bar");
    expect(component.publicProperties.length).to.equal(1);
    expect(component.publicProperties).to.contain("foo");
    expect(component.foo).to.equal("bar");
  });

  it("should set public properties specified via addPublicProperties", function () {
    var component = ChiasmComponent();
    component.addPublicProperties({ x: 50, y: 100 });
    expect(component.publicProperties.length).to.equal(2);
    expect(component.publicProperties).to.contain("x");
    expect(component.x).to.equal(50);
    expect(component.publicProperties).to.contain("y");
    expect(component.y).to.equal(100);
  });

});
