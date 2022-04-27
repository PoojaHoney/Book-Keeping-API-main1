import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Bar,
    Button,
    List,
    ListItemType,
    ListMode,
    StandardListItem,
    Title,
    Form,
    FormItem,
    Input,
    FormGroup,
    Page,
    Toast

} from '@ui5/webcomponents-react';
import { spacing } from '@ui5/webcomponents-react-base';
import { createPortal } from 'react-dom';
import { Dialog, DialogDomRef } from "@ui5/webcomponents-react/dist/Dialog";
import axios from 'axios';
import BookDetailView from './BookDetails';

// interface OwnerData {
//     FirstName: string,
//     LastName: string,
//     Age: string,
//     Email: string
// }

// interface BookData {
//     Id: Int8Array,
//     PublishedBy: string,
//     PublishedOn: string,
//     SponseredBy: string
// }

// interface Book {
//     Title: string,
//     Description: string,
//     URL: string,
//     Price: Float32Array,
//     Author: OwnerData,
//     BookData: BookData
// }

interface OwnerDataS {
    firstname: string,
    lastname: string,
    age: string,
    email: string
}

interface BookDataS {
    publishedby: string,
    publishedon: string,
    sponseredby: string
}

interface BookS {
    id: string,
    title: string,
    description: string,
    url: string,
    status: string,
    price: string,
    author: OwnerDataS,
    bookdata: BookDataS
}


const BooksView = () => {
    const [oCreateBook, setCreateBookData] = useState<BookS>({
        id: '0',
        title: '',
        description: '',
        url: '',
        status: '',
        price: '0',
        author: {
            firstname: '',
            lastname: '',
            age: '',
            email: ''
        },
        bookdata: {
            publishedby: '',
            sponseredby: '',
            publishedon: ''
        }
    });
    const oCreateBookDialogRef = useRef<DialogDomRef>(null);
    const [aBooksList, setBooksList] = useState<BookS[] | never[]>([])
    const [sSelectedBookId, setSelectedBookId] = useState<string>()
    const MessageToast: any = useRef();
    const [sMessage, setMessage] = useState<string>("");
    const History = useHistory();
    const [bDeleteButton, setDeleteButtonVisible] = useState(false)

    const handleCreateBookInputChange = (oEvent: any) => {
        setCreateBookData((oCreateBook: any) => {
            let aFieldname: string[] = []
            if ((oEvent.target.name || "").includes(".")) {
                aFieldname = oEvent.target.name.split(".")
            }
            if (!aFieldname.length) {
                return {
                    ...oCreateBook,
                    [oEvent.target.name]: oEvent.target.value
                }
            } else {
                const sFieldName: string = aFieldname[0] || ""
                return {
                    ...oCreateBook,
                    [sFieldName]: {
                        ...oCreateBook[sFieldName],
                        [aFieldname[1]]: oEvent.target.value
                    }
                }
            }
        });
    }

    useEffect(() => {
        axios.get("/books").then((oResponse) => {
            setBooksList(oResponse.data || [])
        });

        const interval = setInterval(() => {
            axios.get("/allBooks").then((oResponse: any) => {
                setBooksList(oResponse.data || [])
            });
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const onRefreshBookData = () => {
        axios.get("/books").then((oResponse) => {
            setBooksList(oResponse.data || [])
        });
    }

    const onValidateEmail = (Email: string) => {
        const sMailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
        if (Email !== "") {
            if (!sMailregex.test(Email)) {
                return "Error"
            }
        }
        return "None"
    }

    const openCreateBookDialog = () => {
        const oDialog: any = oCreateBookDialogRef.current
        oDialog.show()
    }

    const handleCreateBookClose = () => {
        const oDialog: any = oCreateBookDialogRef.current
        oDialog.close();
    }

    const handleCreateBookOk = () => {
        const oCreateBookDetails: any = { ...oCreateBook }
        oCreateBookDetails.price = parseFloat(oCreateBookDetails.price)
        oCreateBookDetails.id = parseInt(oCreateBookDetails.id)
        oCreateBookDetails.author.age = parseInt(oCreateBookDetails.author.age)
        axios.post("/bookDraft", oCreateBookDetails).then((oResponse: any) => {
            if (oResponse.data.message_Status === "success") {
                const aBooks = [...aBooksList]
                aBooks.push(oResponse.data.data)
                setBooksList(aBooks)
                setCreateBookData({
                    id: '0',
                    title: '',
                    description: '',
                    url: '',
                    status: '',
                    price: '0',
                    author: {
                        firstname: '',
                        lastname: '',
                        age: '',
                        email: ''
                    },
                    bookdata: {
                        publishedby: '',
                        sponseredby: '',
                        publishedon: ''
                    }
                });
                handleCreateBookClose()
            }
            setMessage(oResponse.data.message);
            MessageToast.current.show();
        }, (oResponse: any) => {
            setMessage(oResponse.response.data.error)
            MessageToast.current.show()
        })
    }

    const onBookSelected = (oEvent: any) => {
        setSelectedBookId(oEvent.detail.item.dataset.id)
        setDeleteButtonVisible(true)
    }

    const onSelectedBookNavigation = (oEvent: any) => {
        let oSelectedElement = { ...oEvent.target.dataset };
        History.replace(`/booksDetails/${oSelectedElement.id}`)
        window.location.reload()
    }

    const onDeleteSelectedBook = () => {
        axios.delete(`/deleteBook/${sSelectedBookId}`).then((oResponse: any) => {
            setMessage(oResponse.data.message);
            MessageToast.current.show();
            const aBooks = [...aBooksList]
            const nIndex = aBooks.findIndex(oBook => JSON.stringify(oBook.id) === sSelectedBookId);
            if (nIndex > -1) {
                aBooks.slice(1, nIndex)
            }
            setBooksList(aBooks)
        })
    }

    const renderBooksList = () => {
        const aBooks = [...aBooksList]
        return aBooks.map((oBook: BookS) => {
            return (
                <StandardListItem
                    data-id={oBook.id}
                    description={oBook.author.firstname + " " + oBook.author.lastname}
                    additionalText={oBook.status}>
                    {oBook.title}
                </StandardListItem>
            );
        });
    };

    return <>
        <Page style={{ height: '100vh' }}
            header={
                <Bar>
                    <Title>Books</Title>
                </Bar>
            } footer={
                <Bar>
                    <Button style={{ ...spacing.sapUiTinyMarginBegin }} onClick={openCreateBookDialog}>Create</Button>
                    {/* <Button disabled={!aBooksList.length} style={{ ...spacing.sapUiTinyMarginBegin }} onClick={onRefreshBookData}>Refresh</Button> */}
                    <Button disabled={!bDeleteButton} style={{ ...spacing.sapUiTinyMarginBegin }} onClick={onDeleteSelectedBook}>Delete</Button>
                </Bar>
            }>
            <List
                style={{ height: '100%' }}
                mode={ListMode.SingleSelect}
                itemType={ListItemType.Active}
                onDoubleClick={onSelectedBookNavigation}
                onItemClick={onBookSelected}>
                {renderBooksList()}
            </List>
            {createPortal(
                <Dialog
                    className="ad-user-dialog sapUiSizeCompact"
                    ref={oCreateBookDialogRef}
                    header={<Bar>Create Book</Bar>}
                    footer={
                        <Bar endContent={
                            <>
                                <Button
                                    design="Emphasized"
                                    onClick={handleCreateBookOk}>
                                    Ok
                                </Button>
                                <Button
                                    design="Transparent"
                                    onClick={handleCreateBookClose}>
                                    Cancel
                                </Button>
                            </>
                        }
                        />
                    }>
                    <Form>
                        <FormItem label="Book Id">
                            <Input
                                onChange={handleCreateBookInputChange}
                                className="ad-input"
                                name="id"
                                value={oCreateBook?.id}
                                placeholder="Id"
                            />
                        </FormItem>
                        <FormGroup titleText="Book Details">
                            <FormItem label="Title">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="title"
                                    value={oCreateBook?.title}
                                    placeholder="Title"
                                />
                            </FormItem>
                            <FormItem label="Description">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="description"
                                    value={oCreateBook?.description}
                                    placeholder="Description"
                                />
                            </FormItem>
                            <FormItem label="URL">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="url"
                                    value={oCreateBook?.url}
                                    placeholder="URL"
                                />
                            </FormItem>
                            <FormItem label="Price">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="price"
                                    value={oCreateBook?.price}
                                    placeholder="Price"
                                />
                            </FormItem>
                        </FormGroup>
                        <FormGroup titleText="Author Details">
                            <FormItem label="First Name">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="author.firstname"
                                    value={oCreateBook?.author.firstname}
                                    placeholder="First Name"
                                />
                            </FormItem>
                            <FormItem label="Last Name">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="author.lastname"
                                    value={oCreateBook?.author.lastname}
                                    placeholder="Last Name"
                                />
                            </FormItem>
                            <FormItem label="Age">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="author.age"
                                    value={oCreateBook?.author.age}
                                    placeholder="Age"
                                />
                            </FormItem>
                            <FormItem label="Email">
                                <Input
                                    className="ad-input"
                                    name="author.email"
                                    type="Email"
                                    valueState={onValidateEmail(oCreateBook?.author.email)}
                                    value={oCreateBook?.author.email}
                                    placeholder="Email"
                                    onChange={handleCreateBookInputChange}
                                />
                            </FormItem>
                        </FormGroup>
                        <FormGroup titleText="Publisher Details">
                            <FormItem label="Published By">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="bookdata.publishedby"
                                    value={oCreateBook?.bookdata.publishedby}
                                    placeholder="Published By"
                                />
                            </FormItem>
                            <FormItem label="Published On">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="bookdata.publishedon"
                                    value={oCreateBook?.bookdata.publishedon}
                                    placeholder="Published On"
                                />
                            </FormItem>
                            <FormItem label="Sponsered By">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="bookdata.sponseredby"
                                    value={oCreateBook?.bookdata.sponseredby}
                                    placeholder="Sponsered By"
                                />
                            </FormItem>
                        </FormGroup>
                    </Form>
                </Dialog>,
                document.body
            )}</Page>
        <Toast ref={MessageToast}>{sMessage}</Toast>
    </>
        ;
}

export default BooksView;
