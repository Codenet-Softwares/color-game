USE colorgame_refactor;
DELIMITER $$

CREATE TRIGGER DeleteGame
AFTER UPDATE ON game
FOR EACH ROW
BEGIN
  -- Handle isDeleted change
  IF NEW.isDeleted = TRUE AND OLD.isDeleted = FALSE THEN
    UPDATE colorgame_refactor_archive.game
    SET isDeleted = TRUE
    WHERE gameId = OLD.gameId;
  END IF;

  -- Handle isPermanentDeleted change
  IF NEW.isPermanentDeleted = TRUE AND OLD.isPermanentDeleted = FALSE THEN
    UPDATE whiteLabel_refactor_archive.game
    SET isPermanentDeleted = TRUE
    WHERE gameId = OLD.gameId;
  END IF;
END$$

DELIMITER ;