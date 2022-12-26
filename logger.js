const winston = require("winston");

process.on("uncaughtException", async(ex)=>{
    logger.log("error", "WE GOT AN UNCAUGHT EXCEPTION.");
    await logger.error(ex.message, ex); 
    // process.exit(1);
});

const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta'
    });
}

const jsonLogFileFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: timezoned }),
    winston.format.prettyPrint(),
  );
  
  // Create file loggers
  const logger = winston.createLogger({
    level: 'debug',
    format: jsonLogFileFormat,
    transports: [      
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
    expressFormat: true,
  }); 
  
  // When running locally, write everything to the console
  // with proper stacktraces enabled
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format:  winston.format.combine(
                  winston.format.errors({ stack: true }),
                  winston.format.colorize(),
                  winston.format.printf(({ level, message, timestamp, stack }) => {
                    if (stack) {
                        // print log trace
                        return `${timestamp} ${level}: ${message} - ${stack}`;
                    }
                    return `${timestamp} ${level}: ${message}`;
                }),
              )
    }));
  }

// throw new Error("something failed"); //to check the uncaughtExceptions

// const p = new Promise((resolve, reject)=>{ //to check the unhandledRejections
//     reject("internal error");
// });
// p
//     .then(()=>{console.log("done")})
//     .catch(err=>{logger.log("error", err)});
  
process.on("unhandledRejection", (ex) => {
    logger.log("error", "WE GOT AN UNHANDLED REJECTION");
    logger.error(ex.message, ex);
    // process.exit(1);
});

module.exports = logger;