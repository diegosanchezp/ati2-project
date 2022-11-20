import { useState } from 'react';
import { Form,Panel, RadioGroup, Grid, Col, Radio } from 'rsuite';
import {useTranslations} from 'next-intl';
import HaderSection from '../headerSection';

export default function Step3({ 
    handleBack,
    handleNext,
    stepTitle
}){
    const [idiom, setIdiom] = useState("spanish");
    const registerTralation = useTranslations('RegisterPage');
    
    const handleChangeIdiom = (e) => {
        setIdiom(e);
    }
    const handleSubmitStep = () =>{
        handleNext({});
    }
    return (
        <>
            <HaderSection
                handleBack={handleBack}
                handleNext={handleSubmitStep}
                stepTitle={stepTitle}
                canContinue={true}
                canBack={true}
            />
            <Panel
                bordered
                style={{
                    marginTop: "1em"
                }}
            >
                <Form style={{padding:'auto'}}>
                    <Form.Group controlId="radioList">
                        <RadioGroup value={idiom} name="radioList" inline onChange={handleChangeIdiom}>
                            <Grid>
                                <Col md={8} style={{padding:8}}> <p>{registerTralation('thirdStep.header')}</p></Col>
                                <Col md={8} style={{padding:4}}>
                                    <Radio value="spanish">{registerTralation('thirdStep.spanish')}</Radio>
                                </Col>
                                <Col md={8} style={{padding:4}}>
                                    <Radio value="english">{registerTralation('thirdStep.english')}</Radio>
                                </Col>
                            </Grid>
                        </RadioGroup>
                    </Form.Group> 
                </Form>
            </Panel>
        </>
    );
}
