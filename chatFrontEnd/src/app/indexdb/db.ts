import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  user: string;
  hiddenInfo: { encryptedPrivateKey: string };
}

export class AppDB extends Dexie {
  users!: Table<User, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(1).stores({
      users: '++id,user,hiddenInfo.encryptedPrivateKey', // Include hiddenInfo.encryptedPrivateKey in the schema
    });
  }

  async addUserWithPrivateKey(user: User): Promise<void> {
    await this.users.put(user);
  }

  // Retrieve a user by user name
  async getUserByName(userName: string): Promise<User | undefined> {
    return this.users.where('user').equals(userName).first();
  }
  
}

export const db = new AppDB();