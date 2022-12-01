import { useEffect, useState, useCallback } from 'react';
import { Form, Panel, RadioGroup, Grid, Col, Radio, FlexboxGrid, Checkbox, Input, SelectPicker } from 'rsuite';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useTranslations } from 'next-intl';
import { Textarea } from 'components/form';
import { getCountries } from '../../../pages/api/location';
import HaderSection from '../headerSection';

const requiredFields = ['name', 'lastname', 'email', 'country'];
const requiredFieldsBussines = ['businessName', 'businessId', 'city', 'address']

const mailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function Step2({
    handleBack,
    handleNext,
    stepTitle
}) {
    const [userType, setUserType] = useState("NATURAL");
    const [phoneNumberState, setPhoneNumberState] = useState(false);
    const [mobileNumberState, setMobileNumberState] = useState(false);
    const [formData, setFormData] = useState({});
    const [countriesState, setCountriesState] = useState([]);
    const registerTralation = useTranslations('RegisterPage');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        initCountries()
    }, [])

    const initCountries = async () => {
        const countries = await getCountries();
        if (countries) setCountriesState(
            countries.map((country: any) => ({
                label: country.name,
                value: country.id,
            }))
        );
    }

    const handleChangeUserType = (e) => {
        setUserType(e);
    }
    const handleSubmitStep = () => {
        if (!validate()) {
            return
        }

        handleNext({
            userData: {
                ...formData,
                userType
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
        if (userType === 'NATURAL') {
            if (!formData.ID) {
                formatErros['ID'] = 'void'
            }
        } else {
            requiredFieldsBussines.forEach(field => {
                if (!formData[field]) {
                    formatErros[field] = 'void'
                }
            })
        }
        setErrors(formatErros);
        if (Object.keys(formatErros).length > 0) {
            return false
        }
        return true
    }

    function onChangePhone(_: any, checked: Boolean) {
        setPhoneNumberState(checked);
    }

    function onChangeMobile(_: any, checked: Boolean) {
        setMobileNumberState(checked);
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
                className="form-person"
                bordered
                style={{
                    marginTop: "1em"
                }}
            >
                <Form style={{ padding: 'auto' }}>
                    <Form.Group controlId="radioList">
                        <RadioGroup value={userType} name="radioList" inline onChange={handleChangeUserType}>
                            <Grid>
                                <Col md={8} style={{ padding: 8 }}> <p>{registerTralation('secondStep.header')}</p></Col>
                                <Col md={8} style={{ padding: 4 }}>
                                    <Radio value="NATURAL">{registerTralation('secondStep.natural')}</Radio>
                                </Col>
                                <Col md={8} style={{ padding: 4 }}>
                                    <Radio value="ENTERPRISE">{registerTralation('secondStep.business')}</Radio>
                                </Col>
                            </Grid>
                        </RadioGroup>
                    </Form.Group>
                    {
                        userType === "NATURAL" ?
                            <Grid>
                                <Col md={12}>
                                    <Form.Group controlId="name">
                                        <Form.ControlLabel
                                            style={errors.name && errors.name === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.name')}</Form.ControlLabel>
                                        <Form.Control onChange={e => { handleChangeFormData(e, 'name') }} type="text" name="name" required />
                                    </Form.Group>
                                    <Form.Group controlId="lastname">
                                        <Form.ControlLabel
                                            style={errors.lastname && errors.lastname === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.lastname')}</Form.ControlLabel>
                                        <Form.Control onChange={e => { handleChangeFormData(e, 'lastname') }} type="text" name="lastname" required />
                                    </Form.Group>
                                    <Form.Group controlId="ID">
                                        <Form.ControlLabel
                                            style={errors.ID && errors.ID === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.ID')}</Form.ControlLabel>
                                        <Form.Control onChange={e => { handleChangeFormData(e, 'ID') }} type="number" name="ID" required />
                                    </Form.Group>
                                    <Form.Group controlId="email">
                                        <Form.ControlLabel
                                            style={errors.email && errors.email === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.email')}</Form.ControlLabel>
                                        <Form.Control onChange={e => { handleChangeFormData(e, 'email') }} type="text" name="email" required />
                                    </Form.Group>
                                    <Form.Group controlId="country">
                                        <Form.ControlLabel
                                            style={errors.country && errors.country === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.country')}</Form.ControlLabel>
                                        <SelectPicker onChange={e => { handleChangeFormData(e, 'country') }} data={countriesState} style={{ width: 300 }} />

                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <FlexboxGrid>
                                        <Form.Group>
                                            <Checkbox onChange={onChangeMobile} inline>
                                                <span className="button button--yellow">{registerTralation('secondStep.mobile')}</span>
                                            </Checkbox>
                                        </Form.Group>
                                        <Form.Group>
                                            <Checkbox onChange={onChangePhone} inline>
                                                <span className="button button--yellow">{registerTralation('secondStep.landline')}</span>
                                            </Checkbox>
                                        </Form.Group>
                                    </FlexboxGrid>
                                    <section className='section-phones'>
                                        {
                                            phoneNumberState &&
                                            <div className='phone-number'>
                                                <FlexboxGrid>
                                                    <PhoneInput
                                                        specialLabel={"Phone"}
                                                        style={{ marginBottom: 16, flex: 1, marginRight: 16 }}
                                                        inputClass="phone-number-input"
                                                        onChange={(_value: any) =>
                                                            handleChangeFormData(_value, "contact_phone")
                                                        }
                                                    />
                                                    <Input
                                                        className="phone-text-input"
                                                        onChange={(_value: any) =>
                                                            handleChangeFormData(_value, "contact_phone-ext")
                                                        }
                                                    />
                                                </FlexboxGrid>
                                            </div>
                                        }

                                        <div className='mobile-number'>
                                            {
                                                mobileNumberState &&
                                                <PhoneInput
                                                    specialLabel={"Mobile"}
                                                    inputClass="phone-number-input"
                                                    onChange={(_value: any) =>
                                                        handleChangeFormData(_value, "contact_mobile")
                                                    }
                                                />
                                            }
                                        </div>
                                    </section>
                                </Col>
                            </Grid>
                            :
                            <Grid>
                                <Col md={12}>
                                    <h5>{registerTralation('secondStep.subheaderBusiness')}</h5>
                                    <Form.Group controlId="businessName">
                                        <Form.ControlLabel
                                            style={errors.businessName && errors.businessName === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.businessName')}</Form.ControlLabel>
                                        <Form.Control onChange={e => { handleChangeFormData(e, 'businessName') }} type="text" name="businessName" required />
                                    </Form.Group>
                                    <Form.Group controlId="businessId">
                                        <Form.ControlLabel
                                            style={errors.businessId && errors.businessId === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.businessId')}</Form.ControlLabel>
                                        <Form.Control onChange={e => { handleChangeFormData(e, 'businessId') }} type="text" name="businessId" required />
                                    </Form.Group>
                                    <Form.Group controlId="country">
                                        <Form.ControlLabel
                                            style={errors.country && errors.country === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.country')}</Form.ControlLabel>
                                        <SelectPicker onChange={e => { handleChangeFormData(e, 'country') }} data={countriesState} style={{ width: 300 }} />
                                    </Form.Group>
                                    <Form.Group controlId="city">
                                        <Form.ControlLabel
                                            style={errors.city && errors.city === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.city')}</Form.ControlLabel>
                                        <Form.Control onChange={e => { handleChangeFormData(e, 'city') }} type="text" name="city" required />
                                    </Form.Group>
                                    <Form.Group controlId="address">
                                        <Form.ControlLabel
                                            style={errors.address && errors.address === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.address')}</Form.ControlLabel>
                                        <Form.Control onChange={e => { handleChangeFormData(e, 'address') }} accepter={Textarea} type="text" name="message" required />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <h5>{registerTralation('secondStep.subheaderBusiness2')}</h5>
                                    <Form.Group controlId="name">
                                        <Form.ControlLabel
                                            style={errors.name && errors.name === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.name')}</Form.ControlLabel>
                                        <Form.Control onChange={e => { handleChangeFormData(e, 'name') }} type="email" name="name" required />
                                    </Form.Group>
                                    <Form.Group controlId="lastname">
                                        <Form.ControlLabel
                                            style={errors.lastname && errors.lastname === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.lastname')}</Form.ControlLabel>
                                        <Form.Control onChange={e => { handleChangeFormData(e, 'lastname') }} type="text" name="lastname" required />
                                    </Form.Group>
                                    <Form.Group controlId="email">
                                        <Form.ControlLabel
                                            style={errors.email && errors.email === 'void' ? { color: 'red' } : {}}
                                        >*{registerTralation('secondStep.email')}</Form.ControlLabel>
                                        <Form.Control onChange={e => { handleChangeFormData(e, 'email') }} type="text" name="email" required />
                                    </Form.Group>
                                    <FlexboxGrid>
                                        <Form.Group>
                                            <Checkbox onChange={onChangeMobile} inline>
                                                <span className="button button--yellow">{registerTralation('secondStep.mobile')}</span>
                                            </Checkbox>
                                        </Form.Group>
                                        <Form.Group>
                                            <Checkbox onChange={onChangePhone} inline>
                                                <span className="button button--yellow">{registerTralation('secondStep.landline')}</span>
                                            </Checkbox>
                                        </Form.Group>
                                    </FlexboxGrid>

                                    <section className='section-phones'>
                                        {
                                            phoneNumberState &&
                                            <div className='phone-number'>
                                                <FlexboxGrid>
                                                    <PhoneInput
                                                        specialLabel={"Phone"}
                                                        style={{ marginBottom: 16, flex: 1, marginRight: 16 }}
                                                        inputClass="phone-number-input"
                                                        onChange={(_value: any) =>
                                                            handleChangeFormData(_value, "contact_phone")
                                                        }
                                                    />
                                                    <Input
                                                        className="phone-text-input"
                                                        onChange={(_value: any) =>
                                                            handleChangeFormData(_value, "contact_phone-ext")
                                                        }
                                                    />
                                                </FlexboxGrid>
                                            </div>
                                        }

                                        <div className='mobile-number'>
                                            {
                                                mobileNumberState &&
                                                <PhoneInput
                                                    specialLabel={"Mobile"}
                                                    inputClass="phone-number-input"
                                                    onChange={(_value: any) =>
                                                        handleChangeFormData(_value, "contact_mobile")
                                                    }
                                                />
                                            }
                                        </div>
                                    </section>
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
