package main

import (
	"database/sql"
	_ "github.com/lib/pq"
	"go_db_migration/book-keeping-api-main/api"
	dbSqlc "go_db_migration/book-keeping-api-main/db/sqlc"
	"log"
)

// @title Books Sample Go Application
// @version 2.0
// @description This is a sample Books server.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:6060
// @BasePath /
// @schemes http
func main() {
	connStr := "user=postgres dbname=simple_book password=mysecretpassword host=127.0.0.1 port=5432 sslmode=disable"
	conn, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println("Connection Failed to Open")
	} else {
		log.Println("Connection Established")
	}
	defer conn.Close()

	store := dbSqlc.NewStore(conn)
	api.NewServer(store)
}
