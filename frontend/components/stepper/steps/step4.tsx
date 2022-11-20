import { useState } from 'react';
import { Form,Panel, FlexboxGrid, Col, Checkbox } from 'rsuite';
import {useTranslations} from 'next-intl';
import HaderSection from '../headerSection';

export default function Step4({ 
    handleBack,
    handleNext,
    stepTitle
}){
    const [informedCheck, setInformedCheck] = useState(false);
    const registerTralation = useTranslations('RegisterPage');
    
    const handleChangeInformedCheck = (e) => {
        setInformedCheck(e.target.checked);
    }
    const handleSubmitStep = () =>{
        handleNext({
            informedCheck
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
                    <FlexboxGrid justify='center'>
                        <Col md={8}>
                            <Form.Group controlId="email">
                                <Form.ControlLabel>{registerTralation('fourthStep.email')}</Form.ControlLabel>
                                <Form.Control type="text" name="email" required />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.ControlLabel>{registerTralation('fourthStep.password')}</Form.ControlLabel>
                                <Form.Control type="text" name="password" required />
                            </Form.Group>
                            <Form.Group>
                                <Checkbox onChangeCapture={handleChangeInformedCheck} >{registerTralation('fourthStep.informedCheck')}</Checkbox>
                            </Form.Group>
                        </Col>
                    </FlexboxGrid> 
                </Form>
            </Panel>
        </>
    );
}
