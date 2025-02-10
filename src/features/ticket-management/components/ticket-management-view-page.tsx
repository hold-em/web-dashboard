'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import { mockUsers } from '@/mocks/users';
import { mockStores } from '@/mocks/stores';
import { Ticket, mockTickets } from '@/mocks/tickets';
import TicketListSection from './ticket-list-section';
import TicketDesignDialog from './ticket-design-dialog';
import TicketIssuanceDialog from './ticket-issuance-dialog';
import TicketCreationgSection from './ticket-creation-section';

export default function TicketManagementPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [openTrigger, setOpenTrigger] = useState(0);

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

  return (
    <PageContainer>
      <SectionTopToolbar>
        <SectionTopButtonArea>
          <TicketDesignDialog addTicket={addTicket} />
        </SectionTopButtonArea>
      </SectionTopToolbar>
      <TicketListSection tickets={tickets} selectTicket={selectTicket} />
      <TicketCreationgSection tickets={tickets} updateTicket={updateTicket} />
      {selectedTicket && (
        <TicketIssuanceDialog
          ticket={selectedTicket}
          users={mockUsers}
          stores={mockStores}
          openTrigger={openTrigger}
        />
      )}
    </PageContainer>
  );
}
