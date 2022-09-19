import type { NextPage } from 'next';
import {djRequest} from "utils/apirest";
import {withAuth, useSession} from "auth";

type HomePageProps = {};

const Home: NextPage = () => {

  const {session, dispatch} = useSession();
  console.log(session);

  return (
    <button onClick={async ()=>{
      await djRequest("logout");
      dispatch({type: "setUser", user: null });
    }}>logout</button>
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
