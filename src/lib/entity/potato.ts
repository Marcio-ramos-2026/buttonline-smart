import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Potato {

   @PrimaryKey()
   id!: number;

   @Property()
   fullName!: string;

   @Property()
   email!: string;

   @Property()
   password!: string;

   @Property({ type: 'text' })
   bio = '';

}