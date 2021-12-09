// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {RefObject} from 'react';
import {useIntl} from 'react-intl';

import {FloatingTextInputRef} from '@components/floating_text_input_label';
import {t} from '@i18n';

import Field from './field';

type EmailSettingsProps = {
    authService: string;
    email: string;
    fieldRef: RefObject<FloatingTextInputRef>;
    onChange: (fieldKey: string, value: string) => void;
    onFocusNextField: (fieldKey: string) => void;
    isDisabled: boolean;
    label: string;
}

const EmailField = ({
    authService,
    email,
    fieldRef,
    onChange,
    onFocusNextField,
    isDisabled,
    label,
}: EmailSettingsProps) => {
    const intl = useIntl();

    const services: Record<string, string> = {
        gitlab: 'GitLab',
        google: 'Google Apps',
        office365: 'Office 365',
        ldap: 'AD/LDAP',
        saml: 'SAML',
    };

    const service = services[authService];

    let defaultMessage: string;
    let id: string;

    if (service) {
        id = t('user.edit_profile.email.auth_service');
        defaultMessage = 'Login occurs through {service}. Email cannot be updated. Email address used for notifications is {email}.';
    } else {
        id = t('user.edit_profile.email.web_client');
        defaultMessage = 'Email must be updated using a web client or desktop application.';
    }

    return (
        <Field
            blurOnSubmit={false}
            enablesReturnKeyAutomatically={true}
            fieldDescription={intl.formatMessage({id, defaultMessage}, {email, service})}
            fieldKey='email'
            fieldRef={fieldRef}
            isDisabled={isDisabled}
            keyboardType='email-address'
            label={label}
            onFocusNextField={onFocusNextField}
            onTextChange={onChange}
            returnKeyType='next'
            testID='edit_profile.text_setting.email'
            value={email}
        />
    );
};

export default EmailField;
