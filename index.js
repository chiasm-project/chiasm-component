// chiasm-component.js
// github.com/chiasm-project/chiasm-component
//
// This module is a base constructor for Chiasm components.  It is a thin
// wrapper around model.js that adds an API for defining public properties.
// 
// The constructor argument `publicProperties` (optional) is an object where:
// 
//  * Keys are property names
//
//  * Values are default values for these properties
//  
// This argument specifies a set of public properties and their default values.

var Model = require("model-js");

function ChiasmComponent (publicProperties){

  // A Chiasm component is just a Model ( see github.com/curran/model ),
  // with special semantics around the notion of a "public property".
  var my = new Model();

  // `addPublicProperty()`
  //
  // This function adds a public property to a model.  This makes the property
  // configurable via `chiasm.setConfig(config)`.
  //
  // In Chiasm, only public properties are allowed to be configured via
  // `setConfig`. If a user attempts to configure a property value not added as
  // a public property , then an error will be reported.
  my.addPublicProperty = function (property, defaultValue){
    if(!my.publicProperties){
      my.publicProperties = [];
    }
    my.publicProperties.push(property);
    my[property] = defaultValue;
  };

  // Adds all public properties in the given object.
  my.addPublicProperties = function (publicProperties){
    Object.keys(publicProperties).forEach(function (property){
      my.addPublicProperty(property, publicProperties[property]);
    });
  };

  // Initialize an SVG container element for chaism-layout to use.
  // This is for supporting multiple components in a single SVG element.
  my.initSVG = function (){
    return my.el = document.createElementNS("http://www.w3.org/2000/svg", "g");
  }
  
  // Initialize a DIV container element for chaism-layout to use.
  my.initDIV = function (){
    return my.el = document.createElement("div");
  }

  // Add the default values passed into the constructor
  // as public properties.
  if(publicProperties){
    my.addPublicProperties(publicProperties);
  }

  return my;
}

module.exports = ChiasmComponent;
