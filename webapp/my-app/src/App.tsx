import React, { useState, useRef } from 'react';
import { Redirect, Switch, Route, withRouter } from 'react-router-dom';
import './App.css';
import Login from './files/login'
import BooksView from './files/Books';
import BookDetailView from './files/BookDetails';


function App() {

  return (
    <React.Fragment>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/books" component={BooksView} />
        <Route path="/booksDetails/:book_id" component={BookDetailView} />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </React.Fragment>
  )
}

export default App;
