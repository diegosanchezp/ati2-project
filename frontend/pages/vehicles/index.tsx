import React from "react";
import type { NextPage } from 'next';

import {djRequest, getCSRF} from "utils/apirest";

import {
  Form, FlexboxGrid, ButtonToolbar, Panel,
  Button, Message, useToaster,
} from "rsuite";

const VehicleListPage: NextPage = (props) => {
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
