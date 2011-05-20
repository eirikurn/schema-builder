
/*!
 * schema-builder
 * Copyright(c) 2011 Eirikur Nilsson <eirikur@nilsson.is>
 * MIT Licensed
 */

/**
 * Schema helpers
 */
var helpers = {};

helpers.string = { type: "string" };

helpers.number = { type: "number" };

helpers.integer = { type: "integer" };

helpers.object = { type: "object" };

helpers.array = { type: "array" };


/**
 * The primary builder export. Runs a function with
 * schema helpers and returns its result.
 */
var builder = module.exports = function(cb) {
  var k, val, old = {}, result;

  /**
   * Assign shortcut schemas to global and store previous value.
   */
  for (k in helpers) {
    val = helpers[k];
    old[k] = global[k];

    if ("function" !== val) {
      val = helpers[k] = wrap(val);
    }

    global[k] = val;
  }

  /**
   * Call builder
   */
  result = cb();

  /**
   * Clean up afterwards
   */
  for (k in helpers) {
    if ("undefined" === typeof old[k])
      delete global[k];
    else
      global[k] = old[k];
  }

  return result;
};

/**
 * Wraps a schema object with a function that allows
 * extension of its properties.
 */
var wrap = function(obj) {
  return function(props) {
    var k, schema = {};
    if (props == null) {
      props = {};
    }

    for (k in obj) {
      schema[k] = obj[k];
    }
    for (k in props) {
      schema[k] = props[k];
    }
    return schema;
  }
};


/**
 * Library version.
 */
builder.version = '0.0.1';

