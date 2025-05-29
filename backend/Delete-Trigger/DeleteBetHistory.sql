USE colorgame_refactor;

DELIMITER $$

CREATE TRIGGER DeleteBetHistory
AFTER UPDATE ON betHistory
FOR EACH ROW
BEGIN
  -- Handle isDeleted change
  IF NEW.isDeleted = TRUE AND OLD.isDeleted = FALSE THEN
    UPDATE colorgame_refactor_archive.betHistory
    SET isDeleted = TRUE
    WHERE marketId = OLD.marketId;
  END IF;

  -- Handle isPermanentDeleted change
  IF NEW.isPermanentDeleted = TRUE AND OLD.isPermanentDeleted = FALSE THEN
    UPDATE colorgame_refactor_archive.betHistory
    SET isPermanentDeleted = TRUE
    WHERE marketId = OLD.marketId;
    
  END IF;
END$$

DELIMITER ;