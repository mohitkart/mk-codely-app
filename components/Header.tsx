import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import { View, StyleSheet, Animated, TouchableOpacity, Image, Text, ScrollView, Linking } from "react-native";
import { NativeScreenProp } from "../navigation/AppNavigator";
import environment from "../environment";
import { getUserStorage } from "../utills/storage";

const Header = () => {
    const user = getUserStorage()
    const navigation = useNavigation<NativeScreenProp>();
    const scrollY = useRef(new Animated.Value(0)).current;

    // Header animation
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [180, 100],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
    });

    const quickLinks = [
        {
            name: 'Blogs', icon: require(`../assets/img/article-a.png`), action: () => {
                Linking.openURL(`${environment.frontend}blog`)
            }
        },
        { name: 'Tasks', icon: require(`../assets/img/task.png`), screen: 'Tasks' },
        { name: 'Music', icon: require(`../assets/img/music.png`), screen: 'Music' },
        {
            name: 'Chat', icon: require(`../assets/img/chat.png`), action: () => {
                Linking.openURL(`${environment.frontend}chat`)
            }
        },
        { name: 'Expenses', icon: require(`../assets/img/expense.png`), screen: 'Expenses' },
        { name: 'Recording', icon: require(`../assets/img/recording.png`), screen: 'ScreenRecording' },
    ];

    const renderQuickLink = (link: any, index: number) => (
        <TouchableOpacity
            key={index}
            style={styles.quickLink}
            onPress={() => {
                if (link.screen) {
                    navigation.navigate(link.screen);
                } else if (link.action) {
                    link.action()
                }
            }}
        >
            <View style={styles.quickLinkIcon}>
                <Image
                    source={link.icon}
                    style={{ objectFit: 'contain' }}
                    height={24}
                    width={24}
                />
            </View>
            <Text style={styles.quickLinkText}>{link.name}</Text>
        </TouchableOpacity>
    );

    return (
        <Animated.View style={[
            styles.header,
            {
                height: headerHeight,
                opacity: headerOpacity,
            }
        ]}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                {user ? <View
                    style={styles.profileButton}
                >
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                        }}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Image
                            // source={{ uri: 'https://via.placeholder.com/50' }}
                            source={require('../assets/img/profile-a.png')}
                            style={styles.profileImage}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{user.name}</Text>
                            <Text style={styles.profileEmail}>{user.email}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{

                        }}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Image
                            source={require('../assets/img/Logout.png')}
                            style={{ objectFit: 'contain' }}
                            height={20}
                            width={20}
                        />
                    </TouchableOpacity>

                </View> : <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Image
                        source={require('../assets/img/login.png')}
                        style={styles.profileImage}
                    />
                    <Image
                        source={require('../assets/img/rightArrow.png')}
                        style={{ objectFit: 'contain' }}
                        height={20}
                        width={20}
                    />
                </TouchableOpacity>}

                {/* Notification & Settings */}
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Image
                            source={require('../assets/img/notification.png')}
                            style={{ objectFit: 'contain' }}
                            height={24}
                            width={24}
                        />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}
                        onPress={() => navigation.replace('Settings')}
                    >
                        <Image
                            source={require('../assets/img/settings.png')}
                            style={{ objectFit: 'contain' }}
                            height={24}
                            width={24}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Quick Links */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.quickLinksContainer}
            >
                {quickLinks.map(renderQuickLink)}
            </ScrollView>
        </Animated.View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E6F0FF',
    },
    profileInfo: {
        marginLeft: 12,
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A2E',
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    actionButton: {
        marginLeft: 16,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF4757',
    },
    quickLinksContainer: {
        flexGrow: 0,
        marginBottom: 10,
    },
    quickLink: {
        alignItems: 'center',
        marginRight: 20,
    },
    quickLinkIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    quickLinkText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
});
