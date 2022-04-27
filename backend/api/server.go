package api

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go_db_migration/book-keeping-api-main/db/sqlc"
	_ "go_db_migration/book-keeping-api-main/docs/ginsimple"
	"go_db_migration/book-keeping-api-main/middleware"
	"net/http"
	"time"
	// go get github.com/swaggo/swag/cmd/swag
)

type Server struct {
	store  db.Store
	router *gin.Engine
}

func NewServer(store db.Store) {
	bookMiddleware.SetUpLogOutput()
	bookMiddleware.SetUpErrorLogOutput()
	router := gin.New()
	router.Use(gin.Recovery(), bookMiddleware.Logger(), bookMiddleware.BasicAuth())

	r := &http.Server{
		Addr:         ":6060",
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	server := &Server{
		store:  store,
		router: router,
	}

	server.setupRouter()
	r.ListenAndServe()
}

func (server *Server) setupRouter() {

	server.router.GET("/books", server.GetBooksList)
	server.router.POST("/book", server.CreateBook)
	server.router.DELETE("/book/:id", server.DeleteBook)
	server.router.PUT("/book/", server.UpdateBook)
	server.router.GET("/book/:id", server.GetBook)

	server.router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
}
