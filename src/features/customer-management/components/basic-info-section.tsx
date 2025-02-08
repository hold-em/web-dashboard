import { Section, SectionContent, SectionTitle } from '@/components/section';
import { User } from '@/mocks/users';
import { Button } from '@/components/ui/button';

interface BasicInfoSectionProps {
  user: User;
}

export default function BasicInfoSection({ user }: BasicInfoSectionProps) {
  const userFields = [
    { label: '이름', value: user.name },
    { label: '전화번호', value: user.phone },
    { label: '이메일', value: user.email },
    { label: '회원유형', value: user.member_status },
    { label: '가입일', value: user.created_at },
    { label: '현재 리그 포인트', value: user.league_points.toLocaleString() }
  ];

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
        {user.member_status === '임시회원' && (
          <div>
            <Button>정회원 연동</Button>
          </div>
        )}
      </SectionContent>
    </Section>
  );
}
