import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold mb-4">Penalty Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="mb-4">Click me</Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Shooter</TableHead>
                <TableHead>Keeper</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {penalties?.map((penalty) => (
                <TableRow key={penalty.id}>
                  <TableCell>{new Date(penalty.date).toLocaleDateString()}</TableCell>
                  <TableCell>{penalty.shooter?.name}</TableCell>
                  <TableCell>{penalty.keeper?.name}</TableCell>
                  <TableCell>{penalty.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
