import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { style } from './index.mjs';

function newNode(initialStyle = {}) {
  let node = {
    style: {
      ...initialStyle,
      setProperty: (k, v) => {
        if (v.length === 0) {
          delete node.style[k];
        } else {
          node.style[k] = v;
        }
      },
    },
  };

  return node;
}

function compare(node, expected) {
  let { setProperty, ...rest } = node.style;
  assert.equal(rest, expected);
}

test('applies styles', () => {
  let node = newNode({ color: 'green', height: '100px' });

  style(node, { color: 'red', width: '200px' });

  compare(node, { color: 'red', height: '100px', width: '200px' });
});

test('updates and adds styles', () => {
  let node = newNode({ color: 'green', height: '100px' });
  let { update } = style(node, { color: 'red', width: '200px' });

  update({ color: 'red', width: '10px', '--aVar': 'blue' });
  compare(node, {
    color: 'red',
    height: '100px',
    width: '10px',
    '--aVar': 'blue',
  });
});

test('removes styles when they are deleted from the object', () => {
  let node = newNode({ color: 'green', height: '100px' });
  let { update } = style(node, { color: 'red', width: '200px' });

  update({ color: 'red' });
  compare(node, { color: 'red', height: '100px' });
});

test('sets cssText when a string is given', () => {
  let node = newNode();
  let { update } = style(node, 'color: red');
  assert.equal(node.style.cssText, 'color: red');

  update('color: green');
  assert.equal(node.style.cssText, 'color: green');
});

test('does nothing with an empty string', () => {
  let node = newNode();
  node.style.cssText = 'test text';

  let { update } = style(node, '');
  assert.equal(node.style.cssText, 'test text');

  update('');
  assert.equal(
    node.style.cssText,
    'test text',
    'Update with empty string does not set the text'
  );

  update('color: red');
  assert.equal(node.style.cssText, 'color: red', 'Use an updated value');

  update('');
  assert.equal(
    node.style.cssText,
    '',
    'Returning to an empty string clears cssText'
  );
});

test('handles "undefined"', () => {
  let node = newNode({ color: 'green', height: '100px' });
  let { update } = style(node, undefined);
  compare(node, { color: 'green', height: '100px' });

  update({ color: 'red', width: '10px', '--aVar': 'blue' });
  compare(node, {
    color: 'red',
    height: '100px',
    width: '10px',
    '--aVar': 'blue',
  });

  update(undefined);
  compare(node, { height: '100px' });
});

test.run();
