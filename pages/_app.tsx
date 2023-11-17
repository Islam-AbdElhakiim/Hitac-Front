
import { usePathname } from "next/navigation";
import "./globals.css";
import { appWithTranslation } from 'next-i18next';
import Layout from "@/components/Layout";
import ReduxProvider from "@/redux/Provider";

const MyApp = ({ Component, pageProps }: any) => {
    const route = usePathname();

    return (
        <ReduxProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ReduxProvider>
    )
}
export default appWithTranslation(MyApp)