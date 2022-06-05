// import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  //deklarisemo entitet kakav ce da bude user i kako cemo da ga smestamo u bazu podataka
  //moramo entitet da importujemo u parent komponentu, takodje i u root module tj app.module
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude() //exclude dekorator, potreban da ne bi vracao password prilikom get requesta
  password: string;

  @AfterInsert() //decorator hook koji ce pozvati funkciju nakon sto insetruje user-a u bazi
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  //ako prosledimo direktno objekat prilikom kreiranja user-a tj bez da prvo napravimo instancu entiteta sa create
  //nece se izvrsiti nijedan od ovih hook-ova

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }
}
