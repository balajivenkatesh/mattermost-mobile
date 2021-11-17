// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';

import {Client} from '@client/rest';
import CompassIcon from '@components/compass_icon';
import {useServerUrl} from '@context/server_url';
import {useTheme} from '@context/theme';
import useDidUpdate from '@hooks/did_update';
import NetworkManager from '@init/network_manager';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import UserProfileImage from '../image';

type ProfilePictureProps = {
    canUpdateProfilePicture: boolean;
    imageUri?: string;
    isProfileImageRemoved?: boolean;
    lastPictureUpdate: number;
    size?: number;
    testID?: string;
    userId: string;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 80,
        },
        camera: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.centerChannelBg,
            borderWidth: 1,
            borderColor: theme.centerChannelBg,
            borderRadius: 36 / 2,
            height: 36,
            width: 36,
        },
    };
});

const EditProfilePicture = ({
    canUpdateProfilePicture = false,
    imageUri,
    isProfileImageRemoved,
    lastPictureUpdate,
    size = 128,
    testID,
    userId,
}: ProfilePictureProps) => {
    const [pictureUrl, setPictureUrl] = useState<string|undefined>();
    const theme = useTheme();
    const serverUrl = useServerUrl();

    const styles = getStyleSheet(theme);
    let client: Client | undefined;

    try {
        client = NetworkManager.getClient(serverUrl);
    } catch {
        // does nothing
    }

    useEffect(() => {
        if (canUpdateProfilePicture && imageUri) {
            setPictureUrl(imageUri);
        }
    }, []);

    useDidUpdate(() => {
        setPictureUrl(undefined);
    }, [isProfileImageRemoved]);

    // can this replace the useEffect function above?
    useDidUpdate(() => {
        if (canUpdateProfilePicture && imageUri) {
            setPictureUrl(imageUri);
        }
    }, [canUpdateProfilePicture, imageUri]);

    useDidUpdate(() => {
        const url = userId && client ? client.getProfilePictureUrl(userId, lastPictureUpdate) : undefined;
        if (url !== pictureUrl && !canUpdateProfilePicture) {
            setPictureUrl(url);
        }
    }, [userId, lastPictureUpdate, canUpdateProfilePicture]);

    let source = null;

    if (pictureUrl) {
        let prefix = '';
        if (Platform.OS === 'android' &&
            !pictureUrl.startsWith('content://') &&
            !pictureUrl.startsWith('http://') &&
            !pictureUrl.startsWith('https://')
        ) {
            prefix = 'file://';
        }

        if (pictureUrl.includes('/api/')) {
            prefix = serverUrl;
        }

        source = {
            uri: `${prefix}${pictureUrl}`,
        };
    }

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: changeOpacity(theme.centerChannelColor, 0.08),
                    height: size,
                    width: size,
                },
            ]}
            testID={`${testID}.${userId}`}
        >
            <UserProfileImage
                imageUrl={pictureUrl}
                lastPictureUpdate={lastPictureUpdate}
                size={size}
                source={source || undefined}
                userId={userId}
            />
            <View
                style={styles.camera}
            >
                <CompassIcon
                    name='camera-outline'
                    size={22}
                    color={changeOpacity(theme.centerChannelColor, 0.6)}
                />
            </View>

        </View>
    );
};

export default EditProfilePicture;