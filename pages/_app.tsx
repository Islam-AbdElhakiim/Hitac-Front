import { usePathname } from "next/navigation";
import "./globals.css";
import { appWithTranslation } from "next-i18next";
import Layout from "@/components/Layout";
import ReduxProvider from "@/redux/Provider";
import App, { AppContext } from "next/app";

const MyApp = ({ Component, pageProps }: any) => {
  const route = usePathname();

  return (
    <ReduxProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ReduxProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, pageProps: { ...appProps.pageProps } };
};
export default appWithTranslation(MyApp);
