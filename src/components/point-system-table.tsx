import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';

/**
 * Defines the props for the PointSystemTable component.
 */
interface PointSystemTableProps {
  /** The array of event outcomes to display in the table. */
  outcomes: EventOutcome[];
}

/**
 * A table component that displays the scoring system for various events,
 * showing points awarded to both shooters and goalkeepers.
 *
 * @param {PointSystemTableProps} { outcomes } - The props for the component.
 * @returns {JSX.Element} The rendered table component.
 */
export function PointSystemTable({ outcomes }: PointSystemTableProps) {
  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[33%] font-bold text-lg">Event</TableHead>
            <TableHead className="text-right font-bold text-lg">Shooter Points</TableHead>
            <TableHead className="text-right font-bold text-lg">Goalkeeper Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outcomes.map((outcome, index) => (
            <TableRow key={index} className={cn(
              "data-[state=selected]:bg-muted/50 hover:bg-muted/50",
              index % 2 === 0 ? "bg-background" : "bg-muted/20"
            )}>
              <TableCell className="font-medium text-base">{outcome.event}</TableCell>
              <TableCell className={cn(
                "text-right text-base",
                outcome.shooterPoints > 0 && "text-green-600",
                outcome.shooterPoints < 0 && "text-red-600"
              )}>
                {outcome.shooterPoints}
              </TableCell>
              <TableCell className={cn(
                "text-right text-base",
                outcome.goalkeeperPoints > 0 && "text-green-600",
                outcome.goalkeeperPoints < 0 && "text-red-600"
              )}>
                {outcome.goalkeeperPoints}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
