package bookEntity

import "time"

//Author of Book
type OwnerData struct {
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Age       int8   `json:"age" binding:"gte=10,lte=50"`
	Email     string `json:"email" binding:"email"`
}

//Book Data
type BookData struct {
	PublishedBy string `json:"publishedby"`
	SponseredBy string `json:"sponseredby"`
	PublishedOn string `json:"publishedon"`
}

//entity
type Book struct {
	ID          int       `json:"id" binding:"required"`
	Title       string    `json:"title" binding:"min=2,max=20" validate:"is-cool"`
	Description string    `json:"description" binding:"max=20"`
	URL         string    `json:"url" binding:"required,url"`
	Price       float32   `json:"price" binding:"required"`
	Status      string    `json:"status"`
	Author      OwnerData `json:"author" binding:"required"`
	BookData    BookData  `json:"bookdata"`
}

//Owner
type Owner struct {
	OwnerData OwnerData `json:"ownerdata"`
}

type BookDetails struct {
	Title       string  `json:"title" binding:"min=2,max=20" validate:"is-cool"`
	Description string  `json:"description" binding:"max=20"`
	URL         string  `json:"url" binding:"required,url"`
	Price       float32 `json:"price" binding:"required"`
	FirstName   string  `json:"firstname" binding:"required"`
	LastName    string  `json:"lastname" binding:"required"`
	Age         int8    `json:"age" binding:"gte=10,lte=50"`
	Email       string  `json:"email" binding:"required,email"`
	ID          int     `json:"id"`
	PublishedBy string  `json:"publishedby"`
	SponseredBy string  `json:"sponseredby"`
	PublishedOn string  `json:"publishedon"`
}


type GoBook struct {
	ID         int8      `json:"id" binding:"required"`
	Title      string    `json:"title" binding:"min=2,max=20" validate:"is-cool"`
	Author     string    `json:"author" binding:"required"`
	CallNumber int8      `json:"callnumber" binding:"required"`
	Publisher  string    `json:"publisher" binding:"required"`
}

type GoPerson struct {
	ID        int8      `json:"id" binding:"required"`
	Name      string    `json:"name" binding:"min=2,max=20" validate:"is-cool"`
	Email     string    `json:"email" binding:"email"`
	Book      int8      `json:"book" binding:"required"`
	CreatedAt time.Time `json:"createdat"`
}