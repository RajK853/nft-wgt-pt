import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: penalties } = await supabase.from("penalties").select(`
    id,
    date,
    status,
    shooter:players!penalties_shooter_id_fkey ( name ),
    keeper:players!penalties_keeper_id_fkey ( name )
  `);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Penalty Tracker</h1>
      <div className="w-full max-w-4xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-4">Date</th>
              <th className="border-b p-4">Shooter</th>
              <th className="border-b p-4">Keeper</th>
              <th className="border-b p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {penalties?.map((penalty) => (
              <tr key={penalty.id}>
                <td className="border-b p-4">{new Date(penalty.date).toLocaleDateString()}</td>
                <td className="border-b p-4">{penalty.shooter?.name}</td>
                <td className="border-b p-4">{penalty.keeper?.name}</td>
                <td className="border-b p-4">{penalty.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
