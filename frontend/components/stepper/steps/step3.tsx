import { useState } from 'react';
import { Form,Panel, RadioGroup, Grid, Col, Radio } from 'rsuite';
import {useTranslations} from 'next-intl';
import HaderSection from '../headerSection';

export default function Step3({ 
    handleBack,
    handleNext,
    stepTitle
}){
    const [language, setLanguage] = useState("ES");
    const registerTralation = useTranslations('RegisterPage');
    
    const handleChangeLanguage = (e) => {
        setLanguage(e);
    }
    const handleSubmitStep = () =>{
        handleNext({
            language
        });
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
                        <RadioGroup value={language} name="radioList" inline onChange={handleChangeLanguage}>
                            <Grid>
                                <Col md={8} style={{padding:8}}> <p>{registerTralation('thirdStep.header')}</p></Col>
                                <Col md={8} style={{padding:4}}>
                                    <Radio value="ES">{registerTralation('thirdStep.spanish')}</Radio>
                                </Col>
                                <Col md={8} style={{padding:4}}>
                                    <Radio value="EN">{registerTralation('thirdStep.english')}</Radio>
                                </Col>
                            </Grid>
                        </RadioGroup>
                    </Form.Group> 
                </Form>
            </Panel>
        </>
    );
}
