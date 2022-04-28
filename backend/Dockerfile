FROM golang:1.16-alpine3.13

WORKDIR /app

COPY . .
RUN go mod download
RUN go build -o main main.go

EXPOSE 6060

CMD ["/app/main"]