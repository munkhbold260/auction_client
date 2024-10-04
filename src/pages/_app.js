// _app.js эсвэл _app.tsx файл дотор
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apolloclient"; // apolloclient-ийг импортлох
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
