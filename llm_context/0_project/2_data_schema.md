# Data Schema

The project uses a **PostgreSQL** database managed by **Supabase**.

## `profiles` Table Example

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, FK to `auth.users.id` | User's unique ID. |
| `username` | `text` | Unique | User's display name. |
| `full_name` | `text` | | User's full name. |
| `avatar_url` | `text` | | URL for user's avatar. |
| `updated_at` | `timestamp` | | Last update timestamp. |

## Row-Level Security (RLS)

RLS is enabled to restrict data access to the owner.

## `game_events` Table Example

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `date` | `timestamp` | | Date of the event. |
| `player_name` | `text` | | Name of the player. |
| `keeper_name` | `text` | | Name of the goalkeeper. |
| `status` | `text` | CHECK (status IN ('saved', 'goal', 'out')) | Status of the event (saved, goal, or out). |