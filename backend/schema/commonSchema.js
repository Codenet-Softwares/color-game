import { body, param, query } from "express-validator";

export const testValidator = [
  body("email", "Invalid email").isEmail(),
  body("password", "Password must be at least 6 characters long").isLength({
    min: 6,
  }),
];

export const bidTypeSchema = [
  body("userId").exists().withMessage("User ID Is Required."),
  body("gameId").exists().withMessage("Game ID Is Required."),
  body("marketId").exists().withMessage("Market ID Is Required."),
  body("runnerId").exists().withMessage("Runner ID Is Required."),
  body("value").exists().withMessage("Value Is Required."),
  body("bidType")
    .exists()
    .withMessage("Bid Type Is Required.")
    .notEmpty()
    .withMessage("Bidding type must not be empty.")
    .isIn(["back", "lay"])
    .withMessage('Bidding type must be either "back" or "lay".'),
];

export const bidHistorySchema = [
  param("gameId").exists().withMessage("Game ID Is Required."),
  query("page")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Page number must be a positive integer."),
  query("limit")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer."),
];

// export const currentOrderSchema = [
//   param("marketId").exists().withMessage("Market ID Is Required."),
// ];

export const winningSchema = [
  body("marketId").notEmpty().withMessage("Market ID Is Required"),
  body("runnerId").notEmpty().withMessage("Runner ID Is Required"),
  body("isWin")
    .notEmpty()
    .withMessage("isWin field Is Required")
    .isBoolean()
    .withMessage("isWin must be a boolean value"),
];

export const loginSchema = [
  body("userName").trim().notEmpty().withMessage("Username Is Required"),
  body("password").notEmpty().withMessage("Password Is Required"),
];

export const resetPasswordSchema = [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Username Is Required"),
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old Password Is Required"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password Is Required")
    .isLength({ min: 8 })
    .withMessage("New Password must be at least 8 characters long")
    .isAlphanumeric()
    .withMessage("New Password must be alphanumeric"),
];

export const trashUserSchema = [
  body("userId").notEmpty().withMessage("User ID is required."),
];

export const createdUserSchema = [
  body("userName").trim().notEmpty().withMessage("Username is required"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const createdGameSchema = [
  body("gameName").trim().notEmpty().withMessage("Game name is required"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description is required"),
  body("isBlink")
    .optional()
    .isBoolean()
    .notEmpty()
    .withMessage("isBlink must be a boolean"),
];

export const createdMarketSchema = [
  param("gameId").notEmpty().withMessage("Game ID is required"),
  body("marketName")
    .notEmpty().withMessage("Market name is required")
    .isString().withMessage("Market name must be a string"),
  body("participants")
    .notEmpty().withMessage("Participants is required")
    .isInt({ min: 1 }).withMessage("Participants must be a positive integer"),
  body("startTime")
    .notEmpty().withMessage("Start time is required"),
    body("endTime")
    .notEmpty().withMessage("End time is required")
    .custom((endTime, { req }) => {
      const startTime = new Date(req.body.startTime);
      const endTimeDate = new Date(endTime);

      if (endTimeDate <= startTime) {
        throw new Error("End time cannot be less than or equal to start time");
      }
      return true;
    }),
];

export const createdRunnerSchema = [
  param("marketId").notEmpty().withMessage("Market ID is required"),
  body("runners")
    .isArray().withMessage("Runners must be an array")
    .notEmpty().withMessage("Runners array cannot be empty")
];

export const createdRateSchema = [
  param("runnerId").notEmpty().withMessage("Runner ID is required"),
  body("back")
    .optional()
    .isNumeric()
    .withMessage("Back rate must be a numeric value"),
  body("lay")
    .optional()
    .isNumeric()
    .withMessage("Lay rate must be a numeric value"),
];

export const adminCreateValidate = [
  body('userName')
    .notEmpty().withMessage('Username is required')
    .isString().withMessage('Username must be a string'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

export const validateSubAdmin = [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("permissions")
    .notEmpty()
    .withMessage("Permissions are required")
    .isArray({ min: 1 })
    .withMessage("Permissions must be a non-empty array")
    .custom((value) => value.every((perm) => typeof perm === "string" && perm.trim() !== ""))
    .withMessage("Each permission must be a non-empty string"),
];

export const validateDeleteSubAdmin = [
  param('adminId')
    .notEmpty().withMessage('adminId is required')
    .isUUID().withMessage('adminId must be a valid UUID'),
];


export const suspendedMarketSchema = [
  param("marketId").notEmpty().withMessage("Market ID is required"),
  body("status").isBoolean().withMessage("Status must be a boolean value"),
];

export const updateGameSchema = [
  body("gameId")
    .notEmpty()
    .withMessage("Game ID is required"),

  body("gameName")
    .optional({ checkFalsy: true }) 
    .isString()
    .withMessage("Game name must be a valid string"),

  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Description must be a valid string"),
];



export const updateMarketSchema = [
  body("marketId").notEmpty().withMessage("Market ID is required"),
  body("marketName")
    .optional()
    .notEmpty()
    .withMessage("Market name cannot be empty"),
  body("participants")
    .optional()
    .notEmpty()
    .withMessage("Participants is required"),
];

export const updateRunnerSchema = [
  body("runnerId").notEmpty().withMessage("Runner ID is required"),
  body("runnerName")
    .optional()
    .notEmpty()
    .withMessage("Runner name cannot be empty"),
];

export const updateRateSchema = [
  body("runnerId").notEmpty().withMessage("Runner ID is required"),
  body("back").optional().isNumeric().withMessage("Back rate must be a number"),
  body("lay").optional().isNumeric().withMessage("Lay rate must be a number"),
];

export const announcementsSchema = [
  body("typeOfAnnouncement")
    .notEmpty()
    .withMessage("Type of announcement is required"),
  body("announcement")
    .notEmpty()
    .withMessage("Announcement content is required"),
];

export const depositSchema = [
  body("adminId").notEmpty().withMessage("Admin ID is required"),
  body("depositAmount")
    .notEmpty()
    .withMessage("Deposit amount is required")
    .isNumeric()
    .withMessage("Deposit amount must be a numeric value")
    .custom((value) => parseFloat(value) > 0)
    .withMessage("Deposit amount must be greater than 0"),
];

export const validateSendBalance = [
  body('balance')
    .notEmpty().withMessage('Balance is required')
    .isNumeric().withMessage('Balance must be a numeric value')
    .custom((value) => parseFloat(value) > 0)
    .withMessage("Balance must be greater than 0"),
  body('adminId')
    .notEmpty().withMessage('Admin ID is required')
    .isUUID(4)
    .withMessage("Admin ID is not a valid."),
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isUUID(4)
    .withMessage("userId is not a valid."),
];

export const sendBalanceSchema = [
  body("balance")
    .notEmpty()
    .withMessage("Balance is required")
    .isNumeric()
    .withMessage("Balance must be a numeric value")
    .custom((value) => parseFloat(value) > 0)
    .withMessage("Balance must be greater than 0"),
  body("adminId").notEmpty().withMessage("Admin ID is required"),
  body("userId").notEmpty().withMessage("User ID is required"),
];

export const userLoginSchema = [
  body("userName").notEmpty().withMessage("User Name is required."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 }),
];

export const eligibilityCheckValidationRules = [
  body("eligibilityCheck")
    .isBoolean()
    .withMessage("Eligibility check must be a boolean value"),
];

export const gameIdValidate = [
  param("gameId")
    .notEmpty()
    .withMessage("Game ID cannot be empty")
    .isString()
    .withMessage("Game ID must be a string"),
];

export const validateGameId = [
  param("gameId").notEmpty().withMessage("Game ID cannot be empty"),
];

export const validateAnnouncementsId = [
  param("announceId").notEmpty().withMessage("Announcement ID Is Required"),
];

export const validateUserResetPassword = [
  body("oldPassword").notEmpty().withMessage("Old Password Is Required"),
  body("password")
    .notEmpty()
    .withMessage("New Password Is Required")
    .isLength({ min: 6 })
    .withMessage("New Password must be at least 6 characters long"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password Is Required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Confirm Password does not match with Password"),
];




export const exUpdateBalanceSchema = [
  body("userId").notEmpty().withMessage("user ID Is Required"),
  body("amount").notEmpty().withMessage("amount Is Required"),
  body("type")
    .notEmpty()
    .withMessage("type Is Required")
    .isIn(["credit", "withdrawal"])
    .withMessage('type must be either "credit" or "withdrawal".'),
];

export const validateRevokeWinningAnnouncement = [
  body("marketId")
    .notEmpty()
    .withMessage("marketId Is Required")
    .isUUID(4)
    .withMessage("marketId is not a valid."),
  body("runnerId")
    .notEmpty()
    .withMessage("runnerId Is Required")
    .isUUID(4)
    .withMessage("runnerId is not a valid."),
];

export const userUpdateSchema = [
  param("userId").notEmpty().withMessage("User ID Is Required"),
  body("firstName").optional().notEmpty().withMessage("First name Is Required"),
  body("lastName").optional().notEmpty().withMessage("Last name Is Required"),
  body("userName").optional().notEmpty().withMessage("Username Is Required"),
  body("phoneNumber")
    .optional()
    .notEmpty()
    .withMessage("Phone number Is Required")
    .isMobilePhone()
    .withMessage("Invalid phone number format"),
  body("password")
    .optional()
    .notEmpty()
    .withMessage("Password Is Required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("balance")
    .optional()
    .isNumeric()
    .withMessage("Balance must be a number"),
];

export const validateDeleteRunner = [
  param("runnerId").notEmpty().withMessage("Runner ID Is Required"),
];

export const calculateProfitLossSchema = [
  param("userName").notEmpty().withMessage("Username Is Required"),
];

export const marketProfitLossSchema = [
  param("userName").notEmpty().withMessage("Username Is Required"),
  param("gameId").notEmpty().withMessage("Game ID Is Required"),
];

export const runnerProfitLossSchema = [
  param("userName").notEmpty().withMessage("Username Is Required"),
  param("marketId").notEmpty().withMessage("Market ID Is Required"),
];

export const gameActiveInactiveValidate = [
  body("status")
    .notEmpty()
    .withMessage("Status Is Required.")
    .isBoolean()
    .withMessage("Status must be a boolean (true or false)."),
  body("gameId")
    .notEmpty()
    .withMessage("Game Id Is Required.")
    .isUUID(4)
    .withMessage("Game Id is not a valid."),
];

export const logOutValidate = [
  body("userId").notEmpty().withMessage("User ID Is Required.").isUUID(4).withMessage("User Id is not a valid."),
];

export const betHistorySchema = [
  param("userName")
    .notEmpty()
    .withMessage("Username Is Required."),
  param("gameId")
    .notEmpty()
    .withMessage("Game Id Is Required.")
];

export const createUserValidate = [
  body("userId").notEmpty().withMessage("User ID Is Required"),
  body("userName").optional().notEmpty().withMessage("Username Is Required"),
  body("password")
    .optional()
    .notEmpty()
    .withMessage("Password Is Required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
]

export const calculateProfitLossValidate = [
  query("startDate")
    .notEmpty()
    .withMessage("Start date Is Required.")
    .isISO8601()
    .withMessage("Invalid start date format."),
  query("endDate")
    .notEmpty()
    .withMessage("End date Is Required.")
    .isISO8601()
    .withMessage("Invalid end date format."),
];

export const marketProfitLossValidate = [
  param("gameId").notEmpty().withMessage("Game ID Is Required"),
];

export const runnerProfitLossValidate = [
  param("marketId").notEmpty().withMessage("Market ID Is Required"),
];

export const validateUpdateGameStatus = [
  param('gameId').isUUID().withMessage('Game ID must be a valid UUID'),
  body('status').notEmpty().withMessage("status Is Required.").isBoolean().withMessage('Status must be a boolean'),
];

export const validatePurchaseLotteryTicket = [
  body('lotteryId')
    .isUUID()
    .withMessage('Invalid lottery ID. It must be a valid UUID.'),
];

export const validateVoidGame = [
  body('marketId').notEmpty().withMessage("Market Id Is Required.").isUUID().withMessage('Market ID must be a valid UUID'),
];

export const validateSearchTickets = [
  body('group').notEmpty().withMessage('Group Is Required').isInt({ min: 0 }).withMessage('Group must be a positive integer'),
  body('series').notEmpty().withMessage('Series Is Required').isLength({ min: 1, max: 1 }).withMessage('Series must be a single character'),
  body('number').notEmpty().withMessage('Number Is Required').isString().isLength({ min: 1 }).withMessage('Number must be a non-empty string'),
  body('sem')
    .notEmpty()
    .withMessage('Sem Is Required')
    .bail()
    .isNumeric()
    .withMessage('Sem must be a numeric value')
    .bail()
    .isIn([5, 10, 25, 50, 100, 200])
    .withMessage('Sem must be one of the following values: 5, 10, 25, 50, 100, 200'),
  body('marketId').notEmpty().withMessage('marketId Is Required').isUUID().withMessage('MarketId must be a valid UUID'),

];

export const validatePurchaseLottery = [
  param('marketId')
    .exists()
    .withMessage('Market ID Is Required')
    .isUUID()
    .withMessage('Market ID must be a valid UUID'),
  body('generateId')
    .exists()
    .withMessage('Generate ID Is Required')
    .isUUID()
    .withMessage('Generate ID must be a valid UUID'),
  body('lotteryPrice')
    .exists()
    .withMessage('Lottery price Is Required')
    .isNumeric()
    .withMessage('Lottery price must be a numeric value')
    .custom((value) => value > 0)
    .withMessage('Lottery price must be greater than zero'),
];

export const validatePurchaseHistory = [
  param('marketId')
    .exists()
    .withMessage('Market ID Is Required')
    .isUUID()
    .withMessage('Market ID must be a valid UUID'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limit must be a positive integer'),
];

export const validateUpdateBalance = [
  body('userId')
    .exists()
    .withMessage('User ID Is Required')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
  body('prizeAmount')
    .exists()
    .withMessage('Prize amount Is Required')
    .isInt()
    .withMessage('Prize amount must be a positive number'),
  body('marketId')
    .exists()
    .withMessage('Market ID Is Required')
    .isUUID()
    .withMessage('Market ID must be a valid UUID'),
];

export const validateRemoveExposer = [
  body('userId')
    .exists()
    .withMessage('User ID Is Required')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
  body('marketId')
    .exists()
    .withMessage('Market ID Is Required')
    .isUUID()
    .withMessage('Market ID must be a valid UUID'),
  // body('marketName')
  //   .exists()
  //   .withMessage('Market name Is Required')
  //   .isString()
  //   .withMessage('Market name must be a string')
  //   .notEmpty()
  //   .withMessage('Market name cannot be empty'),
];

export const validateMarketId = [
  param("marketId").notEmpty().withMessage('marketId Is Required')
    .isUUID()
    .withMessage("Invalid marketId. It should be a valid UUID."),
];


export const validateCreateLotteryP_L = [
  body('userId')
    .exists()
    .withMessage('User ID Is Required')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
  // body('userName')
  //   .exists()
  //   .withMessage('User name Is Required')
  //   .isString()
  //   .withMessage('User name must be a string')
  //   .isLength({ max: 255 })
  //   .withMessage('User name must not exceed 255 characters'),
  body('marketId')
    .exists()
    .withMessage('Market ID Is Required')
    .isUUID()
    .withMessage('Market ID must be a valid UUID'),
  body('marketName')
    .exists()
    .withMessage('Market name Is Required')
    .isString()
    .withMessage('Market name must be a string')
    .isLength({ max: 255 })
    .withMessage('Market name must not exceed 255 characters'),
  // body('price')
  //   .optional()
  //   .isInt({ min: 1 })
  //   .withMessage('Price must be a positive integer'),
  // body('sem')
  //   .optional()
  //   .isInt({ values: [5, 10, 25, 50, 100, 200] })
  //   .withMessage('Sem must be one of the values: 5, 10, 25, 50, 100, 200'),
  // body('profitLoss')
  //   .exists()
  //   .withMessage('Profit or loss Is Required')
  //   .isDecimal({ decimal_digits: '0,2' })
  //   .withMessage('Profit or loss must be a decimal with up to 2 digits after the decimal point'),
];

export const validateDateWiseMarkets = [
  query('date')
    .exists()
    .withMessage('Date Is Required')
    .isISO8601()
    .withMessage('Date must be in a valid ISO 8601 format (e.g., YYYY-MM-DD)'),
];

export const validateGetLiveUserBet = [
  param("marketId")
    .trim()
    .notEmpty()
    .withMessage("Market ID Is Required.")
    .isUUID()
    .withMessage("Market ID must be a valid UUID."),
];

export const validateProfitLossInput = [
  query("dataType")
    .exists()
    .withMessage("dataType Is Required.")
    .isIn(["live", "olddata", "backup"])
    .withMessage("Valid values are 'live', 'olddata', or 'backup'."),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer."),

];

export const validateVoidMarket = [
  body('marketId')
    .notEmpty().withMessage('Market ID Is Required')
    .isUUID().withMessage('Market ID must be a valid UUID'),
  body('userId')
    .notEmpty().withMessage('userId Is Required')
    .isUUID().withMessage('userId must be a valid UUID')
];

export const validateRevokeMarket = [
  body('marketId')
    .notEmpty().withMessage('Market ID Is Required')
    .isUUID().withMessage('Market ID must be a valid UUID'),

];

export const externalResetPasswordSchema = [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Username Is Required"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("New Password Is Required")
];

export const validateResetPassword = [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Username Is Required"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password Is Required")
];

export const validateLiveUsersBet = [
  param("marketId")
    .isUUID(4)
    .withMessage("marketId is not valid."),
  query("page")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Page number must be a positive integer."),
  query("pageSize")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Page size must be a positive integer."),
];

export const validateLiveGames = [
  query("page")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Page number must be a positive integer."),
  query("pageSize")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Page size must be a positive integer."),
];

export const validateBetsAfterWin = [
  param("marketId")
    .isUUID(4)
    .withMessage("Market Id is not valid."),
];

export const validateTitleText = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),

  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string'),
];

export const validateApproveResult = [
  body('marketId')
    .notEmpty()
    .withMessage('Market ID Is Required')
    .isUUID()
    .withMessage('Market ID must be a valid UUID'),
  body('action')
    .notEmpty()
    .withMessage('Action Is Required')
    .isString()
    .trim()
    .isIn(['approve', 'reject'])
    .withMessage("Action must be either 'approve' or 'reject'")
];

export const validatesDeleteBetAfterWin = [
  body("userId")
    .notEmpty().withMessage("User ID Is Required")
    .isUUID().withMessage("User ID must be a valid UUID"),
  body("marketId")
    .notEmpty().withMessage("Market ID Is Required")
    .isUUID().withMessage("Market ID must be a valid UUID"),
];

export const validateAfterWinVoidMarket = [
  body("marketId")
    .notEmpty().withMessage("Market ID Is Required")
    .isUUID().withMessage("Market ID must be a valid UUID"),
];


export const validateDeleteLiveBet = [
  body('marketId')
    .notEmpty()
    .withMessage('marketId Is Required')
    .isUUID()
    .withMessage('marketId must be a valid UUID'),
  body('runnerId')
    .notEmpty()
    .withMessage('runnerId Is Required')
    .isUUID()
    .withMessage('runnerId must be a valid UUID'),
  body('userId')
    .notEmpty()
    .withMessage('userId Is Required')
    .isUUID()
    .withMessage('userId must be a valid UUID'),
  body('betId')
    .notEmpty()
    .withMessage('betId Is Required')
    .isUUID()
    .withMessage('betId must be a valid UUID'),
];

export const validateDeleteLiveMarket= [
  body('marketId')
    .notEmpty().withMessage('Market ID Is Required')
    .isUUID().withMessage('Market ID must be a valid UUID'),
  body('userId')
    .notEmpty().withMessage('userId Is Required')
    .isUUID().withMessage('userId must be a valid UUID'),
  body('price')
    .notEmpty().withMessage('price Is Required')
]

export const validateTrashMarketId = [
  param("marketId")
    .isUUID()
    .withMessage("Invalid marketId. It should be a valid UUID."),
];

export const validateTrashMarket = [
  param("trashMarketId")
    .isUUID()
    .withMessage("Invalid trashMarketId. It should be a valid UUID."),
];

export const validateRevokeLiveMarket= [
  body('marketId')
    .notEmpty().withMessage('Market ID Is Required')
    .isUUID().withMessage('Market ID must be a valid UUID'),
  body('userId')
    .notEmpty().withMessage('userId Is Required')
    .isUUID().withMessage('userId must be a valid UUID'),
  body('lotteryPrice')
    .notEmpty().withMessage('lotteryPrice Is Required')
]

export const validateApprovalMarket = [
  param("marketId")
    .isUUID()
    .withMessage("Invalid Market ID."),
];

export const validateUserLiveBet = [
  param("marketId")
    .isUUID()
    .withMessage("Invalid Market ID."),
];

export const validateDeleteBetAfterWin = [
  body('marketId')
    .notEmpty().withMessage('Market ID Is Required')
    .isUUID().withMessage('Market ID must be a valid UUID'),
  body('userId')
    .notEmpty().withMessage('userId Is Required')
    .isUUID().withMessage('userId must be a valid UUID'),
  body('sem')
    .notEmpty().withMessage('sem Is Required'),
  body('prizeAmount')
    .notEmpty().withMessage('prizeAmount Is Required'),
  body('prizeCategory')
    .notEmpty().withMessage('prizeCategory Is Required')
]


export const validateVoidAfterWin = [
  body('marketId')
    .notEmpty().withMessage('Market ID Is Required')
    .isUUID().withMessage('Market ID must be a valid UUID'),
  body('userId')
    .notEmpty().withMessage('userId Is Required')
    .isUUID().withMessage('userId must be a valid UUID'),
]

export const activeInactive = [
  param('userId').trim().notEmpty().withMessage('User id Is Required'),
  body('isActive')
    .notEmpty()
    .withMessage('isActive Is Required')
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('locked')
    .notEmpty()
    .withMessage('locked Is Required')
    .isBoolean()
    .withMessage('locked must be a boolean'),
];

export const validateHotGame = [
  body('marketId')
    .notEmpty()
    .withMessage('Market ID is required')
    .isUUID()
    .withMessage('Market ID must be a valid UUID'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isBoolean()
    .withMessage('Status must be a boolean'),
];

export const updateNotification = [
  body("isRead")
    .isBoolean()
    .withMessage("isRead must be a boolean value"),
];