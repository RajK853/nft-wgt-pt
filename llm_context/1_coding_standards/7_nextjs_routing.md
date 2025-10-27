# Next.js Routing

Use the `<Link>` component from `next/link` for internal navigation.

## Why?

*   **Performance**: Faster client-side navigation.
*   **SEO**: `href` is available for crawlers.
*   **UX**: Smoother, app-like experience.

## Example

```jsx
import Link from 'next/link';

function MyComponent() {
  return (
    <Link href="/about">
      About
    </Link>
  );
}
```