-- name: CreateBook :one
INSERT INTO gobook (title, author, callnumber, publisher)
VALUES ($1, $2, $3, $4)
RETURNING *;


