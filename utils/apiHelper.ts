import { APIRequestContext, expect } from '@playwright/test';
import { UserData } from './dataGenerator';

/**
 * Uses the site's public REST API (https://automationexercise.com/api_list) for
 * fast, reliable test setup/teardown so UI tests only exercise the flow under test.
 * Note: the API returns HTTP 200 and puts the real status in the JSON `responseCode`.
 */
export class ApiHelper {
  constructor(private readonly request: APIRequestContext) {}

  async createUser(u: UserData): Promise<void> {
    const res = await this.request.post('/api/createAccount', {
      form: {
        name: u.name,
        email: u.email,
        password: u.password,
        title: u.title,
        birth_date: u.birthDay,
        birth_month: u.birthMonth,
        birth_year: u.birthYear,
        firstname: u.firstName,
        lastname: u.lastName,
        company: u.company,
        address1: u.address1,
        address2: u.address2,
        country: u.country,
        zipcode: u.zipcode,
        state: u.state,
        city: u.city,
        mobile_number: u.mobile,
      },
    });
    const body = await res.json();
    expect(body.responseCode, `createAccount failed: ${JSON.stringify(body)}`).toBe(201);
  }

  async deleteUser(email: string, password: string): Promise<void> {
    // Best effort: cleanup must never fail a test.
    await this.request
      .delete('/api/deleteAccount', { form: { email, password } })
      .catch(() => undefined);
  }
}
