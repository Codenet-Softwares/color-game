USE colorgame_refactor;

DELIMITER $$

CREATE TRIGGER InsertAllRunnerBalances
AFTER INSERT ON AllRunnerBalances
FOR EACH ROW
BEGIN
  INSERT INTO colorgame_refactor_archive.AllRunnerBalances (
    id,
    UserId,
    RunnerId,
    MarketId,
    balance,
    createdAt,
    updatedAt
  ) VALUES (
    NEW.id,
    NEW.UserId,
    NEW.RunnerId,
    NEW.MarketId,
    NEW.balance,
    NEW.createdAt,
    NEW.updatedAt
  );
END$$

DELIMITER ;
