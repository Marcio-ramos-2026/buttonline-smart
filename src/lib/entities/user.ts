import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from '@sequelize/core';
  import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';
  
  export class Potato extends Model<InferAttributes<Potato>, InferCreationAttributes<Potato>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;
  
    @Attribute(DataTypes.STRING)
    @NotNull
    declare firstName: string;
  
    @Attribute(DataTypes.STRING)
    declare lastName: string | null;
  }