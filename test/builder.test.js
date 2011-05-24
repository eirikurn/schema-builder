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

  'combining helpers': function() {
    var b = builder;
    var s = b(function() { return email(required()); });
    s.should.have.property('required', true);
    s.should.have.property('pattern');
  },

  'persists globals': function() {
    global.array = 5;
    delete global.object;
    global.string = null;

    var schema = builder(function() {
      return object({
        properties: {
          a: string(),
          b: array()
        }
      });
    });

    global.array.should.equal(5);
    global.should.not.have.property('object');
    should.equal(global.string, null);
  },

  'do not modify helpers': function() {
    builder(function() { return string() });
    builder.helpers.string.should.be.a('object');
  },

  'do reload changed helpers': function() {
    assert.deepEqual(
      builder(function() { return string() }),
      { 'type': 'string' }
    );

    old = builder.helpers.string;
    builder.helpers.string = { type: "string", required: true }

    assert.deepEqual(
      builder(function() { return string() }),
      { type: 'string', required: true }
    );

    builder.helpers.string = old;
  },
};
