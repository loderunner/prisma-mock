// @ts-nocheck

import createPrismaClient from '../src';
import { PrismaClient, Role } from '@prisma/client';


// TODO:
// Pagination
// OrderBy

describe('PrismaClient where', () => {
  const date1 = new Date(2020, 1, 1);
  const date2 = new Date(2020, 1, 2);

  const data = {
    user: [
      {
        id: 1,
        name: 'Henk',
        accountId: 1,
      },
      {
        id: 2,
        name: 'Dirk',
        accountId: 2,
      },
    ],
    account: [
      {
        id: 1,
        name: 'Piet',
        date: date1,
      },
      {
        id: 2,
        name: 'Dirk',
        date: date2,
      },
      {
        id: 3,
        name: 'Sjors',
        date: date2,
      },
    ],
  };

  test('multiple', async () => {
    const client = await createPrismaClient(data);
    const account = await client.account.findMany({
      where: {
        date: { lte: date1 },
        name: 'Dirk'
      },
    });
    expect(account).not.toEqual([data.account[0]]);
  });

  test('startsWith', async () => {
    const client = await createPrismaClient(data);
    const account = await client.account.findMany({
      where: {
        name: { startsWith: 'Di' },
      },
    });
    expect(account).toEqual([data.account[1]]);
  });

  test('endsWith', async () => {
    const client = await createPrismaClient(data);
    const account = await client.account.findMany({
      where: {
        name: { endsWith: 'rk' },
      },
    });
    expect(account).toEqual([data.account[1]]);
  });

  test('contains', async () => {
    const client = await createPrismaClient(data);
    const account = await client.account.findMany({
      where: {
        name: { contains: 'ir' },
      },
    });
    expect(account).toEqual([data.account[1]]);
  });

  test('equals', async () => {
    const client = await createPrismaClient(data);
    const account = await client.account.findMany({
      where: {
        name: { equals: 'Dirk' },
      },
    });
    expect(account).toEqual([data.account[1]]);
  });

  test('gt', async () => {
    const client = await createPrismaClient(data);
    const account = await client.account.findMany({
      where: {
        id: { gt: 1 },
      },
    });
    expect(account).toEqual([data.account[1], data.account[2]]);
  });

  test('gte', async () => {
    const client = await createPrismaClient(data);
    const account = await client.account.findMany({
      where: {
        id: { gte: 1 },
      },
    });
    expect(account).toEqual(data.account);
  });

  test('lt', async () => {
    const client = await createPrismaClient(data);
    const account = await client.account.findMany({
      where: {
        id: { lt: 2 },
      },
    });
    expect(account).toEqual([data.account[0]]);
  });

  test('lte', async () => {
    const client = await createPrismaClient(data);
    const account = await client.account.findMany({
      where: {
        id: { lte: 2 },
      },
    });
    expect(account).toEqual([data.account[0], data.account[1]]);
  });


  test('not', async () => {
    const client = await createPrismaClient(data);
    const account = await client.account.findMany({
      where: {
        id: { not: 2 },
      },
    });
    expect(account).toEqual([data.account[0], data.account[2]]);
  });


  test('notIn', async () => {
    const client = await createPrismaClient(data);
    const account = await client.account.findMany({
      where: {
        name: { notIn: ['Piet', 'Sjors'] },
      },
    });
    expect(account).toEqual([data.account[1]]);
  });

  test('in', async () => {
    const client = await createPrismaClient(data);
    const account = await client.account.findMany({
      where: {
        name: { in: ['Piet', 'Sjors'] },
      },
    });
    expect(account).toEqual([data.account[0], data.account[2]]);
  });

  test('Deep', async () => {
    const client = await createPrismaClient(data);
    const account = await client.user.findMany({
      where: {
        account: {
          name: 'Dirk',
        },
      },
    });
    expect(account.length).toEqual(1);
  });

  test('date', async () => {
    const client = await createPrismaClient(data);
    const accounts = await client.account.findMany({
      where: {
        date: new Date(date1.toDateString()),
      },
    });
    expect(accounts).toEqual([data.account[0]]);
  });

  test("OR", async () => {
    const client = await createPrismaClient(data);
    const accounts = await client.account.findMany({
      where: {
        OR: [{ name: "Dirk" }, { name: "Piet" }],
      },
    })
    expect(accounts.length).toEqual(2);
    expect(accounts).toEqual([data.account[0], data.account[1]]);
  })

  test("NOT", async () => {
    const client = await createPrismaClient(data);
    const accounts = await client.account.findMany({
      where: {
        NOT: [{ name: "Dirk" }, { name: "Piet" }],
      },
    })
    expect(accounts.length).toEqual(1);
    expect(accounts).toEqual([data.account[2]]);
  })

  test("AND", async () => {
    const client = await createPrismaClient(data);
    const accounts = await client.account.findMany({
      where: {
        AND: [{ name: "Dirk" }, { id: 2 }],
      },
    })
    expect(accounts.length).toEqual(1);
    expect(accounts).toEqual([data.account[1]]);
  })

  describe("join", () => {
  
    const data = {
      account: [
        { id: 1, name: "A" },
        { id: 2, name: "B" },
        { id: 3, name: "C" },
      ],
      user: [
        { id: 1, accountId: 1, role: Role.ADMIN },
        { id: 2, accountId: 1, role: Role.ADMIN },
        { id: 3, accountId: 2, role: Role.USER },
        { id: 4, accountId: 2, role: Role.ADMIN },
      ]
    }

    test("every", async () => {
      const client = await createPrismaClient(data);
      const accounts = await client.account.findMany({
        where: {
          users: {
            every: {
              role: Role.ADMIN
            }
          }
        }
      })
      expect(accounts.length).toEqual(1);
      expect(accounts).toEqual([data.account[0]]);
    })
    test("some", async () => {
      const client = await createPrismaClient(data);
      const accounts = await client.account.findMany({
        where: {
          users: {
            some: {
              role: Role.ADMIN
            }
          }
        }
      })
      expect(accounts.length).toEqual(2);
      expect(accounts).toEqual([data.account[0], data.account[1]]);
    })

    test("none", async () => {
      const client = await createPrismaClient(data);
      const accounts = await client.account.findMany({
        where: {
          users: {
            none: {
              role: Role.ADMIN
            }
          }
        }
      })
      expect(accounts.length).toEqual(1);
      expect(accounts).toEqual([data.account[2]]);
    })

  // every?: PostWhereInput | null
  // some?: PostWhereInput | null
  // none?: PostWhereInput | null
  })

  describe("null & undefined", () => {

    const data = {
      user: [
        {
          id: 1,
          name: 'Henk',
        },
        {
          id: 2,
          name: undefined
        }
      ]
    }

    test("null", async () => {
      const client = await createPrismaClient(data);
      const users = await client.user.findMany({
        where: {
          name: null
        },
      })
      expect(users.length).toEqual(1);
    })

    test("undefined", async () => {
      const client = await createPrismaClient(data);
      const users = await client.user.findMany({
        where: {
          name: undefined
        },
      })
      expect(users.length).toEqual(2);
    })
  })



});
