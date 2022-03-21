import { useState, createContext, useContext } from 'react'
import { createClient, Provider } from 'urql'
import { buildSchema } from 'graphql'
import { addMocksToSchema } from '@graphql-tools/mock'
import getConfig from 'next/config'
import schemaExchange from './schemaExchange'
import typeDefs from '../schema'

const { publicRuntimeConfig } = getConfig()

let exchanges = []
if (publicRuntimeConfig.MOCK_DATA) {
  const schema = buildSchema(typeDefs)
  const mockedSchema = addMocksToSchema({ 
    schema,
  })
  exchanges.push(schemaExchange(mockedSchema))
}

const makeQLClient = () => createClient({
  url: publicRuntimeConfig.GRAPHQL_BACKEND,
  fetchOptions: () => {
    if (typeof window === "undefined") return { headers: {} }
    
    const token = localStorage.getItem('token')
    return {
      headers: { authorization: token ? `Bearer ${new Buffer(token).toString('base64')}` : '' },
    }
  },
  exchanges: exchanges,
})

const QLClientContext = createContext()

export const QLClientProvider = ({ children }) => {
  const [client, setClient] = useState(makeQLClient())

  return (
    <QLClientContext.Provider value={{ resetQLClient: () => setClient(makeQLClient()) }}>
      <Provider value={client}>{children}</Provider>
    </QLClientContext.Provider>
  )
}

export const useQLClient = () => useContext(QLClientContext)