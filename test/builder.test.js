var builder = require('schema-builder')
  , assert = require('assert')
  , should = require('should');

module.exports = {
  'use schemas': function() {
    var schema = builder(function() {
      return object({
        properties: {
          a: string(),
          b: integer(),
          c: number(),
          d: array({ items: string() })
        }
      });
    });

    assert.deepEqual(schema, {
      type: "object",
      properties: {
        a: { type: "string" },
        b: { type: "integer" },
        c: { type: "number" },
        d: { type: "array", items: { type: "string" } }
      }
    });
  },

  'persist globals': function() {


  },

};
