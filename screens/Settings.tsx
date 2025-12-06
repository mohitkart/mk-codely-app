import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Image,
    SafeAreaView,
    Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeScreenProp } from '../navigation/AppNavigator';
import { getUserStorage } from '../utills/storage';

const SettingsScreen = () => {
    const user=getUserStorage()
    const navigation = useNavigation<NativeScreenProp>();

    // State for toggles
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [autoSync, setAutoSync] = useState(true);
    const [biometricLogin, setBiometricLogin] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // App settings sections
    const settingsSections = [
        {
            title: 'ACCOUNT',
            items: [
                {
                    icon: require('../assets/img/editProfile.png'),
                    label: 'Edit Profile',
                    color: '#4361EE',
                    onPress: () => navigation.navigate('EditProfile'),
                },
                {
                    icon: require('../assets/img/shield.png'),
                    label: 'Privacy & Security',
                    color: '#34C759',
                    onPress: () => {

                    },
                },
            ],
        },
        {
            title: 'PREFERENCES',
            items: [
                {
                    icon: 'dark-mode',
                    label: 'Dark Mode',
                    color: '#1A1A2E',
                    type: 'switch',
                    value: isDarkMode,
                    onValueChange: setIsDarkMode,
                },
                {
                    icon: 'notifications',
                    label: 'Push Notifications',
                    color: '#FF9500',
                    type: 'switch',
                    value: notifications,
                    onValueChange: setNotifications,
                },
                {
                    icon: 'sync',
                    label: 'Auto Sync',
                    color: '#34C759',
                    type: 'switch',
                    value: autoSync,
                    onValueChange: setAutoSync,
                },
                {
                    icon: 'fingerprint',
                    label: 'Biometric Login',
                    color: '#FF3B30',
                    type: 'switch',
                    value: biometricLogin,
                    onValueChange: setBiometricLogin,
                },
            ],
        },
        {
            title: 'SUPPORT',
            items: [
                {
                    icon: 'help',
                    label: 'Help Center',
                    color: '#5856D6',
                    onPress: () => {

                    },
                },
                {
                    icon: 'contact-support',
                    label: 'Contact Us',
                    color: '#64D2FF',
                    onPress: () => {

                    },
                },
                {
                    icon: 'info',
                    label: 'About MK Codely',
                    color: '#32D74B',
                    onPress: () => {

                    },
                },
                {
                    icon: 'rate-review',
                    label: 'Rate App',
                    color: '#FFD60A',
                    onPress: () => {

                    },
                },
                {
                    icon: 'share',
                    label: 'Share App',
                    color: '#30B0C7',
                    onPress: () => {

                    },
                },
            ],
        },
    ];

    // Handle logout
    const handleLogout = () => {
        setShowLogoutModal(false);
        // Implement actual logout logic here
        // For example: AsyncStorage.clear(), navigation to login, etc.
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    // Handle logout confirmation
    const confirmLogout = () => {
        setShowLogoutModal(true);
    };

    // Render settings item
    const renderSettingsItem = (item: any, index: number) => {
        return (
            <TouchableOpacity
                key={index}
                style={styles.settingsItem}
                onPress={item.onPress}
                disabled={item.type === 'switch'}
            >
                <View style={styles.settingsItemLeft}>
                    <View style={[styles.settingsIcon, { backgroundColor: `${item.color}15` }]}>
                        <Image
                        source={item.icon}
                        style={{ objectFit: 'contain' }}
                        height={22}
                        width={22}
                    />
                    </View>
                    <Text style={styles.settingsLabel}>{item.label}</Text>
                </View>

                <View style={styles.settingsItemRight}>
                    {item.type === 'switch' ? (
                        <Switch
                            value={item.value}
                            onValueChange={item.onValueChange}
                            trackColor={{ false: '#E9ECEF', true: item.color }}
                            thumbColor="#fff"
                            ios_backgroundColor="#E9ECEF"
                        />
                    ) : item.value ? (
                        <>
                            <Text style={styles.settingsValue}>{item.value}</Text>
                            <Image
                                source={require('../assets/img/rightArrow.png')}
                                style={{ objectFit: 'contain' }}
                                height={20}
                                width={20}
                            />
                        </>
                    ) : (
                        <Image
                            source={require('../assets/img/rightArrow.png')}
                            style={{ objectFit: 'contain' }}
                            height={20}
                            width={20}
                        />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.replace('Home')}
                >
                    <Image
                        source={require('../assets/img/leftArrow.png')}
                        style={{ objectFit: 'contain' }}
                        height={20}
                        width={20}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <Image
                        // source={{ uri: 'https://via.placeholder.com/100' }}
                        source={require('../assets/img/profile-a.png')}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user.name}</Text>
                        <Text style={styles.profileEmail}>{user.email}</Text>
                        <View style={styles.profileBadge}>
                            <Image
                                source={require('../assets/img/verified.png')}
                                style={{ objectFit: 'contain' }}
                                height={14}
                                width={14}
                            />
                            <Text style={styles.profileBadgeText}>Pro Member</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.editProfileButton}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Image
                            source={require('../assets/img/edit.png')}
                            style={{ objectFit: 'contain' }}
                            height={18}
                            width={18}
                        />
                    </TouchableOpacity>
                </View>

                {/* Settings Sections */}
                {settingsSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.sectionContent}>
                            {section.items.map((item, itemIndex) => renderSettingsItem(item, itemIndex))}
                        </View>
                    </View>
                ))}

                {/* Storage Info */}
                <View style={styles.storageCard}>
                    <View style={styles.storageHeader}>
                        <Image
                            source={require('../assets/img/storage.png')}
                            style={{ objectFit: 'contain' }}
                            height={24}
                            width={24}
                        />
                        <Text style={styles.storageTitle}>Storage</Text>
                    </View>
                    <View style={styles.storageProgress}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '65%' }]} />
                        </View>
                        <View style={styles.storageInfo}>
                            <Text style={styles.storageText}>12.4 GB of 20 GB used</Text>
                            <Text style={styles.storagePercent}>65%</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.manageStorageButton}>
                        <Text style={styles.manageStorageText}>Manage Storage</Text>
                    </TouchableOpacity>
                </View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appVersion}>MK Codely v1.0.2</Text>
                    <Text style={styles.appBuild}>Build 2024.12.05</Text>
                    <Text style={styles.appCopyright}>© 2024 MK Codely. All rights reserved.</Text>
                </View>

                {/* Spacer for logout button */}
                <View style={styles.spacer} />
            </ScrollView>

            {/* Logout Button (Fixed at bottom) */}
            <View style={styles.logoutContainer}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={confirmLogout}
                >
                    <Image
                        source={require('../assets/img/Logout.png')}
                        style={{ objectFit: 'contain' }}
                        height={20}
                        width={20}
                    />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>

            {/* Logout Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showLogoutModal}
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIcon}>
                            <Image
                                source={require('../assets/img/Logout.png')}
                                style={{ objectFit: 'contain' }}
                                height={48}
                                width={48}
                            />
                        </View>
                        <Text style={styles.modalTitle}>Log Out</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to log out? You'll need to sign in again to access your account.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleLogout}
                            >
                                <Text style={styles.confirmButtonText}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A2E',
    },
    headerRight: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100, // Space for fixed logout button
    },
    profileCard: {
        backgroundColor: '#fff',
        margin: 20,
        marginTop: 24,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#F0F4FF',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 16,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A2E',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    profileBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6F7ED',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    profileBadgeText: {
        fontSize: 12,
        color: '#34C759',
        fontWeight: '600',
        marginLeft: 4,
    },
    editProfileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F4FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginTop: 8,
        marginHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#999',
        textTransform: 'uppercase',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    sectionContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F9FA',
    },
    settingsItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingsIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingsLabel: {
        fontSize: 16,
        color: '#1A1A2E',
        fontWeight: '500',
    },
    settingsItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsValue: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    storageCard: {
        backgroundColor: '#fff',
        margin: 20,
        marginTop: 24,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    storageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    storageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A2E',
        marginLeft: 12,
    },
    storageProgress: {
        marginBottom: 20,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#F0F4FF',
        borderRadius: 4,
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4361EE',
        borderRadius: 4,
    },
    storageInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    storageText: {
        fontSize: 14,
        color: '#666',
    },
    storagePercent: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4361EE',
    },
    manageStorageButton: {
        backgroundColor: '#F0F4FF',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    manageStorageText: {
        color: '#4361EE',
        fontSize: 16,
        fontWeight: '600',
    },
    appInfo: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    appVersion: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    appBuild: {
        fontSize: 12,
        color: '#999',
        marginBottom: 12,
    },
    appCopyright: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        lineHeight: 18,
    },
    spacer: {
        height: 40,
    },
    logoutContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF5F5',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFE2E2',
    },
    logoutText: {
        color: '#FF4757',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    modalIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A1A2E',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        backgroundColor: '#FF4757',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SettingsScreen;