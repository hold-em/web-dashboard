export interface Ticket {
  id: string | number;
  name: string;
  price: number;
  expiration_data: string;
  remaining_count: number;
}

export const mockUsers: Ticket[] = [];
