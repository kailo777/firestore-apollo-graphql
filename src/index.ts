import * as admin from "firebase-admin";
import typeDefs, {CollectionInput} from "./schema";

const serviceAccount = require("./service-account.json");
// import * as serviceAccount from "./service-account.json";


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const {ApolloServer, ApolloError, ValidationError} = require("apollo-server");

const resolvers = {
  Query: {
    async collections() {
      const collections = await admin
          .firestore()
          .collection('collections')
          .get();
      return collections.docs.map(collection => collection.data());
    },
    async getCollectionsByTitle(_: null, args: { title: string }) {
      const {title} = args;
      const collections = await admin
          .firestore()
          .collection('collections')
          .where('collections/title', '==', title)
          .get();

      return collections.docs.map(collection => collection.data());
    }

  },
  Mutation: {
    async setNewCollection(_: null, args: { input: CollectionInput }) {
      try {
        const data = {...args.input};
        const collectionRef = admin.firestore()
            .collection('collections');

        const batch = admin
            .firestore()
            .batch();
        const newDocRef = collectionRef.doc();

        batch.set(newDocRef, data);
        await batch.commit();
        //Als Rückgabe Object sollte die ID zurückgegeben werden
        return true;
      } catch (error) {
        throw new ApolloError(error);
      }
    }
    // async editCollection(collectionKey, objectsToAdd) {
    //     try {
    //         const batch = admin.firestore.batch();
    //
    //         const userTweets = await admin
    //             .firestore()
    //             .collection('tweets')
    //             .where('userId', '==', user.id)
    //             .get();
    //         return userTweets.docs.map(tweet => tweet.data()) as Tweet[];
    //     } catch (error) {
    //         throw new ApolloError(error);
    //     }
    // }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: {
    apiKey: ""
  },
  introspection: true
});

server.listen({port: process.env.PORT || 4000}).then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
