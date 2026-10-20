const test = require('node:test');
const assert = require('node:assert');
const { formatDuration } = require('../src/format');

test('formatDuration pads minutes and seconds', () => {
  assert.strictEqual(formatDuration(65), '01:05');
  assert.strictEqual(formatDuration(605), '10:05');
});
