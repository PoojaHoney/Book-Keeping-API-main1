package bookMiddleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"os"
	"time"
)

//**************************************************************************Basic Authorization
func BasicAuth() gin.HandlerFunc {
	return gin.BasicAuth(gin.Accounts{
		"pooja": "pooja",
	})
}

//**************************************************************************Custom Middleware
//Custom Logger to see the log for api calls
func Logger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("%s - [%s] \"%s %s %s %d %s \"%s\" %s\"\n",
			param.ClientIP,
			param.TimeStamp.Format(time.RFC1123),
			param.Method,
			param.Path,
			param.Request.Proto,
			param.StatusCode,
			param.Latency,
			param.Request.UserAgent(),
			param.ErrorMessage,
		)
	})
}

//Create new log file and records the calls
func SetUpLogOutput() {
	f, _ := os.Create("gin.log")
	gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
}

func SetUpErrorLogOutput() {
	f, _ := os.Create("gin.errorlog")
	gin.DefaultErrorWriter = io.MultiWriter(f, os.Stdout)
}
