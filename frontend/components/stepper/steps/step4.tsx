import { useState } from 'react';
import { Form, Panel, FlexboxGrid, Col, Checkbox } from 'rsuite';
import { useTranslations } from 'next-intl';
import HaderSection from '../headerSection';

const requiredFields = ['email', 'password']
const mailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function Step4({
    handleBack,
    handleNext,
    stepTitle
}) {
    const [informedCheck, setInformedCheck] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const registerTralation = useTranslations('RegisterPage');

    const handleChangeInformedCheck = (e) => {
        setInformedCheck(e.target.checked);
    }
    const handleSubmitStep = () => {
        if (!validate()) {
            return
        }
        handleNext({
            sessionData: {
                informedCheck,
                ...formData
            }
        });

    }

    function validate() {
        const formatErros = {}
        requiredFields.forEach(field => {
            if (!formData[field]) {
                formatErros[field] = 'void'
            }
            if (field === 'email' && !mailRe.test(formData[field])) {
                formatErros[field] = 'void'
            }
        })

        setErrors(formatErros);
        if (Object.keys(formatErros).length > 0) {
            return false
        }
        return true
    }


    const handleChangeFormData = (value: any, field: string) => {
        setFormData({
            ...formData,
            [field]: value
        })
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
                <Form style={{ padding: 'auto' }}>
                    <FlexboxGrid justify='center'>
                        <Col md={8}>
                            <Form.Group controlId="email">
                                <Form.ControlLabel
                                    style={errors.email && errors.email === 'void' ? { color: 'red' } : {}}
                                >*{registerTralation('fourthStep.email')}</Form.ControlLabel>
                                <Form.Control onChange={e => { handleChangeFormData(e, 'email') }} type="text" name="email" required />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.ControlLabel
                                    style={errors.password && errors.password === 'void' ? { color: 'red' } : {}}
                                >*{registerTralation('fourthStep.password')}</Form.ControlLabel>
                                <Form.Control onChange={e => { handleChangeFormData(e, 'password') }} type="password" name="password" required />
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
