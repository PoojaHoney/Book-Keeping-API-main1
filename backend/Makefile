postgres:
    docker run --name postgres12 --network book_network -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres:12-alpine

createdb:
    docker exec -it postgres12 createdb --username=postgres --owner=postgres simple_book

dropdb:
    docker exec -it postgres12 dropdb simple_book

migrateup:
    migrate -path db/migrations -database "postgresql://postgres:mysecretpassword@127.0.0.1:5432/simple_book?sslmode=disable" -verbose up                                                              

migratedown:
    migrate -path db/migrations -database "postgresql://postgres:mysecretpassword@127.0.0.1:5432/simple_book?sslmode=disable" -verbose down                                                           

server:
	go run main.go

sqlc:
    sqlc generate

swag:
    swag init -g main.go --output docs/ginsimple

migrate:
    migrate create -ext sql -dir db/migrations -seq <migration_name>


.PHONY: postgres createdb dropdb migrateup migratedown run sqlc swag