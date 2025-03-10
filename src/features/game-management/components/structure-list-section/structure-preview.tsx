import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { GameItem } from '../../types/game-structure';

interface StructurePreviewProps {
  items: GameItem[];
}

export function StructurePreview({ items }: StructurePreviewProps) {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>레벨</TableHead>
            <TableHead>SB</TableHead>
            <TableHead>BB</TableHead>
            <TableHead>앤티</TableHead>
            <TableHead>시간</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              {item.type === 'game' ? (
                <>
                  <TableCell>{item.level}</TableCell>
                  <TableCell>{item.sb?.toLocaleString()}</TableCell>
                  <TableCell>{item.bb?.toLocaleString()}</TableCell>
                  <TableCell>{item.entry?.toLocaleString()}</TableCell>
                  <TableCell>{item.duration}분</TableCell>
                </>
              ) : (
                <TableCell colSpan={5} className='text-center font-medium'>
                  {item.breakDuration}분 휴식
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
