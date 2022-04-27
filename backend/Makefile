postgres:
    docker run --name postgres12 -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres:12-alpine

createdb:
    docker exec -it postgres12 createdb --username=postgres --owner=postgres simple_book

dropdb:
    docker exec -it postgres12 dropdb simple_book

migrateup:
    migrate -path db/migrations -database "postgresql://postgres:mysecretpassword@localhost:5432/simple_book?sslmode=disable" -verbose up                                                              

migratedown:
    migrate -path db/migrations -database "postgresql://postgres:mysecretpassword@localhost:5432/simple_book?sslmode=disable" -verbose down                                                           

run:
	go run main.go

sqlc:
    sqlc generate

swag:
    swag init -g main.go --output docs/ginsimple

.PHONY: postgres createdb dropdb migrateup migratedown run sqlc swag