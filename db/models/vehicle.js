/* jshint indent: 2 */
const common = require('../../helpers/common');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vehicle', {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    
    name: {
      type: DataTypes.STRING(60),
      defaultValue: '',
      allowNull: true
    },

    baseFare: {
      type: DataTypes.STRING(25),
      defaultValue: 0,
      allowNull: false, 
    },
    price: {
      type: DataTypes.FLOAT(25),
      defaultValue: 0,
      allowNull: false, 
    },

    icon: {
      type: DataTypes.TEXT,
      get() {
        if(this.getDataValue('icon')!=null && this.getDataValue('icon')!="")
        return config.IMAGE_APPEND_URL+"vehicle/icons/"+this.getDataValue('icon')
    },
      defaultValue: "",
      allowNull: true, 
    },

   
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 1
    },
    createdAt: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: common.timestamp()
    }
  }, {
    tableName: 'vehicle',
    timestamps: false
  });
};
