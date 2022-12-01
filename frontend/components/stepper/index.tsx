import { useState } from 'react';
import { useRouter } from "next/router";
import { Panel, Row, Col, Grid, Notification, useToaster, Button } from 'rsuite';
import Step1 from './steps/step1';
import Step2 from './steps/step2';
import Step3 from './steps/step3';
import Step4 from './steps/step4';
import Step5 from './steps/step5';
import Step6 from './steps/step6';
import { useTranslations } from 'next-intl';
import register from '../../pages/api/auth/register'

const StepperStyles = {
    selectedPanel: {
        backgroundColor: 'rgb(146,208,80)',
        color: 'white',
        cursor: 'pointer'
    },
    selectedText: {
        textDecoration: 'underline',
        textAlign: 'center',
        fontWeight: 'bold'
    }
}

export default function Stepper({ steps }) {
    const [actualStep, setActualStep] = useState(0);
    const [informed, setInformed] = useState(false);
    const [fullData, setFullData] = useState({
        sessionData: {},
        userData: {},
        language: ''
    });
    const [bankData, setBankData] = useState({});
    const [errorsBank, setErrorsBank] = useState({})
    const router = useRouter();
    const toaster = useToaster();
    const translationButtons = useTranslations('RegisterPage');
    const handleNextStep = (values: any) => {
        setFullData({
            ...fullData,
            ...values
        })
        if (values.sessionData && !values.sessionData.informedCheck) {
            setActualStep(actualStep => actualStep + 2);
            setInformed(false);
            return
        }
        if (actualStep + 1 < steps.length) {
            setActualStep(actualStep => actualStep + 1);
        }
    }

    const backToStep = (index: number) => {
        if (index === 4 && !informed) {
            toaster.push(message, { placement: 'topEnd' })
            return
        }
        if (index <= actualStep) {
            setActualStep(index);
        }
    }

    const handleBackStep = () => {
        if (!informed && actualStep === 5) {
            setActualStep(actualStep => actualStep - 2);
            return
        }
        if (actualStep - 1 >= 0) {
            setActualStep(actualStep => actualStep - 1);
        }
    }

    const componentsSteps = {
        step1: <Step1 stepTitle={steps[0].name} handleNext={handleNextStep} handleBack={handleBackStep} />,
        step2: <Step2 stepTitle={steps[1].name} handleNext={handleNextStep} handleBack={handleBackStep} />,
        step3: <Step3 stepTitle={steps[2].name} handleNext={handleNextStep} handleBack={handleBackStep} />,
        step4: <Step4 stepTitle={steps[3].name} handleNext={handleNextStep} handleBack={handleBackStep} />,
        step5: <Step5 stepTitle={steps[4].name} handleNext={handleNextStep} handleBack={handleBackStep} />,
        step6: <Step6 fullData={fullData} errorsBank={errorsBank} bankData={bankData} setBankData={setBankData} stepTitle={steps[5].name} handleNext={handleNextStep} handleBack={handleBackStep} />
    }

    const message = (
        <Notification
            type={'info'}
            header={translationButtons('infoFrecuency')}
            closable>

        </Notification>
    );

    const succcessRegister = (
        <Notification
            type={'success'}
            header={translationButtons('succcessRegister')}
            closable>

        </Notification>
    );

    const errorRegister = (
        <Notification
            type={'error'}
            header={translationButtons('errorRegister')}
            closable>

        </Notification>
    );

    const validBank = () => {
        const formatErros = {};
        ['origin_bank_country','origin_bank','destination_bank'].forEach(field => {
            if (!bankData[field]) {
                formatErros[field] = 'void'
            }
        })
        setErrorsBank(formatErros);
        if (Object.keys(formatErros).length > 0) {
            return false
        }
        return true
    }

    const handleSubmitRegister = async () => {
        if (!validBank()) {
            return
        }

        const phoneNumbers = [];
        const bodyToSend = {
            password: fullData.sessionData.password,
            username: fullData.sessionData.email.split('@')[0],
            first_name: fullData.userData.name,
            last_name: fullData.userData.lastname,
            email: fullData.sessionData.email,
            user_type: fullData.userData.userType,
            language: fullData.language,
            keep_informed: fullData.sessionData.informedCheck,

        }
        if (fullData.userData.userType === 'NATURAL') {
            bodyToSend.natural_person = {
                email: fullData.userData.email,
                country: fullData.userData.country,
                id_code: fullData.userData.ID
            }
        } else {
            bodyToSend.empresa = {
                name: fullData.userData.businessName,
                rif: fullData.userData.businessId,
                address: fullData.userData.address
            }
        }

        if (fullData.userData && fullData.userData.contact_mobile) {
            phoneNumbers.push({
                number: fullData.userData.contact_mobile,
                country_number: fullData.userData.country,
                ext: '',
                ptype: 'MOBILE'
            })
        }
        if (fullData.userData && fullData.userData.contact_phone) {
            phoneNumbers.push({
                number: fullData.userData.contact_mobile,
                country_number: fullData.userData.country,
                ext: fullData.userData['contact_phone-ext'],
                ptype: 'FIXED'
            })
        }
        bodyToSend.phoneNumbers = phoneNumbers
        bodyToSend.banks = bankData
        const response = await register(bodyToSend)
        if (response.message && response.message === 'success') {
            router.push('/login');
            toaster.push(succcessRegister, { placement: 'topEnd' });
            return
        }
        toaster.push(errorRegister, { placement: 'topEnd' })
    }

    const backToLogin = () => {
        router.push('/login')
    }

    return (
        <Grid fluid className="stepper">
            <Row gutter={24}>
                {
                    steps.map((step: any, index: number) => (
                        <Col key={index} md={8} sm={12} style={{ padding: 4 }}>
                            <Panel
                                key={index}
                                className='stepper-panel'
                                onClick={() => { backToStep(index) }}
                                style={actualStep >= index ? StepperStyles.selectedPanel : {}}
                                bordered>
                                <p style={actualStep === index ? StepperStyles.selectedText : { textAlign: 'center' }}>
                                    {index + 1} - {step.name}
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
            <Row>
                <Col md={24} style={{ textAlign: 'center' }}>
                    {
                        actualStep === 5 &&
                        <Button onClick={handleSubmitRegister} style={{ margin: 10 }} color="orange" appearance="primary">{translationButtons('register')}</Button>
                    }
                    <Button onClick={backToLogin} style={{ margin: 10 }} color="orange" appearance="primary">{translationButtons('cancel')}</Button>
                </Col>
            </Row>
        </Grid>
    );
}
