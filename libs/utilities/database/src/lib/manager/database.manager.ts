import { createConnection, ConnectionOptions, Connection } from 'typeorm';

let instance: DatabaseManager;

export class DatabaseManager {
  public connection: Connection;
  private options: ConnectionOptions;

  constructor(options: ConnectionOptions) {
    this.options = options;
  }

  public async create() {
    try {
      this.connection = await createConnection(this.options);
      console.log('Connected to database');
    } catch (err) {
      console.log('ERROR: Could not establish connection to database');
    }
  }
}

/**
 * Maintains and return a singleton instance of a TypeORM connection.
 *
 * Options are required on application initialization.
 */
export async function manager(options?: ConnectionOptions) {
  // If database manager instance does not exist yet, create one and all the connection initializer.
  if (instance === undefined) {
    instance = new DatabaseManager(options);

    // Wait until connection has been made before returning.
    await instance.create();
  }

  return instance;
}
