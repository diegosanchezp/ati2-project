import React from "react";
import type { NextPage } from 'next';
import {useRouter} from "next/router";
import {nextRequest} from "utils/apirest";
import {useSession} from "auth";
import {withTranslations} from "utils/i18n";

import {routes} from "utils/routes";
import {useTranslations} from 'next-intl';
import type {UserSerializer as User} from "djtypes/auth";
import type { formError} from "types"
import {
  Form, FlexboxGrid, ButtonToolbar, Panel,
  Button, Message, useToaster, Container
} from "rsuite";
import Link from "next/link";
import Stepper from "../../components/stepper"


const RegisterPage: NextPage = () => {
  const {dispatch, session} = useSession();
  const router = useRouter();

  const t = useTranslations('RegisterPage');

  const toaster = useToaster();
  const toasterPlacement = {
    placement: "bottomCenter",
  }

  const stepsToPanel = [
    {
      name: t('step1'),
      component: 'step1'
    },
    {
      name: t('step2'),
      component: 'step2'
    },
    {
      name: t('step3'),
      component: 'step3'
    },
    {
      name: t('step4'),
      component: 'step4'
    },
    {
      name: t('step5'),
      component: 'step5'
    },
    {
      name: t('step6'),
      component: 'step6'
    }
  ]

  return (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={18}>
        <Panel header={<h3>{t('registerTitle')}</h3>} bordered>
          <div>
            <p>{t('helpMessages1')}</p>
            <p>{t('helpMessages2')}</p>
          </div>
        </Panel>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={18}>
        <Stepper
          steps={stepsToPanel}
        />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default RegisterPage;


export const getServerSideProps = withTranslations({
  folderPath: "auth"
});
