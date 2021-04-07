// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
} from 'react-native';

import CompassIcon from '@components/compass_icon';
import CustomPropTypes from '@constants/custom_prop_types';

export default class MarkdownBlockQuote extends PureComponent {
    static propTypes = {
        continue: PropTypes.bool,
        iconStyle: CustomPropTypes.Style,
        children: CustomPropTypes.Children,
    };

    render() {
        let icon;
        if (!this.props.continue) {
            icon = (
                <CompassIcon
                    name='format-quote-open'
                    style={this.props.iconStyle}
                    size={20}
                />
            );
        }

        return (
            <View style={style.container}>
                <View style={style.icon}>
                    {icon}
                </View>
                <View style={style.childContainer}>
                    {this.props.children}
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    childContainer: {
        flex: 1,
    },
    icon: {
        width: 23,
    },
});