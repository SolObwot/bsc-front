export const PERMISSIONS = {
    USER: {
      CREATE: 'user_create',
      EDIT: 'user_edit',
      DELETE: 'user_delete',
      UPDTAE: 'user_update',
    },
    // Add other permission groups here
    DEPARTMENT: {
      CREATE: 'department_create',
      EDIT: 'department_edit',
      DELETE: 'department_delete',
      UPDATE: 'department_update',
    },
  };
  
  // Optional: Export a flattened list of permissions for easier use
  export const ALL_PERMISSIONS = Object.values(PERMISSIONS).flatMap(group => Object.values(group));