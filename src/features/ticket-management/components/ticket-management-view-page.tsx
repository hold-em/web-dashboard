'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import { Ticket, mockTickets } from '@/mocks/tickets';
import TicketListSection from './ticket-list-section';
import TicketDesignDialog from './ticket-design-dialog';
import TicketIssuanceDialog from './ticket-issuance-dialog';
import TicketCreationgSection from './ticket-creation-section';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getStoreUsers } from '@/lib/api/sdk.gen';
import { UserResponse } from '@/lib/api/types.gen';

export default function TicketManagementPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [openTrigger, setOpenTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('tickets');

  // API에서 사용자 데이터 가져오기
  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ['storeUsers'],
    queryFn: async () => {
      // 현재 매장 ID를 가져와야 합니다. 임시로 1로 설정
      const storeId = '1';
      const response = await getStoreUsers({
        path: { storeId: Number(storeId) }
      });
      return response.data?.data || [];
    }
  });

  const users: UserResponse[] = usersData || [];

  const addTicket = (ticket: Ticket) => {
    setTickets((prev) => [...prev, ticket]);
  };

  const updateTicket = (ticket: Ticket) => {
    setTickets((prev) =>
      prev.map((item) =>
        item.id === ticket.id ? { ...item, ...ticket } : item
      )
    );
  };

  const selectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setOpenTrigger((prev) => prev + 1);
  };

  const handleExportToExcel = () => {
    // 실제 구현에서는 엑셀 다운로드 로직 구현
    console.log('Export to Excel');
  };

  return (
    <PageContainer>
      <SectionTopToolbar>
        <SectionTopButtonArea>
          <Button
            variant='outline'
            onClick={handleExportToExcel}
            className='mr-2'
          >
            <Download className='mr-2 h-4 w-4' />
            엑셀 다운로드
          </Button>
          <TicketDesignDialog addTicket={addTicket} />
        </SectionTopButtonArea>
      </SectionTopToolbar>

      <Tabs
        defaultValue='tickets'
        className='w-full'
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className='mb-4'>
          <TabsTrigger value='tickets'>이용권 관리</TabsTrigger>
          <TabsTrigger value='history'>이용권 현황</TabsTrigger>
        </TabsList>

        <TabsContent value='tickets'>
          <TicketListSection tickets={tickets} selectTicket={selectTicket} />
          <TicketCreationgSection
            tickets={tickets}
            updateTicket={updateTicket}
          />
        </TabsContent>

        <TabsContent value='history'>
          <div className='rounded-md border p-4'>
            <h3 className='mb-4 text-lg font-medium'>이용권 현황</h3>
            <p className='text-muted-foreground'>
              이용권 지급 현황 및 사용 내역이 표시됩니다.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {selectedTicket && !isUsersLoading && users.length > 0 && (
        <TicketIssuanceDialog
          ticket={selectedTicket}
          users={users}
          openTrigger={openTrigger}
        />
      )}
    </PageContainer>
  );
}
