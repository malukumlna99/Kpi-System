const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Devisi = sequelize.define('devisi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_devisi: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 100],
    },
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'devisi',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeUpdate: (devisi) => {
      devisi.updated_at = new Date();
    },
  },
});

module.exports = Devisi;
