# Supabase Integration: Detailed Patterns and Best Practices

This document provides an in-depth guide to using Supabase effectively in a Next.js application, covering client initialization, authentication, database interactions, real-time features, storage, and key best practices.

## 1. Supabase Client Initialization

Properly initializing the Supabase client is crucial for secure and efficient interactions with your backend services across different environments in your Next.js application.

### a) Server-side Supabase Client (`@supabase/ssr`)

For Next.js Server Components, Server Actions, and API Routes, it's essential to use `@supabase/ssr` to handle authentication and interact with your Supabase project securely.

*   **Purpose:** Ensures cookie-based session management, making it suitable for server-side operations where user context is required (e.g., fetching user-specific data).
*   **Usage:** Create a new Supabase client instance within your server-side code.

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Route Handler.
            // For more details: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Route Handler.
            // For more details: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options
          }
        },
      },
    }
  )
}
```

### b) Client-side Supabase Client (`@supabase/supabase-js`)

For Client Components (marked with `'use client'`), you'll use the standard `@supabase/supabase-js` client. This client manages tokens in local storage or session storage by default.

*   **Purpose:** Enables client-side authentication flows (sign-up, sign-in, MFA), real-time subscriptions, and direct database/storage interactions from the browser.
*   **Usage:** Initialize the client once and export it for use across your client-side components.

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## 2. Authentication Patterns

Supabase provides flexible authentication options. Integrating them correctly with Next.js requires careful consideration of server-side vs. client-side flows.

### a) Email/Password Authentication
*   **Client-side Flow:** Best for user sign-up and sign-in forms where immediate feedback and interactivity are needed.

```typescript
// In a Client Component (e.g., login-form.tsx)
'use client';

import { createClient } from '@/lib/supabase/client';

async function handleSignIn(email, password) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Sign-in error:', error.message);
    // Handle error, show user message
  }
}

async function handleSignUp(email, password) {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error('Sign-up error:', error.message);
    // Handle error, show user message
  }
}
```

### b) OAuth (Social Logins)
*   **Client-side Redirect:** Typically initiated on the client, redirecting to the OAuth provider and then back to your app.

```typescript
// In a Client Component
'use client';

import { createClient } from '@/lib/supabase/client';

async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) console.error('Error signing in with Google:', error.message);
}
```

*   **Auth Callback Route (`app/auth/callback/route.ts` or `page.tsx`):
** This route handles the redirect from OAuth providers and exchanges the code for a session.

```typescript
// app/auth/callback/route.ts (or page.tsx with 'use client' and useEffect)
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { Database } from '@/lib/database.types' // Assuming you have this type defined

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
```

### c) Server-side User Session Management
*   **Purpose:** To retrieve the current authenticated user's session in Server Components or API Routes. This is crucial for rendering user-specific content or protecting API endpoints.

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div>
      <h1>Hello, {user.email}</h1>
      <p>This is a protected page.</p>
    </div>
  )
}
```

## 3. Database Interaction (CRUD & RLS)

Supabase allows direct database interaction. Emphasize security with Row Level Security and efficient querying.

### a) Create, Read, Update, Delete (CRUD)

*   **Read (Server Component):**

```typescript
export async function getPosts() {
  const supabase = createClient()
  const { data, error } = await supabase.from('posts').select('*')
  if (error) console.error('Error fetching posts:', error)
  return data
}
```

*   **Create (Server Action):**

```typescript
export async function createPost(data: { title: string; content: string }) {
  const supabase = createClient() // Assuming createClient is available
  const { error } = await supabase.from('posts').insert(data)
  if (error) console.error('Error creating post:', error)
}
```

*   **Update (Client Component with API Route):** For operations requiring user interaction and potentially complex validation handled on the server.

```typescript
export async function updatePost(id: number, data: { title?: string; content?: string }) {
  const supabase = createClient()
  const { error } = await supabase.from('posts').update(data).eq('id', id)
  if (error) console.error('Error updating post:', error)
}
```

*   **Delete (Client Component with API Route):** For operations requiring user interaction and potentially complex validation handled on the server.

```typescript
export async function deletePost(id: number) {
  const supabase = createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) console.error('Error deleting post:', error)
}
```

### b) Row Level Security (RLS)
*   **Purpose:** Crucial for granular access control. RLS policies control which rows users can see and modify. Always enable RLS on sensitive tables.
*   **Best Practices:**
    *   **Enable RLS:** Go to your Supabase project -> Authentication -> Policies -> Enable RLS for each table.
    *   **Write Policies:** Example policy for `profiles` table to allow users to `select` their own profile:

    ```sql
    -- Policy for 'profiles' table
    CREATE POLICY "Users can view own profile." ON public.profiles
      FOR SELECT USING (auth.uid() = id);
    ```
    *   **Test Policies:** Thoroughly test your RLS policies to ensure no unauthorized access.

## 4. Real-time Subscriptions

Supabase real-time allows you to listen for database changes and update your UI instantly.

*   **Purpose:** Building chat applications, live dashboards, notifications, or any feature requiring instant updates.
*   **Usage (Client Component):**

```typescript
// In a Client Component or Custom Hook
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

export function ChatMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch of messages
    supabase.from('messages').select('*').order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data);
      });

    // Subscribe to new messages
    const channel = supabase.channel('chat_room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <div key={msg.id} className="p-2 bg-gray-100 rounded">
          <p>{msg.content}</p>
          <small>{new Date(msg.created_at).toLocaleTimeString()}</small>
        </div>
      ))}
    </div>
  );
}
```

## 5. Storage Usage

Supabase Storage allows you to store and serve files like images, videos, and documents.

*   **Purpose:** User avatars, image galleries, file uploads.
*   **Usage (Client Component for upload, Server Component for display):**

```typescript
// In a Client Component for file upload
'use client';

import { createClient } from '@/lib/supabase/client';

async function uploadAvatar(file: File, userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`${userId}/${file.name}`, file, {
      cacheControl: '3600',
      upsert: false,
    });
  if (error) console.error('Error uploading avatar:', error.message);
  return data;
}

// In a Server Component for displaying an avatar
import { createClient } from '@/lib/supabase/server';

async function getUserAvatarUrl(userId: string) {
  const supabase = createClient();
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(`${userId}/avatar.png`); // Assuming 'avatar.png' is the filename
  return data.publicUrl;
}
```

*   **Storage Policies:** Configure policies on your storage buckets for access control, similar to RLS for databases.

## 6. Edge Functions

Supabase Edge Functions are serverless functions written in Deno and deployed globally. They are ideal for custom business logic that needs to run close to your users.

*   **Purpose:** Webhooks, custom API endpoints, image manipulation, data transformations.
*   **Best Practices:**
    *   **Small, Focused Functions:** Keep functions small and performant.
    *   **Environment Variables:** Use Supabase secrets for sensitive information.
    *   **Deployment:** Deploy from your Supabase dashboard or via the Supabase CLI.

## 7. Performance and Security Best Practices

### a) Performance
*   **Minimize Server-side Supabase Client Calls:** Create the `createServerClient` instance once per request lifecycle in Next.js Server Components/Actions/Routes to avoid overhead.
*   **Select Only What You Need:** In database queries, always specify the columns you need (`.select('id, name')`) instead of fetching all columns (`.select('*')`).
*   **Indexing:** Ensure your database tables have appropriate indexes on frequently queried columns to speed up read operations.
*   **Caching:** Leverage Next.js caching mechanisms for data fetched from Supabase in Server Components.
*   **Pagination:** Implement pagination for large datasets to reduce the amount of data fetched at once.

### b) Security
*   **Always Enable RLS:** This is the most critical security feature for your Supabase database. Design policies carefully.
*   **Never Expose Service Role Key Client-side:** The `SUPABASE_SERVICE_ROLE_KEY` has full access to your database and should **never** be exposed in client-side code (`NEXT_PUBLIC_...` environment variables). Use it only on the server.
*   **Validate User Input:** Always validate and sanitize user input on both the client and server to prevent injection attacks.
*   **Secure API Routes/Server Actions:** Implement proper authentication and authorization in your Next.js API Routes or Server Actions that interact with Supabase.
*   **HTTPS Only:** Ensure your application always communicates with Supabase over HTTPS.
*   **Secret Management:** Store sensitive keys (like the `SUPABASE_SERVICE_ROLE_KEY`) as environment variables and avoid hardcoding them.
