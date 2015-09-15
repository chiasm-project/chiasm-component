# chiasm-component

[![Build
Status](https://travis-ci.org/chiasm-project/chiasm-component.svg?branch=master)](https://travis-ci.org/chiasm-project/chiasm-component)

A common base for [Chiasm](https://github.com/chiasm-project/chiasm) components.

This module is a thin wrapper around [Model.js](https://github.com/curran/model) that adds an API for defining
public properties.  In Chiasm, only public properties are allowed to be
configured via `chiasm.setConfig(config)`. If a user attempts to configure a
property value not added as a public property, an error will be reported.

Example use:

```javascript
var myComponent = ChiasmComponent ({ x: "foo", y: "bar" });
```

In the above snippet, `myComponent` will be a model.js Model.

The constructor argument `publicProperties` (optional) is an object where:
 
  * Keys are property names

  * Values are default values for these properties
  
This argument specifies a set of public properties and their default values.

```javascript
myComponent.addPublicProperty("z", "baz");
```

This function adds a public property to a model (e.g. "z") and specifies its default value (e.g. "baz").  This makes the property available for dynamic configuration within Chiasm.

## Background

Originally, Chaism components were simply Models, so a component could be defined like this:

```javascript
function MyComponent(){
  return Model();
};
```

The problem with this setup is that changes can only be propagated from the Chiasm configuration to components, but not the other way around, because Chiasm has no way to know which properties it should listen for changes on. In cases where user interaction causes changes in components, it is desirable to have those changes propagate back into the configuration. This is so the visualization state resulting from user interactions can be serialized.

To enable change propagation from components to the Chiasm configuration, set a special property `publicProperties` was introduced. This is an array of property names. Each of these properties must have a default value defined on the model at the time it is returned from the component constructor. In cases where the property is optional and is initially not specified, use `Model.None` (which is conceptually similar to [Scala's Option type](http://alvinalexander.com/scala/using-scala-option-some-none-idiom-function-java-null)).

```javascript
return function MyComponent(){
  return Model({
    publicProperties: ["message"],
    message: "Hello"
  });
};
```

ChiasmComponent provides syntactic sugar for the above convention. The above code is equivalent to:

```javascript
return function MyComponent(){
  return ChiasmComponent({
    message: "Hello"
  });
};
```

## Why "public properties"?

It became clear in early Chiasm prototypes that if a property is not declared as a public property, then configured by the Chiasm configuration, then that configured property is *removed* from the configuration, the system results in an unpredictable state. This is because when a property is removed from the configuration, it should be *reset to its default value*. If a property is not declared as a public property, Chiasm has no way of knowing what its default value is. Therefore, to ensure stability and a consistently predictable state under all runtime configuration changes (including removing properties), the strict rule was added in Chiasm that **only public properties are allowed to be configured**. This is why an error is reported if a property is attempted to be configured that is not a public property.

## Working with the DOM

Here's how you can use the DOM and create elements associated with the component.

```javascript
function MyComponent(){
  var component = ChiasmComponent({
    message: "Hello"
  });
  component.el = document.createElement("div");
  return component;
}
```

The property `el` stands for "element" (inspired by [el in Backbone Views](http://backbonejs.org/#View-el)). This element should be created in the component constructor. The [Chiasm Layout Component](https://github.com/chiasm-project/chiasm-layout) looks for this special property, and manages adding and removing this DOM element from a parent container element.

Two convenience methods are available on any `ChiasmComponent` instance:

 * `initSVG()`
 * `initDIV()`

These are simple functions that create DOM elements for you and assign them to `my.el`. These two functions make it less code to work with [chiasm-layout](https://github.com/chiasm-project/chiasm-layout). This layout component manages two separate containers, one top-level SVG element for all components that use SVG, and another continer for arbitrary other DOM elements (typically divs). Their implementations are extremely simple:

```
my.initSVG = function (){
  return my.el = document.createElementNS("http://www.w3.org/2000/svg", "g");
}
my.initDIV = function (){
  return my.el = document.createElement("div");
}
```

Both of these functions return a DOM element that you can consider the root node of your component and add children to. 

From here, you can dive deeper and check out:

 * [Chiasm Boilerplate](http://bl.ocks.org/curran/1af08ad6cdb01707c33f) A complete Chiasm application with a simple interactive graphic component.
 * [Chiasm Foundation](http://bl.ocks.org/curran/b4aa88691528c0f0b1fa) A slightly more complex example that shows use of SVG and Canvas in the same application.

## Glossary

The following terms have a precise meaning within the Chiasm project.

 * **component** A JavaScript module that defines a constructor function that returns a component.
 * **component instance** A [Model.js model](https://github.com/curran/model) constructed by a component.
 * **configuration** A JSON data structure that defines a collection of components and values for their public properties.
 * **public properties** The set of properties for a given component that can be set via the configuration. Public properties are declared in a special component property `publicProperties`, an array of property name strings. All public properties must have default values.
 * **default values** Values for public properties that are initially assigned to the properties at the time the component is constructed. Since all public properties must have default values, `Model.None` should be used in cases where the property is optional.
