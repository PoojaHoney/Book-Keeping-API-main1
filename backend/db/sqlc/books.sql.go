package db

import (
	"context"
	bookEntity "go_db_migration/book-keeping-api-main/entities"
)

func (q *Queries) GetBooksList(ctx context.Context) ([]bookEntity.GoBook, error) {
	rows, err := q.db.QueryContext(ctx, `SELECT * FROM gobook`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []bookEntity.GoBook{}
	for rows.Next() {
		var i bookEntity.GoBook
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Author,
			&i.CallNumber,
			&i.Publisher,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

func (q *Queries) CreateBook(ctx context.Context, book bookEntity.GoBook) (bookEntity.GoBook, error) {
	row := q.db.QueryRowContext(ctx, `INSERT INTO gobook (
		ID,
		Title,
		Author,
		CallNumber,
		Publisher
	  ) VALUES (
		$1, $2, $3, $4, $5
	  ) RETURNING ID, Title, Author, CallNumber, Publisher`, book.ID, book.Title, book.Author, book.CallNumber, book.Publisher)
	var i bookEntity.GoBook
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Author,
		&i.CallNumber,
		&i.Publisher,
	)
	return i, err
}

func (q *Queries) DeleteBook(ctx context.Context, id int8) error {
	_, err := q.db.ExecContext(ctx, `DELETE FROM gobook WHERE ID = $1`, id)
	return err
}

func (q *Queries) UpdateBook(ctx context.Context, book bookEntity.GoBook) (bookEntity.GoBook, error) {
	row := q.db.QueryRowContext(ctx, `UPDATE gobook
	SET Title = $2, 
	Author = $3,
	CallNumber = $4,
	Publisher = $5
	WHERE id = $1
	RETURNING ID, Title, Author, CallNumber, Publisher`, book.ID, book.Title, book.Author, book.CallNumber, book.Publisher)
	var i bookEntity.GoBook
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Author,
		&i.CallNumber,
		&i.Publisher,
	)
	return i, err
}
