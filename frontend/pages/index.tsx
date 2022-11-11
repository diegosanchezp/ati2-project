import {withAuth, useSession} from "auth";
import type {PageWithSession} from "types"
import {useTranslations} from 'next-intl';
import LocaleSwitcher from 'components/LocaleSwitcher';

type HomePageProps = {};

const Home: PageWithSession<HomePageProps> = (props) => {
  const t = useTranslations('Index');
  return (
    <>
      <p>{t('test')}</p>
    </>
  );
};

export default Home;

export const getServerSideProps = withAuth<HomePageProps>({

	async getServerSideProps({user, locale, locales}){

    return {
      props: {
        a: "a",
        messages: (await import(`../translations/${locale}.json`)).default,
      },
    }
  }
})
