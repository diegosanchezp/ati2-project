import { useState } from 'react';
import { Panel, Row, Col, Button, Grid } from 'rsuite';
import {useTranslations} from 'next-intl';

const StepperStyles = {
    selectedPanel: {
        backgroundColor:'rgb(146,208,80)',
        color:'white',
        cursor:'pointer'
    },
    selectedText: {
        textDecoration:'underline',
        textAlign:'center',
        fontWeight: 'bold'
    }
}

export default function Stepper({ steps }){
  const [actualStep, setActualStep] = useState(0);
  const translationButtons = useTranslations('CommonButtons');

  const handleNextStep = () => {
    if(actualStep + 1 < steps.length){
        setActualStep(actualStep => actualStep + 1);
    }
  }

  const backToStep = (index: number) => {
    if(index <= actualStep){
        setActualStep(index);
    }
  }

  return (
    <Grid fluid>
        <Row gutter={24}>
            {
                steps.map((step,index) => (
                    <Col md={8} sm={12} style={{padding:4}}>
                        <Panel 
                            onClick={()=>{backToStep(index)}}
                            style={actualStep >= index ? StepperStyles.selectedPanel: {}}
                            bordered>
                            <p style={actualStep === index ? StepperStyles.selectedText : {textAlign:'center'}}>
                               {index+1} - {step.name}
                            </p>
                        </Panel>
                    </Col>
                ))
            }
        </Row>
        <Row>
            <Col md={2}>
                <Button style={{marginTop:'15px'}} color="red" appearance="primary" onClick={handleNextStep}>
                    {translationButtons('previous')}
                </Button>
            </Col>
            <Col md={20}>
                <Panel style={{backgroundColor:'rgb(0,176,240)'}} bordered>
                    <h6 style={{textAlign:'center'}}>
                        {steps[actualStep].name}
                    </h6>
                </Panel>
            </Col>
            <Col md={2}>
                <Button style={{marginTop:'15px'}} color="red" appearance="primary" onClick={handleNextStep}>
                    {translationButtons('continue')}
                </Button>
            </Col>
        </Row>  
    </Grid>        
  );
}
