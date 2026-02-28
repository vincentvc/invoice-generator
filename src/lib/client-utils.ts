import { Address } from '@/types/invoice';
import { Client } from '@/types/client';

export function normalizeClientName(name: string): string {
  return name.trim().toLowerCase();
}

export function clientFromAddress(address: Address): Omit<Client, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: address.name,
    email: address.email,
    phone: address.phone,
    address: address.address,
    city: address.city,
    state: address.state,
    zip: address.zip,
    country: address.country,
    notes: '',
  };
}

export function addressFromClient(client: Client): Address {
  return {
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
    city: client.city,
    state: client.state,
    zip: client.zip,
    country: client.country,
  };
}
