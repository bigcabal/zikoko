/**
 * RolesService
 *
 */



module.exports = {

  getHighestRole: function(roles) {
    const ROLES = ['admin', 'editor', 'registered'];
    const PUBLIC_ROLE_NAMES = {
      'admin': 'Staff Writer',
      'editor': 'Staff Writer',
      'registered': 'Ninja'
    }

    let lowestIndex = ROLES.length - 1;
    roles.forEach(role => {
      if (role.active) {
        const index = ROLES.indexOf(role.name);
        if ( index < lowestIndex ) lowestIndex = index;
      }
    });

    let highestRole = PUBLIC_ROLE_NAMES[ROLES[lowestIndex]];
    return highestRole;
  }


};

