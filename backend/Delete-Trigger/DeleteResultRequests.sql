USE colorgame_refactor;

DELIMITER $$

CREATE TRIGGER DeleteResultRequests
AFTER UPDATE ON ResultRequests
FOR EACH ROW
BEGIN
  -- Handle isDeleted change
  IF NEW.isDeleted = TRUE AND OLD.isDeleted = FALSE THEN
    UPDATE colorgame_refactor_archive.ResultRequests
    SET isDeleted = TRUE
    WHERE marketId = OLD.marketId;
  END IF;

  -- Handle isPermanentDeleted change
  IF NEW.isPermanentDeleted = TRUE AND OLD.isPermanentDeleted = FALSE THEN
    UPDATE colorgame_refactor_archive.ResultRequests
    SET isPermanentDeleted = TRUE
    WHERE marketId = OLD.marketId;
    
  END IF;
END$$

DELIMITER ;