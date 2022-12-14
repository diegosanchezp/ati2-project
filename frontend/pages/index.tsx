import {withAuth, useSession} from "auth";
import type {PageWithSession} from "types"
import {useTranslations} from 'next-intl';
import LocaleSwitcher from 'components/LocaleSwitcher';

type HomePageProps = {};

const Home: PageWithSession<HomePageProps> = (props) => {
  const t = useTranslations('Index');
  return (
    <>
      <p style={{ textAlign: 'center', fontSize: '32px' }}>{'Bienvenido a tu PCarro.com' }</p>
    </>
  );
};

export default Home;

export const getServerSideProps = withAuth<HomePageProps>({

	async getServerSideProps({user}){

    return {
      props: {
        a: "a",
        user: user
      },
    }
  }
})
