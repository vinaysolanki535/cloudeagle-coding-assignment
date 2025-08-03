import { faker } from "@faker-js/faker";
import type { DataRecord } from "./interface";

export const generateMockData = (count: number): DataRecord[] => {
  const data: DataRecord[] = [];
  for (let i = 1; i <= count; i++) {
    data.push({
      key: faker.string.uuid(),
      id: i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      salary: parseFloat(
        faker.finance.amount({ min: 40000, max: 150000, dec: 2 })
      ),
      quantity: faker.number.int({ min: 1, max: 100 }),
    });
  }
  return data;
};
