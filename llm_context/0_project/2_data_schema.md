# Data Schema

The application uses a PostgreSQL database managed by Supabase. The schema is defined and managed through the Supabase dashboard or migrations.

## Example Table: `profiles`

This table stores user profile information.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Foreign Key to `auth.users.id` | The user's unique identifier. |
| `username` | `text` | Unique | The user's display name. |
| `full_name` | `text` | | The user's full name. |
| `avatar_url` | `text` | | URL to the user's avatar image. |
| `updated_at` | `timestamp with time zone` | | Timestamp of the last update. |

## Row-Level Security (RLS)

Row-Level Security is enabled on tables to ensure users can only access their own data. Policies are defined in the Supabase dashboard.
