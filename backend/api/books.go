package api

import (
	bookEntity "go_db_migration/book-keeping-api-main/entities"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

//***********************API Calls
// GetBooksList godoc
// @Summary get the books list.
// @Description read the books list.
// @Tags root
// @Produce json
// @Success 200 {object} []bookEntity.GoBook
// @Router /books [get]
func (server *Server) GetBooksList(ctx *gin.Context) {

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		validateErr := v.RegisterValidation("is-cool", ValidateCoolTitle)
		if validateErr != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": validateErr,
			})
			return
		}
	}

	booksList, err := GetBooksListController(server, ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"data": booksList,
	})
}

// CreateBook godoc
// @Summary create book.
// @Description create a new book into gobooks.
// @Param data body bookEntity.GoBook true "bookEntity.GoBook data."
// @Tags root
// @Produce json
// @Success 200 {object} bookEntity.GoBook
// @Router /book [post]
func (server *Server) CreateBook(ctx *gin.Context) {
	var book bookEntity.GoBook
	if err := ctx.ShouldBindJSON(&book); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	created_book, err := CreateBookController(server, ctx, book)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": created_book,
	})
}

// DeleteBook godoc
// @Summary delete the book from gobooks.
// @Description delete the book from gobooks.
// @Param id path integer true "bookEntity.GoBook ID"
// @Tags root
// @Produce json
// @Success 200 {object} string
// @Router /book/{id} [delete]
func (server *Server) DeleteBook(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Copy().Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	err = DeleteBookController(server, ctx, int8(id))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "had successfullly deleted the book",
	})
}

// UpdateBook godoc
// @Summary update the book.
// @Description update the book into books list.
// @Param data body bookEntity.GoBook true "bookEntity.GoBook data."
// @Tags root
// @Accept */*
// @Produce json
// @Success 200 {object} bookEntity.GoBook
// @Router /book [put]
func (server *Server) UpdateBook(ctx *gin.Context) {
	var book bookEntity.GoBook
	if err := ctx.ShouldBindJSON(&book); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	updated_book, err := UpdateBookController(server, ctx, book)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": updated_book,
	})
}
