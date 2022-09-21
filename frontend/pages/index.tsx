import {withAuth, useSession} from "auth";
import type {PageWithSession} from "types"

type HomePageProps = {};

const Home: PageWithSession<HomePageProps> = (props) => {
  console.log(props.session)
  return (
    <></>
  );
};

export default Home;

export const getServerSideProps = withAuth<HomePageProps>({

	async getServerSideProps({user}){
    return {
      props: {
        a: "a",
      },
    }
  }
})
