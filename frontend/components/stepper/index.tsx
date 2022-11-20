import { useState } from 'react';
import { Panel, Row, Col, Grid,  Notification, useToaster } from 'rsuite';
import Step1 from './steps/step1';
import Step2 from './steps/step2';
import Step3 from './steps/step3';
import Step4 from './steps/step4';
import Step5 from './steps/step5';
import Step6 from './steps/step6';
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
  const [informed, setInformed] = useState(false);
  const toaster = useToaster();
  const translationButtons = useTranslations('RegisterPage');
  const handleNextStep = (values:any) => {
    if(values.hasOwnProperty('informedCheck') && !values.informedCheck){
        setActualStep(actualStep => actualStep + 2);
        setInformed(false);
        return
    }
    if(actualStep + 1 < steps.length){
        setActualStep(actualStep => actualStep + 1);
    }
  }

  const backToStep = (index: number) => {
    if(index === 4 && !informed){
        toaster.push(message, { placement:'topEnd' })
        return
    }
    if(index <= actualStep){
        setActualStep(index);
    }
  }

  const handleBackStep = () => {
    if(actualStep - 1 >= 0){
        setActualStep(actualStep => actualStep - 1);
    }
  }

  const componentsSteps = {
    step1: <Step1 stepTitle={steps[0].name} handleNext={handleNextStep} handleBack={handleBackStep} />,
    step2: <Step2 stepTitle={steps[1].name} handleNext={handleNextStep} handleBack={handleBackStep} />,
    step3: <Step3 stepTitle={steps[2].name} handleNext={handleNextStep} handleBack={handleBackStep}/>,
    step4: <Step4 stepTitle={steps[3].name} handleNext={handleNextStep} handleBack={handleBackStep} />,
    step5: <Step5 stepTitle={steps[4].name} handleNext={handleNextStep} handleBack={handleBackStep}/>,
    step6: <Step6 stepTitle={steps[5].name} handleNext={handleNextStep} handleBack={handleBackStep}/>
  }

  const message = (
    <Notification 
        type={'info'} 
        header={translationButtons('infoFrecuency')} 
        closable>

    </Notification>
  );

  return (
    <Grid fluid className="stepper">
        <Row gutter={24}>
            {
                steps.map((step:any,index:number) => (
                    <Col key={index} md={8} sm={12} style={{padding:4}}>
                        <Panel 
                            key={index}
                            className='stepper-panel'
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
            <Col md={24}>
                {componentsSteps[steps[actualStep].component]}
            </Col>
        </Row>  
    </Grid>        
  );
}
