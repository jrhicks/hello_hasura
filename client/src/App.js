import React, { Component } from 'react';
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-client";

// Setup the network "links"
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

import WorkOrderTable from './WorkOrderTable.js';
import './App.css';

const wsurl = 'wss://hasura10.herokuapp.com/v1alpha1/graphql';
const httpurl = 'https://hasura10.herokuapp.com/v1alpha1/graphql';

const wsLink = new WebSocketLink({
  uri: wsurl,
  options: {
    reconnect: true
  }
});
const httpLink = new HttpLink({
  uri: httpurl,
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    console.log({ query: query, kind: kind, operation: operation });
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
)

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('access_token');
  // return the headers to the context so httpLink can read them
  console.log( { headers: headers });
  console.log( { token: token })

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache()
});

class App extends Component {

  login = () => {
    this.props.auth.login();
  }

  logout = () => {
    this.props.auth.logout();
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <button onClick={this.login}>Login</button>
        <button onClick={this.logout}>Logout</button>
        <WorkOrderTable />
      </ApolloProvider>
    );
  }
}

export default App;
