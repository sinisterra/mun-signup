import React from 'react'
import AppRouter from './AppRouter'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo';


const client = new ApolloClient({
  networkInterface: createNetworkInterface({uri: '/graphql'})
})

const Main = () => (
  <ApolloProvider client={client}>
    <AppRouter/>
  </ApolloProvider>
)

export default Main
