(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ChiasmComponent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
// chiasm-component.js
// v0.2.0
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

var Model = (typeof window !== "undefined" ? window['Model'] : typeof global !== "undefined" ? global['Model'] : null);

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
  function addPublicProperty(property, defaultValue){
    if(!my.publicProperties){
      my.publicProperties = [];
    }
    my.publicProperties.push(property);
    my[property] = defaultValue;
  };

  // Adds all public properties in the given object.
  function addPublicProperties(publicProperties){
    Object.keys(publicProperties).forEach(function (property){
      addPublicProperty(property, publicProperties[property]);
    });
  };

  // Add the default values passed into the constructor
  // as public properties.
  if(publicProperties){
    addPublicProperties(publicProperties);
  }

  my.addPublicProperty = addPublicProperty;
  my.addPublicProperties = addPublicProperties;
  return my;
}

module.exports = ChiasmComponent;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});