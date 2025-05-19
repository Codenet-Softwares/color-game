USE colorgame_refactor;

DELIMITER $$

CREATE TRIGGER InsertAdmin
AFTER INSERT ON admins
FOR EACH ROW
BEGIN
  INSERT INTO colorgame_refactor_archive.admins (
    id,
    adminId,
    userName,
    password,
    roles,
    permissions,
    isReset,
    token
  ) VALUES (
    NEW.id,
    NEW.adminId,
    NEW.userName,
    NEW.password,
    NEW.roles,
    NEW.permissions,
    NEW.isReset,
    NEW.token
  );
END$$

DELIMITER ;
