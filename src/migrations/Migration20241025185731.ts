import { Migration } from '@mikro-orm/migrations';

export class Migration20241025185731 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "potato" ("id" serial primary key, "full_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "bio" text not null default '');`);

    this.addSql(`drop table if exists "users" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "users" ("name" varchar(500) not null, "id" serial primary key, "email" varchar(500) not null, "password" text not null);`);
    this.addSql(`alter table "users" add constraint "unique_email" unique ("email");`);

    this.addSql(`drop table if exists "potato" cascade;`);
  }

}
