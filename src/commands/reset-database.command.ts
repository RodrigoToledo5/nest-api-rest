import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class ResetDatabaseCommand {
  constructor(private readonly entityManager: EntityManager) {}

  @Command({ command: 'reset:database', describe: 'Reset the database' })
  async handle(): Promise<void> {
    try {
      // Ejecutar consultas SQL para eliminar todas las tablas en el esquema público
      await this.entityManager.query(`
        DROP SCHEMA IF EXISTS public CASCADE;
        CREATE SCHEMA public;
      `);

      console.log('Database reset successful.');
    } catch (error) {
      console.error('Error resetting database:', error);
    }
  }
}
