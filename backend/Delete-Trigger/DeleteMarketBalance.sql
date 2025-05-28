USE colorgame_refactor;

DELIMITER $$

CREATE TRIGGER DeleteMarketBalance
AFTER UPDATE ON MarketBalance
FOR EACH ROW
BEGIN
  -- Handle isDeleted change
  IF NEW.isDeleted = TRUE AND OLD.isDeleted = FALSE THEN
    UPDATE colorgame_refactor_archive.MarketBalance
    SET isDeleted = TRUE
    WHERE marketId = OLD.marketId;
  END IF;
  
  IF NEW.isDeleted = FALSE AND OLD.isDeleted = TRUE THEN
	UPDATE colorgame_refactor_archive.MarketBalance
    SET isDeleted = FALSE
    WHERE marketId = OLD.marketId;
    END IF;

  -- Handle isPermanentDeleted change
  IF NEW.isPermanentDeleted = TRUE AND OLD.isPermanentDeleted = FALSE THEN
    UPDATE colorgame_refactor_archive.MarketBalance
    SET isPermanentDeleted = TRUE
    WHERE marketId = OLD.marketId;
    
  END IF;
END$$

DELIMITER ;