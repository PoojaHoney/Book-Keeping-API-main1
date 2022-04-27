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

interface iBook {
    id: string,
    title: string,
    callnumber: string,
    author: string,
    publisher: string
}


const BooksView = () => {
    const [oCreateBook, setCreateBookData] = useState<iBook>({
        id: '0',
        title: '',
        callnumber: '',
        author: '',
        publisher: ''
    });
    const oCreateBookDialogRef = useRef<DialogDomRef>(null);
    const [aBooksList, setBooksList] = useState<iBook[] | never[]>([])
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
            setBooksList(oResponse.data.data || [])
        });

        // const interval = setInterval(() => {
        //     axios.get("/allBooks").then((oResponse: any) => {
        //         setBooksList(oResponse.data || [])
        //     });
        // }, 15000);

        // return () => clearInterval(interval);
    }, []);

    const onRefreshBookData = () => {
        axios.get("/books").then((oResponse) => {
            setBooksList(oResponse.data || [])
        });
    }

    const onValIDateEmail = (Email: string) => {
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
        oCreateBookDetails.callnumber = parseInt(oCreateBookDetails.callnumber)
        oCreateBookDetails.id = parseInt(oCreateBookDetails.id)
        axios.post("/book", oCreateBookDetails).then((oResponse: any) => {
            if (oResponse.data.message_Status === "success") {
                const aBooks = [...aBooksList] || []
                aBooks.push(oResponse.data.data)
                setBooksList(aBooks)
                setCreateBookData({
                    id: '0',
                    title: '',
                    callnumber: '',
                    author: '',
                    publisher: ''
                });
                handleCreateBookClose()
            }
            setMessage(oResponse.data.message);
            MessageToast.current.show();
        }, (oResponse: any) => {
            setMessage(oResponse.response.data)
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
        axios.delete(`/book/${sSelectedBookId}`).then((oResponse: any) => {
            setMessage(oResponse.data.message);
            MessageToast.current.show();
            const aBooks = [...aBooksList] || []
            const nIndex = aBooks.findIndex(oBook => JSON.stringify(oBook.id) === sSelectedBookId);
            if (nIndex > -1) {
                aBooks.slice(1, nIndex)
            }
            setBooksList(aBooks)
        })
    }

    const renderBooksList = () => {
        const aBooks = [...aBooksList] || []
        return aBooks.map((oBook: iBook) => {
            return (
                <StandardListItem
                    data-ID={oBook.id}
                    description={oBook.author}>
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
                            <FormItem label="Call Number">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="callnumber"
                                    value={oCreateBook?.callnumber}
                                    placeholder="Call Number"
                                />
                            </FormItem>
                            <FormItem label="Author">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="author"
                                    value={oCreateBook?.author}
                                    placeholder="Author"
                                />
                            </FormItem>
                            <FormItem label="Published By">
                                <Input
                                    onChange={handleCreateBookInputChange}
                                    className="ad-input"
                                    name="publisher"
                                    value={oCreateBook?.publisher}
                                    placeholder="Published By"
                                />
                            </FormItem>
                        </FormGroup>
                        {/* <FormGroup TitleText="Author Details">
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
                                    valueState={onValIDateEmail(oCreateBook?.author.email)}
                                    value={oCreateBook?.author.email}
                                    placeholder="Email"
                                    onChange={handleCreateBookInputChange}
                                />
                            </FormItem>
                        </FormGroup>
                        <FormGroup TitleText="Publisher Details">
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
                        </FormGroup> */}
                    </Form>
                </Dialog>,
                document.body
            )}</Page>
        <Toast ref={MessageToast}>{sMessage}</Toast>
    </>
        ;
}

export default BooksView;
