package us.avn.oms.service;

import java.util.Collection;

import us.avn.oms.domain.IdName;
import us.avn.oms.domain.Role;
import us.avn.oms.domain.RolePriv;

public interface RoleService {
	
	public Role getRoleById( Long id );
	
	public Collection<Role> getAllRoles();

	public Collection<IdName> getAllRolesAsIdName();

	public void updateRole( Role r );

    public void insertRole( Role r );

    public void deleteRolePrivs( Long id );
    
    public void insertRolePriv( RolePriv rp );
    
}