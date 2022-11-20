import { useState } from 'react';
import { Form,Panel, RadioGroup, Grid, Col, Radio } from 'rsuite';
import {useTranslations} from 'next-intl';
import { Textarea } from 'components/form';
import HaderSection from '../headerSection';

export default function Step2({ 
    handleBack,
    handleNext,
    stepTitle
}){
    const [userType, setUserType] = useState("natural");
    const registerTralation = useTranslations('RegisterPage');
    
    const handleChangeUserType = (e) => {
        setUserType(e);
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
                        <RadioGroup value={userType} name="radioList" inline onChange={handleChangeUserType}>
                            <Grid>
                                <Col md={8} style={{padding:8}}> <p>{registerTralation('secondStep.header')}</p></Col>
                                <Col md={8} style={{padding:4}}>
                                    <Radio value="natural">{registerTralation('secondStep.natural')}</Radio>
                                </Col>
                                <Col md={8} style={{padding:4}}>
                                    <Radio value="business">{registerTralation('secondStep.business')}</Radio>
                                </Col>
                            </Grid>
                        </RadioGroup>
                    </Form.Group> 
                    {
                        userType === "natural" ?
                            <Grid>
                                <Col md={12}>
                                    <Form.Group controlId="name">
                                        <Form.ControlLabel>{registerTralation('secondStep.name')}</Form.ControlLabel>
                                        <Form.Control type="email" name="name" required />
                                    </Form.Group>
                                    <Form.Group controlId="lastname">
                                        <Form.ControlLabel>{registerTralation('secondStep.lastname')}</Form.ControlLabel>
                                        <Form.Control type="text" name="lastname" required />
                                    </Form.Group>
                                    <Form.Group controlId="ID">
                                        <Form.ControlLabel>{registerTralation('secondStep.ID')}</Form.ControlLabel>
                                        <Form.Control type="number" name="ID" required />
                                    </Form.Group>
                                    <Form.Group controlId="email">
                                        <Form.ControlLabel>{registerTralation('secondStep.email')}</Form.ControlLabel>
                                        <Form.Control type="text" name="email" required />
                                    </Form.Group>
                                    <Form.Group controlId="country">
                                        <Form.ControlLabel>{registerTralation('secondStep.country')}</Form.ControlLabel>
                                        <Form.Control type="text" name="country" required />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group controlId="mobile">
                                        <Form.ControlLabel>{registerTralation('secondStep.mobile')}</Form.ControlLabel>
                                        <Form.Control type="text" name="mobile" required />
                                    </Form.Group>
                                    <Form.Group controlId="landline">
                                        <Form.ControlLabel>{registerTralation('secondStep.landline')}</Form.ControlLabel>
                                        <Form.Control type="text" name="landline" required />
                                    </Form.Group>
                                </Col>
                            </Grid>
                        :
                            <Grid>
                                <Col md={12}>
                                    <h5>{registerTralation('secondStep.subheaderBusiness')}</h5>
                                    <Form.Group controlId="businessName">
                                        <Form.ControlLabel>{registerTralation('secondStep.businessName')}</Form.ControlLabel>
                                        <Form.Control type="text" name="businessName" required />
                                    </Form.Group>
                                    <Form.Group controlId="businessId">
                                        <Form.ControlLabel>{registerTralation('secondStep.businessId')}</Form.ControlLabel>
                                        <Form.Control type="text" name="businessId" required />
                                    </Form.Group>
                                    <Form.Group controlId="city">
                                        <Form.ControlLabel>{registerTralation('secondStep.city')}</Form.ControlLabel>
                                        <Form.Control type="text" name="city" required />
                                    </Form.Group>
                                    <Form.Group controlId="address">
                                        <Form.ControlLabel>{registerTralation('secondStep.address')}</Form.ControlLabel>
                                        <Form.Control accepter={Textarea} type="text" name="message" required />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <h5>{registerTralation('secondStep.subheaderBusiness2')}</h5>
                                    <Form.Group controlId="fullname">
                                        <Form.ControlLabel>{registerTralation('secondStep.fullname')}</Form.ControlLabel>
                                        <Form.Control type="text" name="fullname" required />
                                    </Form.Group>
                                    <Form.Group controlId="country">
                                        <Form.ControlLabel>{registerTralation('secondStep.country')}</Form.ControlLabel>
                                        <Form.Control type="text" name="country" required />
                                    </Form.Group>
                                    <Form.Group controlId="mobile">
                                        <Form.ControlLabel>{registerTralation('secondStep.mobile')}</Form.ControlLabel>
                                        <Form.Control type="text" name="mobile" required />
                                    </Form.Group>
                                    <Form.Group controlId="landline">
                                        <Form.ControlLabel>{registerTralation('secondStep.landline')}</Form.ControlLabel>
                                        <Form.Control type="text" name="landline" required />
                                    </Form.Group>
                                </Col>
                            </Grid>
                    }

                    <Form.Group>
                        {registerTralation('secondStep.warning')}
                    </Form.Group>
                </Form>
            </Panel>
        </>

    );
}
