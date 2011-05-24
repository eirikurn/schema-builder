
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

helpers.email = {
  type: "string",
  format: "email",
  pattern: /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/.source
};

helpers.url = {
  type: "string",
  format: "url",
  pattern: /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/.source
};

helpers.ip = {
  type: "string",
  format: "ip",
  pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.source
};

helpers.nonEmpty = {
  required: true,
  minLength: 1,
  pattern: /[^\s\t\r\n]/.source
};

helpers.required = { required: true };

/**
 * Stores compiled versions of the helpers.
 */
cache = {};

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

    if (k in cache && val === cache[k].original) {
      val = cache[k];
    } else {
      val = cache[k] =
        "function" !== typeof(val)
        ? wrap(val)
        : val;
      val.original = helpers[k];
    }

    old[k] = global[k];
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
  return function() {
    var k, i, len, param,
        schema = {};

    for (k in obj) {
      schema[k] = obj[k];
    }
    for (i=0, len=arguments.length; i < len; i++) {
      param = arguments[i];
      for (k in param) {
        schema[k] = param[k];
      }
    }
    return schema;
  }
};

/**
 * Library version.
 */

builder.version = '0.0.1';

/**
 * Exported helpers
 */

builder.helpers = helpers;
