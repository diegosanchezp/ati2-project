import { Grid, Col , Form,Panel, SelectPicker } from 'rsuite';
import {useTranslations} from 'next-intl';
import HaderSection from '../headerSection';

export default function Step6({ 
    handleBack,
    handleNext,
    stepTitle
}){
    const registerTralation = useTranslations('RegisterPage');
    const dataBank = [
        'Banesco Panamá - Cuenta nro: 201800948693 – Código SWIFT: BANSPAPA',
    ].map(item => ({ label: item, value: item }));

    const dataCountries = [
        'Venezuela',
        'Colombia'
    ].map(item => ({ label: item, value: item }));

    const handleSubmitStep = () =>{
        handleNext({});
    }    
    return (
        <>
            <HaderSection
                handleBack={handleBack}
                handleNext={handleSubmitStep}
                stepTitle={stepTitle}
                canBack={true}
            />
            <Panel
                header={<><p>{registerTralation('sixthStep.clientCodeTag')}<b> CÓDIGO</b></p></>}
                bordered
                style={{
                    marginTop: "1em"
                }}
            >
                <p style={{
                    float:'right',
                    marginTop:-50,
                    border:'solid 1px #5f5f5f',
                    padding:10
                    }}>{registerTralation('sixthStep.warningMessage')}</p>
                <Panel 
                    className='stepper-panel'
                    style={{backgroundColor:'rgb(0,176,240)'}} 
                    bordered>
                        <h6 style={{textAlign:'center'}}>
                            {registerTralation('sixthStep.header')}
                        </h6>
                </Panel>
                <p>{registerTralation('sixthStep.subHeader')}</p>
                <Form>
                    <Grid>
                        <Col md={12}>
                            <Form.ControlLabel>{registerTralation('sixthStep.originBank')}.</Form.ControlLabel>
                            <Form.Control type="text" name="mobile" required />
                            <Form.ControlLabel>{registerTralation('sixthStep.originCountry')}.</Form.ControlLabel>
                            <SelectPicker data={dataCountries} style={{ width: 300 }} />
                        </Col>
                        <Col md={12}>
                            <Form.ControlLabel>{registerTralation('sixthStep.destinyBank')}.</Form.ControlLabel>
                            <SelectPicker data={dataBank} style={{ width: 300 }} />
                        </Col>
                    </Grid>
                </Form>
                
                <Grid> 
                    <Col 
                        md={12}
                    >
                        <div
                            style={{
                                border:'solid 1px #5f5f5f',
                                padding:10,
                                marginTop:20
                            }}
                        >
                            <h6>{registerTralation('sixthStep.firstSection.title')}</h6>
                            <p>{registerTralation('sixthStep.firstSection.paragraph1')}</p>
                            <p>{registerTralation('sixthStep.firstSection.paragraph2')}</p>
                        </div>
                        <div 
                            style={{
                                border:'solid 1px #5f5f5f',
                                padding:10,
                                marginTop:20
                            }}
                        >
                            <h6>{registerTralation('sixthStep.secondSection.title')}</h6>
                            <p>{registerTralation('sixthStep.secondSection.paragraph1')}</p>
                            <p>{registerTralation('sixthStep.clientCodeTag')}<b> CÓDIGO</b></p>
                            <p>
                                {registerTralation('sixthStep.secondSection.paragraph2')}
                                <a>
                                    {registerTralation('sixthStep.secondSection.linkParagraph2')}
                                </a>
                            </p>
                            <p>{registerTralation('sixthStep.secondSection.paragraph3')}</p>
                            <p>{registerTralation('sixthStep.secondSection.paragraph4')}</p>
                        </div>
                        <div 
                            style={{
                                border:'solid 1px #5f5f5f',
                                padding:10,
                                marginTop:20
                            }}
                        >
                            <h6>{registerTralation('sixthStep.thirdSection.title')}</h6>
                            <p style={{textAlign:'center'}}>
                                <b>{registerTralation('sixthStep.thirdSection.paymentData')}</b>
                            </p>
                            <p>
                                <b>{registerTralation('sixthStep.thirdSection.bank')}:</b>
                                <span style={{float:'right'}}>Banesco Panamá</span>
                            </p>
                            <p>
                                <b>{registerTralation('sixthStep.thirdSection.accountNumber')}:</b>
                                <span style={{float:'right'}}>201800948693</span>
                            </p>
                            <p>
                                <b>{registerTralation('sixthStep.thirdSection.SWIFTCode')}:</b>
                                <span style={{float:'right'}}>BANSPAPA</span>
                            </p>
                            <p>
                                <b>{registerTralation('sixthStep.thirdSection.accountName')}:</b>
                                <span style={{float:'right'}}>nombre de la empresa C.A</span>
                            </p>
                        </div>
                    </Col>
                    <Col md={10}
                        style={{
                            border:'solid 1px #5f5f5f',
                            padding:10,
                            margin:20
                        }}>
                            <h6>{registerTralation('sixthStep.fourthSection.title')}</h6>
                            <p>{registerTralation('sixthStep.fourthSection.attentionDays')}</p>
                            <p>{registerTralation('sixthStep.fourthSection.attentionHours')}</p>
                            
                            <p><b>{registerTralation('sixthStep.fourthSection.phoneNumbers')}</b></p>
                            <p>0414-389-74-44</p>
                            <p>0058-0212-362-82-68</p>
                            <p><b>{registerTralation('sixthStep.fourthSection.email')}</b></p>
                            <p>nirvana01@gmail.com</p>
                    </Col>
                </Grid>
            </Panel>
        </>
    );
}
