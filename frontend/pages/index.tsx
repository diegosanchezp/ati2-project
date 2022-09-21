import type { NextPage } from 'next';
import {withAuth, useSession} from "auth";

type HomePageProps = {};

const Home: NextPage = () => {
  return (
    <></>
  );
};

export default Home;

export const getServerSideProps = withAuth<HomePageProps>({

	async getServerSideProps({user}){
    return {
      props: {},
    }
  }
})
