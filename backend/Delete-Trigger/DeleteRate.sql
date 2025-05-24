USE colorgame_refactor;

DELIMITER $$

CREATE TRIGGER DeleteRate
AFTER UPDATE ON rate
FOR EACH ROW
BEGIN
  -- Handle isDeleted change
  IF NEW.isDeleted = TRUE AND OLD.isDeleted = FALSE THEN
    UPDATE colorgame_refactor_archive.rate
    SET isDeleted = TRUE
    WHERE runnerId = OLD.runnerId;
  END IF;

  -- Handle isPermanentDeleted change
  IF NEW.isPermanentDeleted = TRUE AND OLD.isPermanentDeleted = FALSE THEN
    UPDATE colorgame_refactor_archive.rate
    SET isPermanentDeleted = TRUE
    WHERE runnerId = OLD.runnerId;
    
  END IF;
END$$

DELIMITER ;