# Detailed Component Knowledge: Patterns and Best Practices

This document provides a detailed overview of various component patterns and best practices within a Next.js, React, Supabase, Tailwind CSS, and shadcn/ui application. It emphasizes flexibility, acknowledging that different components have different requirements and use cases.

## 1. Layout Components

Layout components are responsible for defining the overall structure and persistent elements of your application's UI, such as headers, footers, and navigation.

### Purpose and Use Cases
*   **Consistent Structure:** Ensure a uniform look and feel across multiple pages.
*   **Shared UI Elements:** House elements that appear on many pages (e.g., navigation bars, sidebars, footers).
*   **Root Providers:** Wrap the application with context providers (e.g., theme providers, authentication context).

### Common Patterns

#### a) Root Layout (`app/layout.tsx` in Next.js App Router)
*   **Description:** The top-level layout that wraps your entire application. It's a Server Component by default.
*   **Best Practices:**
    *   **Minimal Client-side Logic:** Keep this component as a Server Component as much as possible to minimize client-side JavaScript.
    *   **Global Styles:** Import global CSS files (e.g., `globals.css` for Tailwind) here.
    *   **Metadata:** Define global metadata using the `metadata` export.
    *   **HTML/Body Tags:** This is where you define the `<html>` and `<body>` tags.
    *   **Providers:** Wrap children with necessary providers (e.g., `ThemeProvider`, `AuthProvider`).

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider'; // Example

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My App',
  description: 'A Next.js application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### b) Nested Layouts (`app/dashboard/layout.tsx`)
*   **Description:** Layouts specific to a segment of your application (e.g., a dashboard, an admin panel). They wrap their children and inherit from parent layouts.
*   **Best Practices:**
    *   **Segment-specific UI:** Add navigation or UI elements relevant only to that segment.
    *   **Data Fetching:** Fetch data relevant to the entire segment (e.g., user profile for a dashboard).

```typescript
// app/dashboard/layout.tsx
import DashboardNav from '@/components/dashboard-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <DashboardNav />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
```

### Integration with Frameworks
*   **Next.js:** Core concept of the App Router for defining UI hierarchy.
*   **React:** Standard React component composition.
*   **Tailwind CSS:** Used extensively for styling layout elements (flexbox, grid, spacing).
*   **shadcn/ui:** Can be used for navigation components (e.g., `Navbar`, `Sidebar` built with `Button`, `Sheet`).

## 2. Page Components

Page components are the entry points for specific routes in your application. They are responsible for fetching data, orchestrating other components, and defining the content of a particular view.

### Purpose and Use Cases
*   **Route Entry Point:** Each `page.tsx` file corresponds to a specific URL path.
*   **Data Orchestration:** Fetching and passing data to child components.
*   **View Composition:** Assembling various UI components to form a complete page.

### Common Patterns

#### a) Server Page Components (Default in App Router)
*   **Description:** Ideal for pages that require data fetching before rendering, or for pages with content that doesn't change frequently. They run on the server.
*   **Best Practices:**
    *   **Direct Data Fetching:** Use `async/await` directly within the component to fetch data (e.g., from Supabase).
    *   **Pass Data as Props:** Pass fetched data down to Client Components as props.
    *   **Minimize Client-side Dependencies:** Avoid importing Client Components that are not strictly necessary.

```typescript
// app/products/page.tsx
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/product-card'; // A Client Component

export default async function ProductsPage() {
  const supabase = createClient();
  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Error fetching products:', error.message);
    return <div>Error loading products.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

#### b) Client Page Components (with `'use client'`)
*   **Description:** Used when a page requires client-side interactivity, event listeners, or browser-specific APIs. The entire component and its children will be rendered on the client.
*   **Best Practices:**
    *   **Interactive UI:** Use for forms, interactive maps, or components with complex state management.
    *   **Data Fetching:** If data fetching is dynamic and depends on user interaction, perform it client-side using `useEffect` or a data fetching library.
    *   **Hydration:** Be mindful of hydration issues if you have complex client-side logic that needs to run before the page is interactive.

```typescript
// app/counter/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CounterPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Count: {count}</h1>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  );
}
```

### Integration with Frameworks
*   **Next.js:** Fundamental to the App Router for defining routes and data fetching strategies.
*   **React:** Standard React component composition and state management.
*   **Supabase:** Data fetching can occur on both server and client sides, depending on the component type.
*   **Tailwind CSS:** Used for styling the overall page layout and elements.
*   **shadcn/ui:** Used to compose the UI elements within the page.

## 3. UI Components (shadcn/ui Based)

`shadcn/ui` provides a collection of beautifully designed, accessible, and customizable UI components. The key philosophy is that you own the code, allowing for full control and customization.

### Purpose and Use Cases
*   **Rapid UI Development:** Quickly build consistent and polished user interfaces.
*   **Accessibility:** Components are built on Radix UI primitives, ensuring high accessibility standards.
*   **Customization:** Easily theme and modify components to match your brand.

### Common Patterns

#### a) Basic Usage
*   **Description:** Importing and using `shadcn/ui` components directly.
*   **Best Practices:**
    *   **Install via CLI:** Use `npx shadcn-ui@latest add <component-name>` to add components.
    *   **`cn` Utility:** Use the `cn` utility (from `clsx` and `tailwind-merge`) for conditionally applying Tailwind classes and merging them intelligently.

```typescript
// components/my-button.tsx
import { Button } from '@/components/ui/button';

export function MyButton() {
  return <Button variant="outline">Click Me</Button>;
}
```

#### b) Customizing Components
*   **Description:** Modifying the appearance or behavior of `shadcn/ui` components.
*   **Best Practices:**
    *   **Tailwind Configuration:** Adjust colors, fonts, and other design tokens in `tailwind.config.js`.
    *   **CSS Variables:** Modify CSS variables in `globals.css` for deeper theming.
    *   **Wrapper Components:** Create your own components that wrap `shadcn/ui` components to apply consistent styling or add specific logic.

```typescript
// components/custom-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CustomCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  title: string;
}

export function CustomCard({ title, className, children, ...props }: CustomCardProps) {
  return (
    <Card className={cn('border-blue-500 shadow-lg', className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

#### c) Composing with Radix UI Primitives
*   **Description:** For highly custom components, you can directly use the underlying Radix UI primitives that `shadcn/ui` is built upon.
*   **Best Practices:**
    *   **Full Control:** Provides maximum flexibility for behavior and styling.
    *   **Accessibility:** Radix handles accessibility concerns, allowing you to focus on UI.

### Integration with Frameworks
*   **Next.js:** Used within both Server and Client Components.
*   **React:** Standard React components.
*   **Tailwind CSS:** The primary styling method for `shadcn/ui` components.
*   **Supabase:** UI components can be used to display data fetched from Supabase or to build forms that interact with Supabase.

## 4. Data Display Components

Data display components are responsible for presenting information fetched from various sources (e.g., Supabase) to the user in a clear and organized manner.

### Purpose and Use Cases
*   **Information Presentation:** Display lists, tables, detail views, charts, etc.
*   **Readability:** Structure data to be easily digestible by the user.
*   **Interactivity:** May include sorting, filtering, or pagination features.

### Common Patterns

#### a) Simple List/Card Display
*   **Description:** Iterating over an array of data and rendering a component for each item.
*   **Best Practices:**
    *   **Key Prop:** Always provide a unique `key` prop when rendering lists of elements.
    *   **Dedicated Item Component:** Create a separate component for each item in the list to improve reusability and readability.

```typescript
// components/product-list.tsx
import { CustomCard } from './custom-card';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <CustomCard key={product.id} title={product.name}>
          <p>{product.description}</p>
          <p className="font-bold">${product.price.toFixed(2)}</p>
        </CustomCard>
      ))}
    </div>
  );
}
```

#### b) Table Display (using `shadcn/ui` Table)
*   **Description:** Presenting tabular data using the `shadcn/ui` Table component.
*   **Best Practices:**
    *   **Accessibility:** Ensure proper `<th>` and `<td>` usage for screen readers.
    *   **Pagination/Sorting/Filtering:** Implement these features for large datasets, often with client-side state or server-side parameters.

```typescript
// components/user-table.tsx
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Integration with Frameworks
*   **Next.js:** Data is often fetched in Page Components (Server or Client) and passed to these components.
*   **React:** Standard React component composition.
*   **Supabase:** The primary source of data for these components.
*   **Tailwind CSS:** Used for styling tables, cards, and other display elements.
*   **shadcn/ui:** Provides ready-to-use components like `Table`, `Card`, `Badge` for displaying data.

## 5. Form Components

Form components are crucial for user interaction, allowing them to input data, submit information, and trigger actions within the application.

### Purpose and Use Cases
*   **User Input:** Collect data from users (e.g., login credentials, registration details, product information).
*   **Data Submission:** Send user-provided data to the backend (e.g., Supabase).
*   **Validation:** Ensure data integrity and provide feedback to the user.

### Common Patterns

#### a) Simple Forms (Client Component)
*   **Description:** Basic forms handled entirely on the client-side using React state.
*   **Best Practices:**
    *   **Controlled Components:** Use `useState` to manage form input values.
    *   **Basic Validation:** Implement simple client-side validation.

```typescript
// components/contact-form.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { name, email });
    // Integrate with Supabase or API route here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

#### b) Forms with `react-hook-form` and Zod (Client Component)
*   **Description:** For more complex forms requiring robust validation, error handling, and performance optimizations.
*   **Best Practices:**
    *   **Schema Validation:** Define your form schema using Zod for powerful and type-safe validation.
    *   **Controlled Inputs:** `react-hook-form` handles input registration and state management efficiently.
    *   **Error Display:** Easily display validation errors to the user.
    *   **Submission Handling:** Integrate with Supabase or Next.js API routes for data submission.

```typescript
// components/login-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import *s z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // shadcn/ui form components

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Login submitted:', values);
    // Integrate with Supabase auth here
    // const supabase = createClient(); // Client-side Supabase client
    // const { error } = await supabase.auth.signInWithPassword(values);
    // if (error) { /* handle error */ }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
```

### Integration with Frameworks
*   **Next.js:** Forms are typically Client Components. Submission can interact with Next.js API routes or directly with Supabase.
*   **React:** Core of form handling, especially with `react-hook-form`.
*   **Supabase:** Used for authentication (sign-up, sign-in) and database mutations (inserting/updating data).
*   **Tailwind CSS:** Styling form elements and layouts.
*   **shadcn/ui:** Provides accessible and styled form components (`Input`, `Label`, `Button`, `Form` components).

## 6. Custom Hooks

Custom Hooks are reusable JavaScript functions that encapsulate stateful logic and side effects, allowing you to share logic across components without prop drilling or complex render prop patterns.

### Purpose and Use Cases
*   **Logic Reusability:** Share common logic (e.g., authentication, data fetching, form handling) across multiple components.
*   **Separation of Concerns:** Decouple logic from UI, making components cleaner and more focused.
*   **Stateful Logic:** Manage state and side effects in a reusable way.

### Common Patterns

#### a) `useAuth` Hook
*   **Description:** Encapsulates Supabase authentication logic, providing user status, login/logout functions.
*   **Best Practices:**
    *   **Context API:** Often combined with React Context to provide authentication state globally.
    *   **Supabase Client:** Initialize and use the Supabase client within the hook.

```typescript
// lib/hooks/use-auth.ts
'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import { createClient } from '@/lib/supabase/client'; // Client-side Supabase client
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error.message);
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
      setIsLoading(false);
      throw error;
    }
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

#### b) `useData` Hook (for fetching data)
*   **Description:** Encapsulates data fetching logic, often with loading and error states.
*   **Best Practices:**
    *   **Generics:** Make the hook generic to work with different data types.
    *   **Caching/Revalidation:** Integrate with data fetching libraries (SWR, React Query) for advanced caching and revalidation strategies.

```typescript
// lib/hooks/use-data.ts
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useData<T>(tableName: string) {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      const { data: fetchedData, error: fetchError } = await supabase.from(tableName).select('*');

      if (fetchError) {
        setError(fetchError.message);
        setData(null);
      } else {
        setData(fetchedData as T[]);
      }
      setIsLoading(false);
    }

    fetchData();
  }, [tableName, supabase]);

  return { data, isLoading, error };
}
```

### Integration with Frameworks
*   **Next.js:** Custom hooks are typically Client Components (marked with `'use client'` if they use React hooks).
*   **React:** The core mechanism for sharing stateful logic.
*   **Supabase:** Often used to abstract away Supabase client interactions (e.g., authentication, data fetching).
*   **Tailwind CSS:** Hooks themselves don't directly interact with styling, but the components that use them will be styled with Tailwind.
*   **shadcn/ui:** Hooks can provide data or state that influences the rendering or behavior of `shadcn/ui` components.
