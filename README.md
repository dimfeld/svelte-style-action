# svelte-style-action

This is a simple Svelte action that makes it easier to manage style attributes without needing to manually concatenate strings together.

This action uses `node.style.setProperty` to set the property values, which means that the object keys should dash-separated as when typing CSS, not camel-cased. (i.e. `font-weight` instead of `fontWeight`). This also means that CSS custom properties work properly.

```svelte
<script>
  import { style } from 'svelte-style-action';

  const styles = {
    color: 'green',
    '--aVariable': '40px',
    'font-weight': 700
  };

  setTimeout(() => {
    styles = {
      ...styles,
      color: 'red'
    };
  }, 1000);
</script>

<div use:style={styles}>
  Some content
</div>
```

For convenience, you can also pass a string instead of an object, but you may be better off just setting the `style` attribute directly in that case.

Check it out in the [Svelte REPL](https://svelte.dev/repl/c45857614b4f41c198688f2108f22387?version=3.31.0)!
