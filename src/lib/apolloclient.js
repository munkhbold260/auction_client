import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient as createWsClient } from "graphql-ws";
import dotenv from "dotenv";

dotenv.config();
// console.log(
//   "http=======",
//   process.env.NEXT_PUBLIC_HTTP_URL,
//   "ws=====",
//   process.env.NEXT_PUBLIC_WS_URL
// );
// Токен авах функц
const getToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : "";
  }
  return ""; // Сервер талд байх үед хоосон утга буцаана
};

const wsLink = new GraphQLWsLink(
  createWsClient({
    // url: "ws://localhost:4000/graphql", // WebSocket local URL
    // url: "ws://ec2-3-89-35-239.compute-1.amazonaws.com:4000/graphql", // WebSocket deploy URL
    // url: " wss://auction-server-0hqb.onrender.com:4000/graphql",
    url: "ws://ec2-34-207-84-124.compute-1.amazonaws.com:4000/graphql", //aws secord url

    connectionParams: () => ({
      accessToken: getToken(), // Токен дамжуулах
    }),
    on: {
      connected: () => {
        console.log("WebSocket сервертэй амжилттай холбогдлоо.");
      },
      closed: (event) => {
        console.log(
          `WebSocket холболт тасарсан. Код: ${event.code}, Шалтгаан: ${event.reason}`
        );
      },
      error: (error) => {
        console.error("WebSocket холболтын алдаа:", error);
      },
    },
  })
);

// HTTP линк үүсгэх
const httpLink = new HttpLink({
  // uri: "http://localhost:4000/graphql", // GraphQL серверийн local URL
  // uri: "http://ec2-3-89-35-239.compute-1.amazonaws.com:4000/graphql", // GraphQL серверийн deploy URL
  // uri: "https://auction-server-0hqb.onrender.com:4000/graphql",
  // uri: process.env.NEXT_PUBLIC_HTTP_URL,
  uri: "http://ec2-34-207-84-124.compute-1.amazonaws.com:4000/graphql", // aws second url
});

// Захиалга болон асуулга/mutation-г ялгах функц
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // Захиалгын хувьд WebSocket ашиглана
  ApolloLink.from([httpLink]) // Асуулга болон мутацийн хувьд HTTP ашиглана
);

// Apollo Client үүсгэх
const client = new ApolloClient({
  link: splitLink, // split ашиглан HTTP болон WebSocket холбоосыг зохицуулах
  cache: new InMemoryCache(),
});

export default client;
