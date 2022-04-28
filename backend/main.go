package main

import (
	"database/sql"
	"go_db_migration/book-keeping-api-main/api"
	dbSqlc "go_db_migration/book-keeping-api-main/db/sqlc"
	"go_db_migration/book-keeping-api-main/util"
	"log"

	_ "github.com/lib/pq"
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
	config, err := util.LoadConfig(".")
	if err != nil {
		log.Println("Cannot load the config", err)
	}
	// connStr := "user=postgres dbname=simple_book password=mysecretpassword host=172.17.0.3 port=5432 sslmode=disable"
	conn, err := sql.Open(config.DBDriver, config.DBSource)
	if err != nil {
		log.Println("Connection Failed to Open")
	} else {
		log.Println("Connection Established")
	}
	defer conn.Close()

	store := dbSqlc.NewStore(conn)
	server, _ := api.NewServer(store)
	err = server.StartServer(config.ServerAddress)
	if err != nil {
		log.Fatal("cannot start server:", err)
	}
}
