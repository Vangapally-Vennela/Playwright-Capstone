import { faker } from '@faker-js/faker';

export interface UserData {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

/** Builds a unique, valid user so tests are independent and parallel-safe. */
export function buildUser(overrides: Partial<UserData> = {}): UserData {
  const first = faker.person.firstName();
  const last = faker.person.lastName();
  const unique = `${Date.now()}${faker.string.alphanumeric(5).toLowerCase()}`;
  return {
    name: `${first}${faker.string.alpha(3)}`,
    email: `qa.${unique}@example.com`,
    password: 'Passw0rd!23',
    title: 'Mr',
    birthDay: '15',
    birthMonth: 'June',
    birthYear: '1990',
    firstName: first,
    lastName: last,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: 'India',
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode('#####'),
    mobile: faker.string.numeric(10),
    ...overrides,
  };
}
