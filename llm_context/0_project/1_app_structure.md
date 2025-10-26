# Application Structure

The application follows the standard Next.js App Router structure.

*   `app/`: Contains the application's routes, pages, and layouts.
    *   `layout.tsx`: The root layout for the application.
    *   `page.tsx`: The main entry point for the root URL.
    *   `[...slug]/page.tsx`: Example of dynamic routes.
*   `components/`: Contains reusable React components.
*   `lib/`: Contains utility functions and Supabase client initialization.
*   `pages/api/`: Contains API routes (if using Pages Router for APIs).
*   `public/`: Contains static assets like images and fonts.
*   `styles/`: Contains global styles and Tailwind CSS configuration.
*   `.env.local`: For environment variables.
