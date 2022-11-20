import { Panel, Row, Col, Button } from 'rsuite';
import {useTranslations} from 'next-intl';

export default function HaderSection({ canBack=false, canContinue=false, handleBack, handleNext, stepTitle }){
 const translationButtons = useTranslations('CommonButtons');

  return (
    <Row>
        <Col md={2}>
            {
                canBack &&
                    <Button style={{marginTop:'5px'}} color="red" appearance="primary" onClick={handleBack}>
                        {translationButtons('previous')}
                    </Button>
            }
        </Col>
        <Col md={20}>
            <Panel 
            className='stepper-panel'
            style={{backgroundColor:'rgb(0,176,240)'}} 
            bordered>
                <h6 style={{textAlign:'center'}}>
                    {stepTitle}
                </h6>
            </Panel>
        </Col>
        <Col md={2}>
            {
                canContinue &&
                <Button style={{marginTop:'5px'}} color="red" appearance="primary" onClick={handleNext}>
                    {translationButtons('continue')}
                </Button>
            }
        </Col>
    </Row>   
  );
}
