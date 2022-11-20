import { useState } from 'react';
import { Grid, Col ,Radio, RadioGroup, Form,Panel, Checkbox, CheckboxGroup } from 'rsuite';
import {useTranslations} from 'next-intl';
import HaderSection from '../headerSection';
export default function Step1({ 
    handleBack,
    handleNext,
    stepTitle 
}){
    const [selectedWay, setSelectedWay] = useState();
    const registerTralation = useTranslations('RegisterPage');
    
    const handleChangeWay = (e) => {
        setSelectedWay(e);
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
            />
            <Panel
                header={<p>{registerTralation('firstStep.header')}</p>}
                bordered
                style={{
                    marginTop: "1em"
                }}
            >
                <Form>
                    <Form.Group controlId="radioList">
                        <RadioGroup name="radioList" inline onChange={handleChangeWay}>
                            <Grid>
                                <Col md={6} style={{padding:4}}>
                                    <Radio value="webPortal">{registerTralation('firstStep.webPortal')}</Radio>
                                </Col>
                                <Col md={6} style={{padding:4}}>
                                    <Radio value="socialMedias">{registerTralation('firstStep.socialMedias')}</Radio>
                                </Col>
                                <Col md={6} style={{padding:4}}>
                                    <Radio value="friends">{registerTralation('firstStep.friends')}</Radio>
                                </Col>
                                <Col md={6} style={{padding:4}}>
                                    <Radio value="others">{registerTralation('firstStep.others')}</Radio>
                                </Col>
                            </Grid>
                        </RadioGroup>
                    </Form.Group>  

                {
                    selectedWay === 'socialMedias' ?
                        <CheckboxGroup name="checkboxList" 
                            style={{
                                width:'25%',
                                margin:'auto'
                            }}>
                            <p>{registerTralation('firstStep.selectOptions')}</p>
                            <Checkbox value="A">Facebook</Checkbox>
                            <Checkbox value="B">Twitter</Checkbox>
                            <Checkbox value="C">Instagram</Checkbox>
                        </CheckboxGroup>
                    :
                    selectedWay === 'others' ?
                    
                        <Form.Group 
                            style={{
                                width:'25%',
                                margin:'auto'
                            }}
                            controlId="group_others"
                        >
                            <Form.ControlLabel>{registerTralation('firstStep.tagOthers')}</Form.ControlLabel>
                            <Form.Control type="text" name="other" required />
                        </Form.Group>
                    :
                        <></>
                }
                </Form>
            </Panel>
        </>
    );
}
