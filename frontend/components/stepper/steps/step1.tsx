import { useState } from 'react';
import { Grid, Col, Radio, RadioGroup, Form, Panel, Checkbox, CheckboxGroup } from 'rsuite';
import { useTranslations } from 'next-intl';
import HaderSection from '../headerSection';
export default function Step1({
    handleBack,
    handleNext,
    stepTitle
}: any) {
    const [selectedWay, setSelectedWay] = useState();
    const [formData, setFormData] = useState({});
    const registerTralation = useTranslations('RegisterPage');
    const [errors, setErrors] = useState({})

    const handleChangeWay = (e: any) => {
        setSelectedWay(e);
    }
    const handleSubmitStep = () => {
        const validate = {}
        const socialMediasFormated = []
        if (!selectedWay) {
            validate['selectedWay'] = 'void'
        }
        if (selectedWay === 'socialMedias') {
            if (!formData.socialMedias) {
                validate['socialMedias'] = 'void'
            } else {
                for (let media in formData.socialMedias) {
                    if (formData.socialMedias[media]) {
                        socialMediasFormated.push(media)
                    }
                }
                if (socialMediasFormated.length === 0) {
                    validate['socialMedias'] = 'void'
                }
            }

        }
        if (selectedWay === 'others'){
            if(!formData.others || formData.others === ''){
                validate['others'] = 'void'
            }
        }
        setErrors(validate)
        if (Object.keys(validate).length > 0) {
            return
        }
        handleNext({
            howKnewAboutUs: {
                ...formData,
                selectedWay
            }
        });
    }

    const handleChangeFormData = (value: any, field: string) => {
        setFormData({
            ...formData,
            [field]: value
        })
    }

    const handleCheckSocialMedia = (value: any, field: string) => {
        setFormData({
            ...formData,
            socialMedias: {
                ...formData.socialMedias,
                [field]: value
            }
        })
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
                header={
                    <p
                        style={errors.selectedWay && errors.selectedWay === 'void' ? { color: 'red' } : {}}
                    >
                        * {registerTralation('firstStep.header')}
                    </p>
                }
                bordered
                style={{
                    marginTop: "1em"
                }}
            >
                <Form>
                    <Form.Group controlId="radioList">
                        <RadioGroup name="radioList" inline onChange={handleChangeWay}>
                            <Grid>
                                <Col md={6} style={{ padding: 4 }}>
                                    <Radio value="webPortal">{registerTralation('firstStep.webPortal')}</Radio>
                                </Col>
                                <Col md={6} style={{ padding: 4 }}>
                                    <Radio value="socialMedias">{registerTralation('firstStep.socialMedias')}</Radio>
                                </Col>
                                <Col md={6} style={{ padding: 4 }}>
                                    <Radio value="friends">{registerTralation('firstStep.friends')}</Radio>
                                </Col>
                                <Col md={6} style={{ padding: 4 }}>
                                    <Radio value="others">{registerTralation('firstStep.others')}</Radio>
                                </Col>
                            </Grid>
                        </RadioGroup>
                    </Form.Group>

                    {
                        selectedWay === 'socialMedias' ?
                            <CheckboxGroup name="checkboxList"
                                style={{
                                    width: '25%',
                                    margin: 'auto'
                                }}>
                                <p
                                    style={errors.socialMedias && errors.socialMedias === 'void' ? { color: 'red' } : {}}
                                >*{registerTralation('firstStep.selectOptions')}</p>
                                <Checkbox value="facebook" onChangeCapture={e => { handleCheckSocialMedia(e.target.checked, 'facebook') }}>Facebook</Checkbox>
                                <Checkbox value="twitter" onChangeCapture={e => { handleCheckSocialMedia(e.target.checked, 'twitter') }}>Twitter</Checkbox>
                                <Checkbox value="instagram" onChangeCapture={e => { handleCheckSocialMedia(e.target.checked, 'instagram') }}>Instagram</Checkbox>
                            </CheckboxGroup>
                            :
                            selectedWay === 'others' ?
                                <Form.Group
                                    style={{
                                        width: '25%',
                                        margin: 'auto'
                                    }}
                                    controlId="group_others"
                                >
                                    <Form.ControlLabel
                                        style={errors.others && errors.others === 'void' ? { color: 'red' } : {}}
                                    >
                                        *{registerTralation('firstStep.tagOthers')}
                                    </Form.ControlLabel>
                                    <Form.Control type="text" name="others" required onChange={e => { handleChangeFormData(e, 'others') }} />
                                </Form.Group>
                                :
                                <></>
                    }
                </Form>
            </Panel>
        </>
    );
}
