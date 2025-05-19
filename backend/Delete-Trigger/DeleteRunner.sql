USE colorgame_refactor;
DELIMITER $$

CREATE TRIGGER DeleteRunner
AFTER UPDATE ON runner
FOR EACH ROW
BEGIN
  -- Handle isDeleted change
  IF NEW.isDeleted = TRUE AND OLD.isDeleted = FALSE THEN
    UPDATE colorgame_refactor_archive.runner
    SET isDeleted = TRUE
    WHERE marketId = OLD.marketId;
  END IF;

  -- Handle isPermanentDeleted change
  IF NEW.isPermanentDeleted = TRUE AND OLD.isPermanentDeleted = FALSE THEN
    UPDATE whiteLabel_refactor_archive.runner
    SET isPermanentDeleted = TRUE
    WHERE marketId = OLD.marketId;
  END IF;
END$$

DELIMITER ;