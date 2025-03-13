import { Section, SectionContent, SectionTitle } from '@/components/section';
import type { UserResponse } from '@/lib/api/types.gen';
import { Button } from '@/components/ui/button';
import { useTempUser } from '@/hooks/use-temp-user';
import { toast } from 'sonner';

interface BasicInfoSectionProps {
  user: UserResponse;
  storeId: string;
  normalUserId: string;
}

export default function BasicInfoSection({
  user,
  storeId,
  normalUserId
}: BasicInfoSectionProps) {
  const { mergeMember, isMerging } = useTempUser();

  const userFields = [
    { label: '이름', value: user.name },
    { label: '전화번호', value: user.phone_number },
    { label: '이메일', value: user.email_address },
    { label: '회원유형', value: user.type === 'TEMP' ? '임시회원' : '정회원' },
    { label: '가입일', value: user.created_by }
  ];

  const handleMergeMember = () => {
    mergeMember(
      {
        storeId,
        tempUserId: user.id,
        normalUserId
      },
      {
        onSuccess: () => {
          toast.success('정회원 연동 완료', {
            description: '임시회원이 정회원으로 연동되었습니다.'
          });
        },
        onError: () => {
          toast.error('정회원 연동 실패', {
            description: '임시회원 연동 중 오류가 발생했습니다.'
          });
        }
      }
    );
  };

  return (
    <Section>
      <SectionTitle>기본 정보</SectionTitle>
      <SectionContent>
        <div className='grid grid-cols-2 gap-4'>
          {userFields.map((field, index) => (
            <div key={index} className='grid gap-2'>
              <div className='text-sm font-medium leading-none text-gray-600'>
                {field.label}
              </div>
              <div className='text-base text-gray-900'>{field.value}</div>
            </div>
          ))}
        </div>
        {user.type === 'TEMP' && (
          <div className='mt-4'>
            <Button onClick={handleMergeMember} disabled={isMerging}>
              {isMerging ? '정회원 연동 중...' : '정회원 연동'}
            </Button>
          </div>
        )}
      </SectionContent>
    </Section>
  );
}
