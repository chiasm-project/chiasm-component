# chiasm-component

[![Build
Status](https://travis-ci.org/chiasm-project/chiasm-component.svg?branch=master)](https://travis-ci.org/chiasm-project/chiasm-component)

A common base for [Chiasm](https://github.com/chiasm-project/chiasm) plugins.

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

# Background

Originally, Chaism plugins were simply Models, so a plugin could be defined like this:

```javascript
function MyPlugin(){
  return Model();
};
```

The problem with this setup is that changes can only be propagated from the Chiasm configuration to components, but not the other way around, because Chiasm has no way to know which properties it should listen for changes on. In cases where user interaction causes changes in components, it is desirable to have those changes propagate back into the configuration. This is so the visualization state resulting from user interactions can be serialized.

To enable change propagation from components to the Chiasm configuration, set a special property `publicProperties` was introduced. This is an array of property names. Each of these properties must have a default value defined on the model at the time it is returned from the component constructor. In cases where the property is optional and is initially not specified, use `Model.None` (which is conceptually similar to [Scala's Option type](http://alvinalexander.com/scala/using-scala-option-some-none-idiom-function-java-null)).

```javascript
return function MyPlugin(){
  return Model({
    publicProperties: ["message"],
    message: "Hello"
  });
};
```

The above code is equivalent to:

```javascript
return function MyPlugin(){
  return ChiasmComponent({
    message: "Hello"
  });
};
```

It became clear that if a property is not declared as a public property, then configured by the Chiasm configuration, then that configured property is *removed* from the configuration, the system results in an unpredictable state. This is because when a property is removed from the configuration, it should be *reset to its default value*. If a property is not declared as a public property, Chiasm has no way of knowing what its default value is. Therefore, to ensure stability and a consistently predictable state under all runtime configuration changes (including removing properties), the strict rule was added in Chiasm that *only public properties are allowed to be configured*. This is why an error is reported if a property is attempted to be configured that is not a public property.


A reference to the containing Chiasm instance is passed into the plugin constructor. This has a `container` property, which is the container DOM element passed into the Chiasm constructor. Here's how you can use the DOM and create elements associated with the plugin.

```javascript
define(["model"], function (Model){
  return function MyPlugin(runtime){
    var model = Model({
      publicProperties: ["message"],
      message: Model.None,
      textBox: runtime.div.appendChild("textarea")
    });
    model.when(["textarea", "message"], function(textarea, message){
      textarea.innerHTML = message;
    });
    return model;
  };
});
```

To avoid memory leaks and unused DOM elements, plugins should define a `destroy` method on the returned model, which will be invoked by the runtime when the component is removed from the configuration. 

This is what a complete plugin looks like.

```javascript
define(["model"], function (Model){
  return function MyPlugin(runtime){
    var model = Model({
      publicProperties: ["message"],
      message: Model.None
    });

    var textBox = runtime.div.appendChild("textarea");

    model.when("message", function(message){
      textBox.innerHTML = message;
    });

    model.destroy = function(){
      runtime.div.removeChild(textBox)
    };

    return model;
  };
});
```

## Plugin Property Conventions

The above plugin guide is generic, but Chiasm expects certain properties to be used in certain ways. Here is a list of common properties and their uses.

 * `el` The DOM element that will contain the visualization. Plugins can assume that this value will be set only once.
 * `box` An object with (x, y, width, height) that represents the outer rectangle containing the visualization.

From here, you can dive deeper and check out the [Chiasm Foundation Example](http://bl.ocks.org/curran/b4aa88691528c0f0b1fa), which contains a basic Chaism plugin that uses SVG, and another that uses Canvas.

## Glossary

The following terms have a precise meaning within the Chiasm project.

 * **Plugin** An [AMD module](http://requirejs.org/docs/whyamd.html) that defines a constructor function that returns components.
 * **Component** A [Model.js model](https://github.com/curran/model) constructed by a plugin.
 * **Configuration** A JSON data structure that defines a collection of components and values for their public properties.
 * **Public Properties** The set of properties for a given component that can be set via the configuration. Public properties are declared in a special component property `publicProperties`, an array of property name strings. All public properties must have default values.
 * **Default Values** Values for public properties that are initially assigned to the properties at the time the component is constructed. Since all public properties must have default values, `Model.None` should be used in cases where the property is optional.
