const { ApolloServer } = require('apollo-server');
const {createStore} = require('./utils');
const store = createStore();
const {ReservationAPI} = require('./datasources')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const dataSources = () => ({
  reservationAPI: new ReservationAPI({store})
});

// the function that sets up the global context for each resolver, using the req
const context = async ({ req }) => {
  // simple auth check on every request
  const auth = (req.headers && req.headers.authorization) || '';
  const username = auth
  const user = await store.users.find({username})
  if(!user||(user&&user.length!==1)){
    return{user:null}
  }
  return { user: user[0] };
};


const server = new ApolloServer({ 
  typeDefs, 
  context, 
  resolvers, 
  dataSources
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
