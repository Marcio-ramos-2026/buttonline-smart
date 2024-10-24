import 'reflect-metadata'

import { Entity, Column } from "typeorm"

@Entity()
export class Potato {
    @Column()
    id!: number

    @Column()
    name!: string

    @Column()
    description!: string

    @Column()
    filename!: string

    @Column()
    views!: number

    @Column()
    isPublished!: boolean
}