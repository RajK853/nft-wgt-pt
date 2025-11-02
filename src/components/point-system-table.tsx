import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Outcome {
  description: string;
  points: number;
}

interface PointSystemTableProps {
  title: string;
  outcomes: Outcome[];
}

export function PointSystemTable({ title, outcomes }: PointSystemTableProps) {
  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[75%]">Outcome</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outcomes.map((outcome, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{outcome.description}</TableCell>
              <TableCell className="text-right">{outcome.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
