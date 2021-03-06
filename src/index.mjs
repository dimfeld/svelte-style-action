export function style(node, initialVars) {
  let oldVars;

  function applyStyles(vars) {
    if (typeof vars === 'string') {
      if (!oldVars && !vars) {
        // Do nothing if it's an empty string;
        return;
      }

      node.style.cssText = vars;
      oldVars = vars;
      return;
    }

    vars = vars || {};
    for (let [k, v] of Object.entries(vars)) {
      node.style.setProperty(k, v);
    }

    for (let k of Object.keys(oldVars || {})) {
      if (!(k in vars)) {
        // In the DOM, setting it to an empty string actually deletes it.
        node.style.setProperty(k, '');
      }
    }

    oldVars = vars;
  }

  applyStyles(initialVars);

  return {
    update(newVars) {
      applyStyles(newVars);
    },
  };
}
