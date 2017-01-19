import Complete from '../lib/complete';

import { test } from 'tape';

test('implementation', assert => {
  assert.equal(typeof Complete, 'function', 'Complete class exists');
  assert.end();
});
