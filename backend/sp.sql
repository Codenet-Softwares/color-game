-- SP for getting user wallet balance
use colorgame_refactor;
DROP PROCEDURE IF EXISTS getUserWallet;
DELIMITER $$
CREATE PROCEDURE `getUserWallet` (in vUserId varchar(50), in vGetExposure boolean)
BEGIN
SET @exposure := (SELECT coalesce(sum(exposure), 0)  FROM colorgame_refactor.MarketListExposuers
	where userId = vUserId );

SET @credits := (SELECT coalesce(sum(amount), 0) FROM colorgame_refactor.transactionRecords
	where userId = vUserId  AND transactionType ='CREDIT');

SET @withdraw := (SELECT coalesce(sum(amount), 0) FROM colorgame_refactor.transactionRecords
	where userId = vUserId  AND transactionType ='withdrawal');

SET @wins := (SELECT coalesce(sum(amount), 0) FROM colorgame_refactor.winningAmounts
	where userId = vUserId AND  type ='win');

SET @losses := (SELECT coalesce(sum(amount), 0) FROM colorgame_refactor.winningAmounts
	where userId = vUserId AND  type ='loss');              

SET @voidLosses := (SELECT coalesce(sum(amount), 0) FROM colorgame_refactor.winningAmounts
	where userId = vUserId AND  isVoidAfterWin = true AND type ='loss');

select (@credits - @withdraw - @exposure + @wins - @losses + @voidLosses) as UserBalance ,  @exposure as Exposure;
IF vGetExposure THEN
    SELECT * FROM colorgame_refactor.MarketListExposuers WHERE userId = vUserId;
END IF;

END $$
 DELIMITER ;
