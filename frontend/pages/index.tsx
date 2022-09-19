import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import {djRequest} from "utils/apirest";
import {withAuth, useSession} from "auth";

type HomePageProps = {};

const Home: NextPage = () => {

  const {session, dispatch} = useSession();
  console.log(session);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          MUI v5 + Next.js with TypeScript example
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <ProTip />
        <button onClick={async ()=>{
          await djRequest("logout");
          dispatch({type: "setUser", user: null });
        }}>logout</button>
        <Copyright />
      </Box>
    </Container>
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
