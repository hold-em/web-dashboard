import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface TemplateInfoCardProps {
  templateName: string;
  onTemplateNameChange: (name: string) => void;
  onCancel: () => void;
  onSave: () => void;
  isUpdating: boolean;
  selectedTemplateId: string | null;
}

export function TemplateInfoCard({
  templateName,
  onTemplateNameChange,
  onCancel,
  onSave,
  isUpdating,
  selectedTemplateId
}: TemplateInfoCardProps) {
  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>템플릿 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='templateName'>템플릿 이름</Label>
            <Input
              id='templateName'
              value={templateName}
              onChange={(e) => onTemplateNameChange(e.target.value)}
              placeholder='템플릿 이름 입력'
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onCancel} variant='outline' className='mr-auto'>
          취소
        </Button>
        <Button onClick={onSave} disabled={isUpdating}>
          <Save className='mr-2 h-4 w-4' />
          {selectedTemplateId ? '템플릿 업데이트' : '템플릿 저장'}
        </Button>
      </CardFooter>
    </Card>
  );
}
