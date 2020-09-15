const {gql} = require("apollo-server");


const typeDefs = gql`
  type User {
     createdAt: String!,
     displayName: String!,
     email: String!
  }
    
  type Collection {
   id: ID!
   title: String!
   items: [Item!]!
  }
  
  input CollectionInput {
     title: String,
     items: [ItemInput!]!
  }
  

  type Item {
   id: ID!
   name: String!
   price: Float!
   imageUrl: String!
   collection: Collection
  }
  
  input ItemInput{
    id: ID!
    name: String!
    price: Float!
    imageUrl: String!
 }
  

  type Query {
    collections: [Collection!]!
    collection(id: ID!): Collection
    getCollectionsByTitle(title: String): Collection
  }, 
  
  type Mutation{
    setNewCollection(input: CollectionInput): Boolean
  }
`;

export default typeDefs;


export interface User {
    createdAt: string;
    displayName: string;
    email: string;
}

export interface Collection {
    id: string;
    title: string;
    items: [Item];
}

export interface CollectionInput {
    id: string;
    title: string;
    items: [ItemInput];
}

export interface Item {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    collection: Collection
}

export interface ItemInput {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
}