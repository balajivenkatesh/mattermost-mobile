// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useMemo} from 'react';
import {Text, View} from 'react-native';

import {fetchProfilesInChannel} from '@actions/remote/user';
import FormattedText from '@components/formatted_text';
import {General} from '@constants';
import {useServerUrl} from '@context/server';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import IntroOptions from '../options';

import Group from './group';
import Member from './member';

import type ChannelModel from '@typings/database/models/servers/channel';
import type ChannelMembershipModel from '@typings/database/models/servers/channel_membership';

type Props = {
    channel: ChannelModel;
    currentUserId: string;
    members?: ChannelMembershipModel[];
    theme: Theme;
}

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    message: {
        color: theme.centerChannelColor,
        marginTop: 16,
        textAlign: 'center',
        ...typography('Body', 200, 'Regular'),
    },
    profilesContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: theme.centerChannelColor,
        marginTop: 16,
        textAlign: 'center',
        width: '100%',
        ...typography('Heading', 700, 'SemiBold'),
    },
}));

const DirectChannel = ({channel, currentUserId, members, theme}: Props) => {
    const serverUrl = useServerUrl();
    const styles = getStyleSheet(theme);

    useEffect(() => {
        const channelMembers = members?.filter((m) => m.userId !== currentUserId);
        if (!channelMembers?.length) {
            fetchProfilesInChannel(serverUrl, channel.id, currentUserId, false);
        }
    }, []);

    const message = useMemo(() => {
        if (channel.type === General.DM_CHANNEL) {
            return (
                <FormattedText
                    defaultMessage={'This is the start of your conversation with {teammate}. Messages and files shared here are not shown to anyone else.'}
                    id='intro.direct_message'
                    style={styles.message}
                    values={{teammate: channel.displayName}}
                />
            );
        }
        return (
            <FormattedText
                defaultMessage={'This is the start of your conversation with this group. Messages and files shared here are not shown to anyone else outside of the group.'}
                id='intro.group_message'
                style={styles.message}
            />
        );
    }, [channel.displayName, theme]);

    const profiles = useMemo(() => {
        const channelMembers = members?.filter((m) => m.userId !== currentUserId);
        if (!channelMembers?.length) {
            return null;
        }

        if (channel.type === General.DM_CHANNEL) {
            return (
                <Member
                    containerStyle={{height: 96}}
                    member={channelMembers[0]}
                    size={96}
                    theme={theme}
                />
            );
        }

        return (
            <Group
                theme={theme}
                userIds={channelMembers.map((cm) => cm.userId)}
            />
        );
    }, [members, theme]);

    return (
        <View style={{alignItems: 'center'}}>
            <View style={styles.profilesContainer}>
                {profiles}
            </View>
            <Text style={styles.title}>
                {channel.displayName}
            </Text>
            {message}
            <IntroOptions
                channelId={channel.id}
                header={true}
                favorite={true}
                people={false}
                theme={theme}
            />
        </View>
    );
};

export default DirectChannel;
