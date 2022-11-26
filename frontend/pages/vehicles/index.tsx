import React from "react";
import type { NextPage } from 'next';

import {djRequest, getCSRF} from "utils/apirest";

import {
  Form, FlexboxGrid, ButtonToolbar, Panel,
  Button, Message, useToaster,
} from "rsuite";

import {withAuth, useSession} from "auth";
import type {PageWithSession} from "types"

type VehiclesPageProps = {};

const VehicleListPage: PageWithSession<VehiclesPageProps> = (props) => {
  const toaster = useToaster();

  const toastOptions = {
    placement: "bottomCenter"
  }
  return (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Vehicle list</h3>} bordered>
          Hello from vehicles
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default VehicleListPage

export const getServerSideProps = withAuth<VehiclesPageProps>({

	async getServerSideProps({user}){
    return {
      props: {
        a: "a",
      },
    }
  }
})
