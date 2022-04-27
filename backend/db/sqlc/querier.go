// Code generated by sqlc. DO NOT EDIT.

package db

import (
	"context"
	"go_db_migration/book-keeping-api-main/entities"

)

type Querier interface {
	GetBooksList(ctx context.Context) ([]bookEntity.GoBook, error)
	CreateBook(ctx context.Context, book bookEntity.GoBook) (bookEntity.GoBook, error)
	DeleteBook(ctx context.Context, id int8) error
	UpdateBook(ctx context.Context, book bookEntity.GoBook) (bookEntity.GoBook, error)
	GetBook(ctx context.Context, id int8) (bookEntity.GoBook, error)
}

var _ Querier = (*Queries)(nil)
