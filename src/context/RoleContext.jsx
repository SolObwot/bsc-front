import { createContext, useState, useEffect } from 'react';
import { roleService } from '../services/role.service';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      const rolesData = await roleService.getRoles();
      const permissionsData = await roleService.getPermissions();
      setRoles(rolesData.data);
      setPermissions(permissionsData.data);
    };

    fetchRolesAndPermissions();
  }, []);

  return (
    <RoleContext.Provider value={{ roles, permissions }}>
      {children}
    </RoleContext.Provider>
  );
};
