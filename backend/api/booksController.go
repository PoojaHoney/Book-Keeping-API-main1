package api

import (
	"github.com/gin-gonic/gin"
	"go_db_migration/book-keeping-api-main/entities"
)

//Findall implementation for book controller interface
func GetBooksListController(server *Server, ctx *gin.Context) ([]bookEntity.GoBook, error) {
	booksList, err := server.store.GetBooksList(ctx)
	return booksList, err
}

func CreateBookController(server *Server, ctx *gin.Context, book bookEntity.GoBook) (bookEntity.GoBook, error) {
	return server.store.CreateBook(ctx, book)
}

func DeleteBookController(server *Server, ctx *gin.Context, id int8) error {
	return server.store.DeleteBook(ctx, id)
}

func UpdateBookController(server *Server, ctx *gin.Context, book bookEntity.GoBook) (bookEntity.GoBook, error) {
	return server.store.UpdateBook(ctx, book)
}

func GetBookController(server *Server, ctx *gin.Context, id int8) (bookEntity.GoBook, error) {
	return server.store.GetBook(ctx, id)
}
