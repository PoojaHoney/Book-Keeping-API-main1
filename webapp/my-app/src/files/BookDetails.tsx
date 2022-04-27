import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    Bar,
    Button,
    Title,
    Form,
    FormItem,
    Input,
    FormGroup,
    Toast,
    Page
} from '@ui5/webcomponents-react';
import './Login.css';
import { spacing } from '@ui5/webcomponents-react-base';
import axios from 'axios';

// interface OwnerDataS {
//     firstname: string,
//     lastname: string,
//     age: string,
//     email: string
// }

// interface BookDataS {
//     publishedby: string,
//     publishedon: string,
//     sponseredby: string
// }

interface BookS {
    id: string,
    title: string,
    callnumber: string,
    author: string,
    publisher: string
}

const BookDetailView = () => {
    const [oSelectedBook, setSelectedBook] = useState<BookS | never>()
    const [oUpdateSelectedBook, setUpdateSelectedBook] = useState<BookS | never>()
    const History = useHistory();
    const oParameters: any = useParams()
    const [IsChangesMade, setChangesMade] = useState(false)
    const MessageToast: any = useRef();
    const [sMessage, setMessage] = useState<string>("");

    useEffect(() => {
        axios.get(`/book/${oParameters?.book_id}`).then((oResponse) => {
            setSelectedBook(oResponse.data.data || {})
            setUpdateSelectedBook(oResponse.data.data || {})
        });
    }, []);

    const handleUpdateBookChange = (oEvent: any) => {
        setUpdateSelectedBook((oUpdateBook: any) => {
            let aFieldname: string[] = []
            if ((oEvent.target.name || "").includes(".")) {
                aFieldname = oEvent.target.name.split(".")
            }
            if (!aFieldname.length) {
                return {
                    ...oUpdateBook,
                    [oEvent.target.name]: oEvent.target.value
                }
            } else {
                const sFieldName: string = aFieldname[0] || ""
                return {
                    ...oUpdateBook,
                    [sFieldName]: {
                        ...oUpdateBook[sFieldName],
                        [aFieldname[1]]: oEvent.target.value
                    }
                }
            }
        });
        setChangesMade(true)
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

    const saveUpdatedBookChanges = () => {
        axios.put(`/book`, oUpdateSelectedBook).then((oResponse: any) => {
            setSelectedBook(oUpdateSelectedBook)
            setMessage(oResponse.data.message);
            MessageToast.current.show();
        })
    }

    const cancelUpdatedBookChanges = () => {
        if (IsChangesMade) {
            setUpdateSelectedBook(oSelectedBook)
        }
    }

    return (
        <>
            <Page style={{ height: '100vh' }}
                header={
                    <Bar>
                        <Title>{oUpdateSelectedBook?.title}</Title>
                    </Bar>
                } footer={
                    <Bar>
                        <Button style={{ ...spacing.sapUiLargeMarginBegin }} onClick={saveUpdatedBookChanges}>Save</Button>
                        <Button style={{ ...spacing.sapUiTinyMarginBegin }} onClick={cancelUpdatedBookChanges}>Cancel</Button>
                    </Bar>
                }>
                <Form columnsL={2}
                    columnsM={2}
                    columnsS={2}
                    labelSpanL={4}
                    labelSpanM={2}
                    labelSpanS={12}
                    labelSpanXL={4}>
                    <FormGroup titleText="Book Details">
                        <FormItem label="Title">
                            <Input
                                onChange={handleUpdateBookChange}
                                className="ad-input"
                                name="Title"
                                value={oUpdateSelectedBook?.title}
                                placeholder="Title"
                            />
                        </FormItem>
                        <FormItem label="Call Number">
                            <Input
                                onChange={handleUpdateBookChange}
                                className="ad-input"
                                name="callnumber"
                                value={oUpdateSelectedBook?.callnumber}
                                placeholder="Call Number"
                            />
                        </FormItem>
                        {/* <FormItem label="URL">
                            <Input
                                onChange={handleUpdateBookChange}
                                className="ad-input"
                                name="url"
                                value={oUpdateSelectedBook?.url}
                                placeholder="URL"
                            />
                        </FormItem>
                        <FormItem label="Price">
                            <Input
                                onChange={handleUpdateBookChange}
                                className="ad-input"
                                name="price"
                                value={oUpdateSelectedBook?.price}
                                placeholder="Price"
                            />
                        </FormItem> */}
                        {/* </FormGroup> */}
                        {/* <FormGroup titleText="Author Details"> */}
                        <FormItem label="Author">
                            <Input
                                onChange={handleUpdateBookChange}
                                className="ad-input"
                                name="author"
                                value={oUpdateSelectedBook?.author}
                                placeholder="Author"
                            />
                        </FormItem>
                        {/* <FormItem label="Last Name">
                            <Input
                                onChange={handleUpdateBookChange}
                                className="ad-input"
                                name="author.lastname"
                                value={oUpdateSelectedBook?.author.lastname}
                                placeholder="Last Name"
                            />
                        </FormItem>
                        <FormItem label="Age">
                            <Input
                                onChange={handleUpdateBookChange}
                                className="ad-input"
                                name="author.age"
                                value={oUpdateSelectedBook?.author.age}
                                placeholder="Age"
                            />
                        </FormItem>
                        <FormItem label="Email">
                            <Input
                                className="ad-input"
                                name="author.email"
                                type="Email"
                                valueState={onValidateEmail(oUpdateSelectedBook?.author.email || "")}
                                value={oUpdateSelectedBook?.author.email}
                                placeholder="Email"
                                onChange={handleUpdateBookChange}
                            />
                        </FormItem>*/}
                    </FormGroup>
                    {/* <FormGroup titleText="Publisher Details"> */}
                    <FormItem label="Published By">
                        <Input
                            onChange={handleUpdateBookChange}
                            className="ad-input"
                            name="publisher"
                            value={oUpdateSelectedBook?.publisher}
                            placeholder="Published By"
                        />
                    </FormItem>
                    {/* <FormItem label="Published On">
                            <Input
                                onChange={handleUpdateBookChange}
                                className="ad-input"
                                name="bookdata.publishedon"
                                value={oUpdateSelectedBook?.bookdata.publishedon}
                                placeholder="Published On"
                            />
                        </FormItem>
                        <FormItem label="Sponsered By">
                            <Input
                                onChange={handleUpdateBookChange}
                                className="ad-input"
                                name="bookdata.sponseredby"
                                value={oUpdateSelectedBook?.bookdata.sponseredby}
                                placeholder="Sponsered By"
                            />
                        </FormItem>
                    </FormGroup> */}
                </Form>
            </Page>
            <Toast ref={MessageToast}>{sMessage}</Toast>
        </>
    );
}

export default BookDetailView;
