package main

import (
	"fmt"
	_ "go_db_migration/book-keeping-api-main/docs/ginswagger"
	"net/http"
	"os"
	"strconv"
	"time"

	"context"

	"github.com/gin-gonic/gin"
	"github.com/golang-migrate/migrate/database/postgres"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/github"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/maragudk/migrate"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"database/sql"
	// github.com/golang-migrate/migrate/v4/internal/cli
)

type GoPerson struct {
	gorm.Model
	Name  string
	Email string `gorm:"typevarchar(100);unique_index"`
	Books []GoBook
}

type GoBook struct {
	gorm.Model
	Title      string
	Author     string
	CallNumber int
	PersonID   int
}

var db *sql.DB
var err error
var migrations = os.DirFS("migrations")

// @title Demo On Go-lang API
// @version 1.0
// @description This is demo server.
// @termsOfService demo.com

// @contact.name API Support
// @contact.url http://demo.com/support

// @host localhost:8000
// @BasePath /

// @securityDefinitions.basic BasicAuth

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func main() {

	// Database connection string
	connStr := "user=postgres dbname=test_bt password=postgres host=10.192.250.55 sslmode=disable"
	router := gin.New()
	router.Use(gin.Recovery(), gin.Logger(), BasicAuth())

	// Openning connection to database
	db, err := sql.Open("postgres", connStr)

	if err != nil {
		panic(err)
	} else {
		fmt.Println("Connected to database successfully")
	}

	s := &http.Server{
		Addr:         ":8000",
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	// Close the databse connection when the main function closes

	// Make migrations to the database if they haven't been made already
	db.AutoMigrate(&GoPerson{})
	db.AutoMigrate(&GoBook{})

	driver, err := postgres.WithInstance(db, &postgres.Config{})
    m, err := migrate.NewWithDatabaseInstance(
        "file:///migrations",
        "postgres", driver)
    m.Up() // or m.Step(2) if you want to explicitly set the number of migrations to run


	// if err := migrate.Up(context.Background(), db, migrations); err != nil {
	// 	panic(err)
	// }

	// if err := migrate.Down(context.Background(), db, migrations); err != nil {
	// 	panic(err)
	// }

	// if err := migrate.To(context.Background(), db, migrations, "1-accounts"); err != nil {
	// 	panic(err)
	// }

	/*----------- API routes ------------*/

	router.GET("/books", WithDB(GetBooks, db))
	router.GET("/book/{id}", GetBook)
	router.GET("/people", GetPeople)
	router.GET("/person/{id}", GetPerson)

	router.POST("/create/person", CreatePerson)
	router.POST("/create/book", CreateBook)

	router.DELETE("/delete/person/{id}", DeletePerson)
	router.DELETE("/delete/book/{id}", DeleteBook)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	defer db.Close()
	s.ListenAndServe()
}

func WithDB(actFunction func(ctx *gin.Context, db *gorm.DB), db *gorm.DB) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		actFunction(ctx, db)
	}
}

func BasicAuth() gin.HandlerFunc {
	return gin.BasicAuth(gin.Accounts{
		"pooja": "pooja",
	})
}

/*-------- API Controllers --------*/

/*----- People ------*/
// Get GoPerson By ID
// @Summary      Get GoPerson By ID
// @Description  get string by ID
// @Tags         persons
// @Accept       json
// @Produce      json
// @Param        id   path      int  true  "Person ID"
// @Success      200  {object}  model.Account
// @Failure      400  {object}  httputil.HTTPError
// @Failure      404  {object}  httputil.HTTPError
// @Failure      500  {object}  httputil.HTTPError
// @Router       /person/{id} [get]
func GetPerson(ctx *gin.Context) {
	params, _ := strconv.Atoi(ctx.Param("id"))
	var person GoPerson
	var books []GoBook

	db.First(&person, params)
	db.Model(&person).Related(&books)

	person.Books = books

	ctx.JSON(http.StatusOK, gin.H{
		"data": &person,
	})
}

func GetPeople(ctx *gin.Context) {
	var people []GoPerson

	db.Find(&people)

	ctx.JSON(http.StatusOK, gin.H{
		"data": &people,
	})
}

func CreatePerson(ctx *gin.Context) {
	var person GoPerson
	ctx.ShouldBindJSON(&person)

	createdPerson := db.Create(&person)
	err = createdPerson.Error
	if err != nil {
		fmt.Println(err)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": &createdPerson,
	})
}

func DeletePerson(ctx *gin.Context) {
	// params := mux.Vars(r)
	params, _ := strconv.Atoi(ctx.Param("id"))

	var person GoPerson

	db.First(&person, params)
	db.Delete(&person)

	ctx.JSON(http.StatusOK, gin.H{
		"data": &person,
	})
}

/*------- Books ------*/

func GetBook(ctx *gin.Context) {
	params, _ := strconv.Atoi(ctx.Param("id"))
	var book GoBook

	db.First(&book, params)

	ctx.JSON(http.StatusOK, gin.H{
		"data": &book,
	})
}

func GetBooks(ctx *gin.Context, db *gorm.DB) {
	var books []GoBook

	db.Find(&books)

	ctx.JSON(http.StatusOK, gin.H{
		"data": &books,
	})
}

func CreateBook(ctx *gin.Context) {
	var book GoBook
	ctx.ShouldBindJSON(&book)

	createdBook := db.Create(&book)
	err = createdBook.Error
	if err != nil {
		fmt.Println(err)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": &createdBook,
	})
}

func DeleteBook(ctx *gin.Context) {
	params, _ := strconv.Atoi(ctx.Param("id"))

	var book GoBook

	db.First(&book, params)
	db.Delete(&book)

	ctx.JSON(http.StatusOK, gin.H{
		"data": &book,
	})
}
