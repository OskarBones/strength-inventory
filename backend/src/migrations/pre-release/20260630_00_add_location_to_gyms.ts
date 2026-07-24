import { DataTypes } from 'sequelize';
import { type Migration } from '../utils/db.ts';
// .ts instead of .js to accommodate Vitest

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('gyms', 'location', {
    type: DataTypes.STRING(510)
  });

  await queryInterface.sequelize.query(
    // eslint-disable-next-line @stylistic/quotes, @stylistic/max-len
    "UPDATE gyms SET location = 'https://www.google.com/maps/place/Summit+Station,+Greenland/@72.5801144,-38.4585801,15z/data=!3m1!4b1!4m6!3m5!1s0x4ee2c6c3f0a38e41:0x360f359ccc4433d4!8m2!3d72.5801147!4d-38.4585801!16s%2Fg%2F11t15dz43n?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D'"
  );

  await queryInterface.changeColumn('gyms', 'location', {
    type: DataTypes.STRING(510),
    allowNull: false
  });
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('gyms', 'location');
};

export { up, down };
