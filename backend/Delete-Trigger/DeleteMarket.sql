USE colorgame_refactor;

DELIMITER $$

CREATE TRIGGER DeleteMarket
AFTER UPDATE ON market
FOR EACH ROW
BEGIN
  -- Handle isDeleted change
  IF NEW.isDeleted = TRUE AND OLD.isDeleted = FALSE THEN
    UPDATE colorgame_refactor_archive.market
    SET isDeleted = TRUE
    WHERE gameId = OLD.gameId;
  END IF;

  -- Handle isPermanentDeleted change
  IF NEW.isPermanentDeleted = TRUE AND OLD.isPermanentDeleted = FALSE THEN
    UPDATE colorgame_refactor_archive.market
    SET isPermanentDeleted = TRUE
    WHERE gameId = OLD.gameId;
    
  END IF;
END$$

DELIMITER ;