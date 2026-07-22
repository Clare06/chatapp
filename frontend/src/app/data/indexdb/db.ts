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
      users: '++id,user,hiddenInfo.encryptedPrivateKey',
    });
  }

  async checkIfUserExists(username: string): Promise<boolean> {
    const existingUser = await this.users.where('user').equals(username).first();
    return !!existingUser;
  }

  async addUserWithPrivateKey(user: User): Promise<void> {
    const username = user.user; // Use 'user' property as the unique identifier
    const userExists = await this.checkIfUserExists(username);

    if (userExists) {
      throw new Error('User already exists.');
    } else {
      await this.users.put(user);
    }
  }

  async getUserByName(userName: string): Promise<User | undefined> {
    return this.users.where('user').equals(userName).first();
  }
}

export const db = new AppDB();
