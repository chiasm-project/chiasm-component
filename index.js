// chiasm-component.js
// v__VERSION__
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
  var model = Model();

  // `addPublicProperty()`
  //
  // This function adds a public property to a model.  This makes the property
  // configurable via `chiasm.setConfig(config)`.
  //
  // In Chiasm, only public properties are allowed to be configured via
  // `setConfig`. If a user attempts to configure a property value not added as
  // a public property , then an error will be reported.
  model.addPublicProperty = function (property, defaultValue){
    if(!model.publicProperties){
      model.publicProperties = [];
    }
    model.publicProperties.push(property);
    model[property] = defaultValue;
  };

  // Add the default values passed into the constructor
  // as public properties.
  publicProperties = publicProperties || {};
  Object.keys(publicProperties).forEach(function (property){
    model.addPublicProperty(property, publicProperties[property]);
  });

  return model;
}

module.exports = ChiasmComponent;
