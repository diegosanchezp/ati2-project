import { useState } from 'react';
import { Grid, Col ,Radio, RadioGroup, Form,Panel, Checkbox, SelectPicker, CheckPicker, Row } from 'rsuite';
import {useTranslations} from 'next-intl';
import HaderSection from '../headerSection';

export default function Step5({ 
    handleBack,
    handleNext,
    stepTitle
}){
    const [selectedFrecuency, setSelectedFrecuency] = useState();
    const registerTralation = useTranslations('RegisterPage');
    const [informedWays, setInformedWays] = useState([]); 
    const [selectedCustomFrecuency, setSelectedCustomFrecuency] = useState('')

    const handleChangeFrecuency = (e) => {
        setSelectedFrecuency(e);
    }
    const handleSubmitStep = () =>{
        handleNext({});
    }
    const handleCheckInformedWay = (way: string,e) => {
        const checked = e.target.checked;
        console.log(informedWays);
        if(informedWays.includes(way) && !checked){
            setInformedWays(informedWays => informedWays.filter(settedWay => settedWay !== way));
            return
        }
        setInformedWays(informedWays => [...informedWays,way]);
    }

    const handleSelectCustomFrecuency = (frecuency : string) => {
        setSelectedCustomFrecuency(frecuency)
    }

    const data = [
        'Vehículos de mi interés',
        'Asesoría profesional'
      ].map(item => ({ label: item, value: item }));


    const dataSocialMedia = [
        'Facebook',
        'Twitter'
      ].map(item => ({ label: item, value: item }));

    const dataFrecuency = [
        'FRECUENCIA POR SEMANA',
        'FRECUENCIA POR DÍA',
        'FRECUENCIA POR MES'
    ].map(item => ({ label: item, value: item }));

    const textDataFrecuency = (key:string) => {
        const objectSwitch = {
            'FRECUENCIA POR SEMANA':'Veces por semana',
            'FRECUENCIA POR DÍA': 'Cada tantos días',
            'FRECUENCIA POR MES': 'Veces por mes'
        }
        return objectSwitch[key]
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
                header={<p>{registerTralation('fifthStep.header')}</p>}
                bordered
                style={{
                    marginTop: "1em"
                }}
            >
                <Form>
                    <Form.Group controlId="radioList">
                        <RadioGroup name="radioList" inline onChange={handleChangeFrecuency}>
                            <Grid>
                                <Col md={6} style={{padding:4}}>
                                    <Radio value="weekly">{registerTralation('fifthStep.weekly')}</Radio>
                                </Col>
                                <Col md={6} style={{padding:4}}>
                                    <Radio value="twoWeekly">{registerTralation('fifthStep.twoWeekly')}</Radio>
                                </Col>
                                <Col md={6} style={{padding:4}}>
                                    <Radio value="monthly">{registerTralation('fifthStep.monthly')}</Radio>
                                </Col>
                                <Col md={6} style={{padding:4}}>
                                    <Radio value="other">{registerTralation('fifthStep.other')}</Radio>
                                </Col>
                            </Grid>
                        </RadioGroup>
                    </Form.Group>
                    {
                        selectedFrecuency === 'other' && 
                        <Form.Group controlId="customFrecuency">
                            <Grid>
                                <Col md={6}>
                                    <Form.ControlLabel>{registerTralation('fifthStep.customFrecuencyTag')}</Form.ControlLabel>
                                    <SelectPicker onChange={handleSelectCustomFrecuency} data={dataFrecuency} style={{ width: 224 }} />
                                </Col>
                                <Col md={12}>
                                    <Form.ControlLabel>{textDataFrecuency(selectedCustomFrecuency)}.</Form.ControlLabel>
                                    <Form.Control type="text" name="mobile" required />
                                </Col>
                            </Grid>
                        </Form.Group>
                    }

                    <Form.Group controlId="interestServices">
                        <Grid>
                            <Col md={6}>
                                <p>{registerTralation('fifthStep.interestServices')}</p>
                            </Col>
                            <Col md={12}>
                                <p>{registerTralation('fifthStep.selectCategory')}</p>
                            </Col>
                            <Col>
                                <CheckPicker data={data} style={{ width: 200 }} />
                            </Col>
                        </Grid>
                    </Form.Group>
                    {registerTralation('fifthStep.informedWays')}
                    <Form.Group controlId="informedWays">
                        <Grid fluid>
                            <Row className="show-grid">
                                <Col md={12}>
                                    <Checkbox 
                                        onChangeCapture={(e)=>{
                                            handleCheckInformedWay('email',e)
                                        }}
                                    >{registerTralation('fifthStep.email')}</Checkbox>
                                </Col>
                                <Col md={12}>
                                    {
                                        informedWays.includes("email") &&
                                        <Form.Group controlId="email">
                                            <Form.Control type="text" name="email" required />
                                        </Form.Group>
                                    }
                                </Col> 
                            </Row>
                            <Row className="show-grid">
                                <Col md={12}>
                                    <Checkbox 
                                        onChangeCapture={(e)=>{
                                            handleCheckInformedWay('bussinesSocialMedia',e)
                                        }}
                                    >{registerTralation('fifthStep.bussinesSocialMedia')}</Checkbox>
                                </Col>
                                <Col md={12}>
                                    {
                                        informedWays.includes("bussinesSocialMedia") &&
                                        <CheckPicker data={dataSocialMedia} style={{ width: 300 }} />
                                    }
                                </Col>   
                            </Row>
                            <Row className="show-grid">
                                <Col md={12}>
                                    <Checkbox 
                                        onChangeCapture={(e)=>{
                                            handleCheckInformedWay('mySocialMedia',e)
                                        }}
                                    >{registerTralation('fifthStep.mySocialMedia')}</Checkbox>
                                </Col>
                                <Col md={12}>
                                    {
                                        informedWays.includes("mySocialMedia") &&
                                        <CheckPicker data={dataSocialMedia} style={{ width: 300 }} />
                                    }
                                </Col>
                            </Row>
                            <Row className="show-grid">
                                <Col md={12}>
                                    <Checkbox 
                                        onChangeCapture={(e)=>{
                                            handleCheckInformedWay('sms',e)
                                        }}
                                    >{registerTralation('fifthStep.sms')}</Checkbox>
                                </Col>
                                <Col md={12}>
                                    {
                                        informedWays.includes("sms") &&
                                        <Form.Group controlId="email">
                                            <Form.ControlLabel>{registerTralation('fifthStep.phoneNumber')}</Form.ControlLabel>
                                            <Form.Control type="text" name="email" required />
                                        </Form.Group>
                                    }
                                </Col>   
                            </Row>
                            <Row className="show-grid">
                                <Col md={12}>
                                    <Checkbox 
                                        onChangeCapture={(e)=>{
                                            handleCheckInformedWay('otherWay',e)
                                        }}
                                    >{registerTralation('fifthStep.otherWay')}</Checkbox>
                                </Col>
                                <Col md={12}>
                                    {
                                        informedWays.includes("otherWay") &&
                                        <Form.Group controlId="email">
                                            <Form.ControlLabel>{registerTralation('fifthStep.otherWayTag')}</Form.ControlLabel>
                                            <Form.Control type="text" name="email" required />
                                        </Form.Group>
                                    }
                                </Col>  
                            </Row>
                            <Row className="show-grid">
                                <Col md={12}>
                                    <Checkbox 
                                        onChangeCapture={(e)=>{
                                            handleCheckInformedWay('facebook',e)
                                        }}
                                    >{registerTralation('fifthStep.facebook')}</Checkbox>
                                </Col>
                                <Col md={12}>
                                    {
                                        informedWays.includes("facebook") &&
                                        <Form.Group controlId="email">
                                            <Form.ControlLabel>{registerTralation('fifthStep.facebookTag')}</Form.ControlLabel>
                                            <Form.Control type="text" name="email" required />
                                        </Form.Group>
                                    }
                                </Col>
                            </Row>
                        </Grid>
                    </Form.Group>
                </Form>
            </Panel>
        </>
    );
}
