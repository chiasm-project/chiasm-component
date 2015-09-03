# chiasm-component

[![Build
Status](https://travis-ci.org/chiasm-project/chiasm-component.svg?branch=master)](https://travis-ci.org/chiasm-project/chiasm-component)

A common base for Chiasm plugins.

This module is a thin wrapper around model.js that adds an API for defining
public properties.  In Chiasm, only public properties are allowed to be
configured via `chiasm.setConfig(config)`. If a user attempts to configure a
property value not added as a public property, an error will be reported.

Example use:

```
var myComponent = ChiasmComponent ({ x: "foo", y: "bar" });
```

In the above snippet, `myComponent` will be a model.js Model.

The constructor argument `publicProperties` (optional) is an object where:
 
  * Keys are property names

  * Values are default values for these properties
  
This argument specifies a set of public properties and their default values.

`addPublicProperty()`

This function adds a public property to a model.  This makes the property
configurable via `chiasm.setConfig(config)`.
