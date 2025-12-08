import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Image,
    Alert,
    Switch,
    Animated,
    Dimensions,
    Modal,
    Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeModules } from "react-native";
const { ScreenRecorder } = NativeModules;


const { height } = Dimensions.get('window');

const ScreenRecordingScreen = () => {
    const navigation = useNavigation();

    // Recording States
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordingProgress, setRecordingProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Settings States
    const [withAudio, setWithAudio] = useState(true);
    const [showTouch, setShowTouch] = useState(true);
    const [recordCamera, setRecordCamera] = useState(false);
    const [showTimer, setShowTimer] = useState(true);
    const [quality, setQuality] = useState('hd'); // hd, fullhd, 4k
    const [frameRate, setFrameRate] = useState(30); // 30, 60

    // Recording Sessions
    const [recordings, setRecordings] = useState([
        {
            id: '1',
            title: 'App Demo Recording',
            duration: '2:45',
            size: '45 MB',
            date: 'Today, 10:30 AM',
            thumbnail: 'https://via.placeholder.com/150',
            resolution: '1080p',
            favorite: true,
        },
        {
            id: '2',
            title: 'Bug Reproduction',
            duration: '1:15',
            size: '22 MB',
            date: 'Yesterday, 3:45 PM',
            thumbnail: 'https://via.placeholder.com/150',
            resolution: '720p',
            favorite: false,
        },
        {
            id: '3',
            title: 'Feature Tutorial',
            duration: '5:30',
            size: '120 MB',
            date: 'Dec 3, 2024',
            thumbnail: 'https://via.placeholder.com/150',
            resolution: '1080p',
            favorite: true,
        },
    ]);

    // Modal States
    const [showSettings, setShowSettings] = useState(false);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [showRecordingOptions, setShowRecordingOptions] = useState(false);

    // Animations
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const recordingBarHeight = useRef(new Animated.Value(0)).current;

    // Timer for recording
    useEffect(() => {
        let timer: any;
        if (isRecording && !isPaused) {
            timer = setInterval(() => {
                setRecordingTime(prev => {
                    const newTime = prev + 1;
                    setRecordingProgress((newTime % 100) / 100);
                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRecording, isPaused]);

    // Pulse animation for recording button
    useEffect(() => {
        if (isRecording && !isPaused) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRecording, isPaused]);

    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Start recording
    const startRecording =async () => {
        setIsRecording(true);
        setRecordingTime(0);
        setRecordingProgress(0);
        setIsPaused(false);

        Animated.timing(recordingBarHeight, {
            toValue: 60,
            duration: 300,
            useNativeDriver: false,
        }).start();

        try {
            const res = await ScreenRecorder.startRecording();
            console.log("start recording 22", res);
            const path=res
            Linking.openURL("file://" + path);
        } catch (e) {
            console.log("Error:", e);
        }


        // Simulate recording start
        Alert.alert(
            'Recording Started',
            'Screen recording has started. You can minimize the app and the recording will continue.',
            [{ text: 'OK' }]
        );
    };

    // Pause/Resume recording
    const togglePause = async () => {
        setIsPaused(!isPaused);
        if (!isPaused) {
            Alert.alert('Recording Paused', 'Recording has been paused.');
            try {
                const res = await ScreenRecorder.pauseRecording();
                console.log("start pauseRecording", res);
            } catch (e) {
                console.log("Error:", e);
            }

        } else {
            try {
                const res = await ScreenRecorder.resumeRecording();
                console.log("start resumeRecording", res);
            } catch (e) {
                console.log("Error:", e);
            }
            Alert.alert('Recording Resumed', 'Recording has been resumed.');
        }
    };

    // Stop recording
    const stopRecording = () => {
        Alert.alert(
            'Stop Recording',
            'Are you sure you want to stop recording?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Stop',
                    style: 'destructive',
                    onPress: async () => {
                        setIsRecording(false);
                        setIsPaused(false);
                        setRecordingTime(0);
                        setRecordingProgress(0);

                        Animated.timing(recordingBarHeight, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: false,
                        }).start();


                        const res = await ScreenRecorder.stopRecording();
                        console.log("recording res",res);

                        // Add new recording to list
                        const newRecording = {
                            id: Date.now().toString(),
                            title: `Recording ${recordings.length + 1}`,
                            duration: formatTime(recordingTime),
                            size: `${Math.floor(recordingTime * 0.5)} MB`,
                            date: 'Just now',
                            thumbnail: 'https://via.placeholder.com/150',
                            resolution: quality === 'hd' ? '720p' : quality === 'fullhd' ? '1080p' : '4K',
                            favorite: false,
                        };

                        setRecordings([newRecording, ...recordings]);
                        Alert.alert('Recording Saved', 'Your screen recording has been saved successfully.');
                    },
                },
            ]
        );
    };

    // Delete recording
    const deleteRecording = (id: any) => {
        Alert.alert(
            'Delete Recording',
            'Are you sure you want to delete this recording? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setRecordings(recordings.filter(rec => rec.id !== id));
                    },
                },
            ]
        );
    };

    // Toggle favorite
    const toggleFavorite = (id: any) => {
        setRecordings(recordings.map(rec =>
            rec.id === id ? { ...rec, favorite: !rec.favorite } : rec
        ));
    };

    // Start recording with options
    const startRecordingWithOptions = () => {
        setShowRecordingOptions(false);
        setTimeout(() => {
            setShowRecordModal(true);
        }, 300);
    };

    // Recording Options Modal
    const renderRecordingOptions = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showRecordingOptions}
            onRequestClose={() => setShowRecordingOptions(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.recordingOptionsModal}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Recording Options</Text>
                        <TouchableOpacity onPress={() => setShowRecordingOptions(false)}>
                            <Image
                                source={require('../assets/img/close.png')}
                                style={{ objectFit: 'contain' }}
                                height={24}
                                width={24}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.optionItem}>
                        <View style={styles.optionLeft}>
                            <Image
                                source={require('../assets/img/mic.png')}
                                style={{ objectFit: 'contain' }}
                                height={24}
                                width={24}
                            />
                            <Text style={styles.optionLabel}>Record Audio</Text>
                        </View>
                        <Switch
                            value={withAudio}
                            onValueChange={setWithAudio}
                            trackColor={{ false: '#E9ECEF', true: '#4361EE' }}
                        />
                    </View>

                    <View style={styles.optionItem}>
                        <View style={styles.optionLeft}>
                            <Image
                                source={require('../assets/img/touch.png')}
                                style={{ objectFit: 'contain' }}
                                height={24}
                                width={24}
                            />
                            <Text style={styles.optionLabel}>Show Touch Gestures</Text>
                        </View>
                        <Switch
                            value={showTouch}
                            onValueChange={setShowTouch}
                            trackColor={{ false: '#E9ECEF', true: '#4361EE' }}
                        />
                    </View>

                    <View style={styles.optionItem}>
                        <View style={styles.optionLeft}>
                            <Image
                                source={require('../assets/img/videocam.png')}
                                style={{ objectFit: 'contain' }}
                                height={24}
                                width={24}
                            />
                            <Text style={styles.optionLabel}>Include Camera</Text>
                        </View>
                        <Switch
                            value={recordCamera}
                            onValueChange={setRecordCamera}
                            trackColor={{ false: '#E9ECEF', true: '#4361EE' }}
                        />
                    </View>

                    <View style={styles.optionItem}>
                        <Text style={styles.optionLabel}>Quality</Text>
                        <View style={styles.qualityOptions}>
                            {['hd', 'fullhd', '4k'].map((q) => (
                                <TouchableOpacity
                                    key={q}
                                    style={[
                                        styles.qualityOption,
                                        quality === q && styles.qualityOptionActive,
                                    ]}
                                    onPress={() => setQuality(q)}
                                >
                                    <Text style={[
                                        styles.qualityOptionText,
                                        quality === q && styles.qualityOptionTextActive,
                                    ]}>
                                        {q === 'hd' ? 'HD (720p)' : q === 'fullhd' ? 'Full HD (1080p)' : '4K'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.optionItem}>
                        <Text style={styles.optionLabel}>Frame Rate</Text>
                        <View style={styles.frameRateOptions}>
                            {[30, 60].map((rate) => (
                                <TouchableOpacity
                                    key={rate}
                                    style={[
                                        styles.frameRateOption,
                                        frameRate === rate && styles.frameRateOptionActive,
                                    ]}
                                    onPress={() => setFrameRate(rate)}
                                >
                                    <Text style={[
                                        styles.frameRateOptionText,
                                        frameRate === rate && styles.frameRateOptionTextActive,
                                    ]}>
                                        {rate} FPS
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.startRecordingButton}
                        onPress={startRecordingWithOptions}
                    >
                        <Image
                            source={require('../assets/img/videocam.png')}
                            style={{ objectFit: 'contain' }}
                            height={24}
                            width={24}
                        />
                        <Text style={styles.startRecordingText}>Start Recording</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    // Recording Started Modal
    const renderRecordingModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showRecordModal}
            onRequestClose={() => setShowRecordModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.recordingModal}>
                    <View style={styles.recordingIndicator}>
                        <Animated.View
                            style={[
                                styles.recordingDot,
                                { transform: [{ scale: pulseAnim }] }
                            ]}
                        />
                        <Text style={styles.recordingText}>RECORDING</Text>
                    </View>

                    <Text style={styles.recordingTimer}>{formatTime(recordingTime)}</Text>

                    <View style={styles.recordingControls}>
                        <TouchableOpacity
                            style={styles.controlButton}
                            onPress={togglePause}
                        >
                            {isPaused ? <>
                                <Image
                                    source={require('../assets/img/play.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={28}
                                    width={28}
                                />
                            </> : <>
                                <Image
                                    source={require('../assets/img/pause.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={28}
                                    width={28}
                                />
                            </>}
                            <Text style={styles.controlText}>
                                {isPaused ? 'Resume' : 'Pause'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.controlButton, styles.stopButton]}
                            onPress={stopRecording}
                        >
                            <Image
                                source={require('../assets/img/stop.png')}
                                style={{ objectFit: 'contain' }}
                                height={28}
                                width={28}
                            />
                            <Text style={styles.controlText}>Stop</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.recordingInfo}>
                        <Text style={styles.infoText}>
                            • Recording with {withAudio ? 'audio' : 'no audio'}
                        </Text>
                        <Text style={styles.infoText}>
                            • Quality: {quality === 'hd' ? '720p' : quality === 'fullhd' ? '1080p' : '4K'}
                        </Text>
                        <Text style={styles.infoText}>
                            • {showTouch ? 'Touch gestures visible' : 'Touch gestures hidden'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.minimizeButton}
                        onPress={() => setShowRecordModal(false)}
                    >
                        <Image
                            source={require('../assets/img/arrrow-down.png')}
                            style={{ objectFit: 'contain' }}
                            height={28}
                            width={28}
                        />
                        <Text style={styles.minimizeText}>Minimize</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    // Settings Modal
    const renderSettingsModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showSettings}
            onRequestClose={() => setShowSettings(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.settingsModal}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Recording Settings</Text>
                        <TouchableOpacity onPress={() => setShowSettings(false)}>
                            <Image
                                source={require('../assets/img/close.png')}
                                style={{ objectFit: 'contain' }}
                                height={24}
                                width={24}
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.settingsList}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Image
                                    source={require('../assets/img/mic.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={24}
                                    width={24}
                                />
                                <View>
                                    <Text style={styles.settingLabel}>Record Audio</Text>
                                    <Text style={styles.settingDescription}>Include microphone audio in recordings</Text>
                                </View>
                            </View>
                            <Switch
                                value={withAudio}
                                onValueChange={setWithAudio}
                                trackColor={{ false: '#E9ECEF', true: '#4361EE' }}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Image
                                    source={require('../assets/img/touch.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={24}
                                    width={24}
                                />
                                <View>
                                    <Text style={styles.settingLabel}>Show Touch Gestures</Text>
                                    <Text style={styles.settingDescription}>Display touch interactions on screen</Text>
                                </View>
                            </View>
                            <Switch
                                value={showTouch}
                                onValueChange={setShowTouch}
                                trackColor={{ false: '#E9ECEF', true: '#4361EE' }}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Image
                                    source={require('../assets/img/timer.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={24}
                                    width={24}
                                />
                                <View>
                                    <Text style={styles.settingLabel}>Show Recording Timer</Text>
                                    <Text style={styles.settingDescription}>Display timer overlay while recording</Text>
                                </View>
                            </View>
                            <Switch
                                value={showTimer}
                                onValueChange={setShowTimer}
                                trackColor={{ false: '#E9ECEF', true: '#4361EE' }}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Image
                                    source={require('../assets/img/storage.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={24}
                                    width={24}
                                />
                                <View>
                                    <Text style={styles.settingLabel}>Default Quality</Text>
                                    <Text style={styles.settingDescription}>Video quality for new recordings</Text>
                                </View>
                            </View>
                            <View style={styles.qualitySelector}>
                                {['hd', 'fullhd', '4k'].map((q) => (
                                    <TouchableOpacity
                                        key={q}
                                        style={[
                                            styles.qualityOptionSmall,
                                            quality === q && styles.qualityOptionSmallActive,
                                        ]}
                                        onPress={() => setQuality(q)}
                                    >
                                        <Text style={[
                                            styles.qualityOptionSmallText,
                                            quality === q && styles.qualityOptionSmallTextActive,
                                        ]}>
                                            {q.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Image
                                    source={require('../assets/img/speed.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={24}
                                    width={24}
                                />
                                <View>
                                    <Text style={styles.settingLabel}>Frame Rate</Text>
                                    <Text style={styles.settingDescription}>Frames per second</Text>
                                </View>
                            </View>
                            <View style={styles.frameRateSelector}>
                                {[30, 60].map((rate) => (
                                    <TouchableOpacity
                                        key={rate}
                                        style={[
                                            styles.frameRateOptionSmall,
                                            frameRate === rate && styles.frameRateOptionSmallActive,
                                        ]}
                                        onPress={() => setFrameRate(rate)}
                                    >
                                        <Text style={[
                                            styles.frameRateOptionSmallText,
                                            frameRate === rate && styles.frameRateOptionSmallTextActive,
                                        ]}>
                                            {rate}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Image
                                    source={require('../assets/img/folder.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={24}
                                    width={24}
                                />
                                <View>
                                    <Text style={styles.settingLabel}>Save Location</Text>
                                    <Text style={styles.settingDescription}>Internal Storage/Recordings</Text>
                                </View>
                            </View>
                            <Image
                                source={require('../assets/img/rightArrow.png')}
                                style={{ objectFit: 'contain' }}
                                height={24}
                                width={24}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <Image
                                    source={require('../assets/img/notification.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={24}
                                    width={24}
                                />
                                <View>
                                    <Text style={styles.settingLabel}>Recording Notifications</Text>
                                    <Text style={styles.settingDescription}>Show notifications when recording</Text>
                                </View>
                            </View>
                            <Switch
                                value={true}
                                trackColor={{ false: '#E9ECEF', true: '#4361EE' }}
                            />
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.saveSettingsButton}
                        onPress={() => setShowSettings(false)}
                    >
                        <Text style={styles.saveSettingsText}>Save Settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={require('../assets/img/leftArrow.png')}
                        style={{ objectFit: 'contain' }}
                        height={24}
                        width={24}
                    />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Image
                        source={require('../assets/img/videocam.png')}
                        style={{ objectFit: 'contain' }}
                        height={28}
                        width={28}
                    />
                    <Text style={styles.headerTitle}>Screen Recording</Text>
                </View>

                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => setShowSettings(true)}
                >
                    <Image
                        source={require('../assets/img/settings.png')}
                        style={{ objectFit: 'contain' }}
                        height={24}
                        width={24}
                    />
                </TouchableOpacity>
            </View>

            {/* Recording Control Bar */}
            <Animated.View style={[styles.recordingBar, { height: recordingBarHeight }]}>
                {isRecording && (
                    <View style={styles.recordingBarContent}>
                        <View style={styles.recordingStatus}>
                            <View style={styles.recordingIndicatorSmall}>
                                <Animated.View
                                    style={[
                                        styles.recordingDotSmall,
                                        { transform: [{ scale: pulseAnim }] }
                                    ]}
                                />
                            </View>
                            <Text style={styles.recordingStatusText}>
                                Recording • {formatTime(recordingTime)}
                            </Text>
                        </View>

                        <View style={styles.recordingBarControls}>
                            <TouchableOpacity
                                style={styles.recordingBarButton}
                                onPress={togglePause}
                            >

                                {isPaused ? <Image
                                    source={require('../assets/img/play.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={20}
                                    width={20}
                                /> : <Image
                                    source={require('../assets/img/pause.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={20}
                                    width={20}
                                />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.recordingBarButton, styles.stopButtonSmall]}
                                onPress={stopRecording}
                            >
                                <Image
                                    source={require('../assets/img/stop.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={20}
                                    width={20}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Animated.View>

            {/* Main Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {/* Recording Preview */}
                <View style={styles.previewSection}>
                    <Text style={styles.sectionTitle}>Start Recording</Text>

                <Text>recordingProgress : {recordingProgress}</Text>
                    <View style={styles.previewContainer}>
                        <View style={styles.previewPlaceholder}>
                            <Image
                                source={require('../assets/img/smartphone.png')}
                                style={{ objectFit: 'contain' }}
                                height={80}
                                width={80}
                            />
                            <Text style={styles.previewText}>Screen preview will appear here</Text>
                        </View>

                        <View style={styles.recordingStats}>
                            <View style={styles.statItem}>
                                <Image
                                    source={require('../assets/img/quality.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={20}
                                    width={20}
                                />
                                <Text style={styles.statText}>
                                    {quality === 'hd' ? '720p' : quality === 'fullhd' ? '1080p' : '4K'}
                                </Text>
                            </View>

                            <View style={styles.statItem}>
                                <Image
                                    source={require('../assets/img/speed.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={20}
                                    width={20}
                                />
                                <Text style={styles.statText}>{frameRate} FPS</Text>
                            </View>

                            <View style={styles.statItem}>
                                <Image
                                    source={require('../assets/img/mic.png')}
                                    style={{ objectFit: 'contain' }}
                                    height={20}
                                    width={20}
                                />
                                <Text style={styles.statText}>
                                    {withAudio ? 'Audio On' : 'Audio Off'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Recording Controls */}
                    <View style={styles.recordingControlsMain}>
                        <TouchableOpacity
                            style={[styles.controlButtonMain, styles.settingsButtonMain]}
                            onPress={() => setShowRecordingOptions(true)}
                        >
                            <Image
                                source={require('../assets/img/tune.png')}
                                style={{ objectFit: 'contain' }}
                                height={24}
                                width={24}
                            />
                            <Text style={styles.controlButtonText}>Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.controlButtonMain, styles.recordButton]}
                            onPress={startRecording}
                        >
                            <Animated.View style={{ transform: [{ scale: isRecording ? pulseAnim : 1 }] }}>
                                <View style={styles.recordButtonInner}>
                                    <Image
                                        source={require('../assets/img/videocam.png')}
                                        style={{ objectFit: 'contain' }}
                                        height={32}
                                        width={32}
                                    />
                                </View>
                            </Animated.View>
                            <Text style={[styles.controlButtonText, styles.recordButtonText]}>
                                {isRecording ? 'Recording...' : 'Start Recording'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.controlButtonMain, styles.galleryButton]}
                            onPress={() => {
                                console.log("go to gallery")
                            }}
                        >
                            <Image
                                source={require('../assets/img/gallary.png')}
                                style={{ objectFit: 'contain' }}
                                height={24}
                                width={24}
                            />
                            <Text style={styles.controlButtonText}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Recordings */}
                <View style={styles.recordingsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Recordings</Text>
                        <TouchableOpacity style={styles.viewAllButton}>
                            <Text style={styles.viewAllText}>View All</Text>
                            <Image
                                source={require('../assets/img/rightArrow.png')}
                                style={{ objectFit: 'contain' }}
                                height={20}
                                width={20}
                            />
                        </TouchableOpacity>
                    </View>

                    {recordings.map((recording) => (
                        <TouchableOpacity
                            key={recording.id}
                            style={styles.recordingCard}
                            onPress={() => {
                                console.log("recording.id", recording.id)
                            }}
                        >
                            <View style={styles.recordingThumbnail}>
                                <Image
                                    source={{ uri: recording.thumbnail }}
                                    style={styles.thumbnailImage}
                                />
                                <View style={styles.durationBadge}>
                                    <Text style={styles.durationText}>{recording.duration}</Text>
                                </View>
                                <View style={styles.resolutionBadge}>
                                    <Text style={styles.resolutionText}>{recording.resolution}</Text>
                                </View>
                            </View>

                            <View style={styles.recordingInfo}>
                                <View style={styles.recordingHeader}>
                                    <Text style={styles.recordingTitle} numberOfLines={1}>
                                        {recording.title}
                                    </Text>
                                    <TouchableOpacity onPress={() => toggleFavorite(recording.id)}>
                                        {recording.favorite ? <Image
                                            source={require('../assets/img/favorite-fill.png')}
                                            style={{ objectFit: 'contain' }}
                                            height={22}
                                            width={22}
                                        /> : <Image
                                            source={require('../assets/img/favorite.png')}
                                            style={{ objectFit: 'contain' }}
                                            height={22}
                                            width={22}
                                        />}

                                    </TouchableOpacity>
                                </View>

                                <View style={styles.recordingMeta}>
                                    <View style={styles.metaItem}>
                                        <Image
                                            source={require('../assets/img/date-time.png')}
                                            style={{ objectFit: 'contain' }}
                                            height={16}
                                            width={16}
                                        />
                                        <Text style={styles.metaText}>{recording.date}</Text>
                                    </View>
                                    <Text style={styles.metaText}>•</Text>
                                    <View style={styles.metaItem}>
                                        <Image
                                            source={require('../assets/img/storage.png')}
                                            style={{ objectFit: 'contain' }}
                                            height={16}
                                            width={16}
                                        />
                                        <Text style={styles.metaText}>{recording.size}</Text>
                                    </View>
                                </View>

                                <View style={styles.recordingActions}>
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Image
                                            source={require('../assets/img/play.png')}
                                            style={{ objectFit: 'contain' }}
                                            height={20}
                                            width={20}
                                        />
                                        <Text style={styles.actionText}>Play</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.actionButton}>
                                        <Image
                                            source={require('../assets/img/share.png')}
                                            style={{ objectFit: 'contain' }}
                                            height={20}
                                            width={20}
                                        />
                                        <Text style={styles.actionText}>Share</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => deleteRecording(recording.id)}
                                    >
                                        <Image
                                            source={require('../assets/img/delete.png')}
                                            style={{ objectFit: 'contain' }}
                                            height={20}
                                            width={20}
                                        />
                                        <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Quick Tips */}
                <View style={styles.tipsSection}>
                    <Text style={styles.sectionTitle}>Quick Tips</Text>
                    <View style={styles.tipsContainer}>
                        <View style={styles.tipCard}>
                            <Image
                                source={require('../assets/img/volume-up.png')}
                                style={{ objectFit: 'contain' }}
                                height={24}
                                width={24}
                            />
                            <Text style={styles.tipTitle}>Audio Settings</Text>
                            <Text style={styles.tipText}>
                                Enable microphone in settings to record audio commentary
                            </Text>
                        </View>

                        <View style={styles.tipCard}>
                            <Image
                                source={require('../assets/img/touch.png')}
                                style={{ objectFit: 'contain' }}
                                height={24}
                                width={24}
                            />
                            <Text style={styles.tipTitle}>Touch Gestures</Text>
                            <Text style={styles.tipText}>
                                Show touch interactions for better tutorial recordings
                            </Text>
                        </View>

                        <View style={styles.tipCard}>
                            <Image
                                source={require('../assets/img/speed.png')}
                                style={{ objectFit: 'contain' }}
                                height={24}
                                width={24}
                            />
                            <Text style={styles.tipTitle}>Performance</Text>
                            <Text style={styles.tipText}>
                                Use 30 FPS for longer recordings to save storage space
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Modals */}
            {renderRecordingOptions()}
            {renderRecordingModal()}
            {renderSettingsModal()}
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
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A2E',
        marginLeft: 10,
    },
    settingsButton: {
        padding: 8,
    },
    recordingBar: {
        backgroundColor: '#FFF5F5',
        borderBottomWidth: 1,
        borderBottomColor: '#FFE2E2',
        overflow: 'hidden',
    },
    recordingBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: '100%',
    },
    recordingStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recordingIndicatorSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    recordingDotSmall: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF4757',
    },
    recordingStatusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FF4757',
    },
    recordingBarControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recordingBarButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    stopButtonSmall: {
        borderColor: '#FFE2E2',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    previewSection: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A2E',
        marginBottom: 16,
    },
    previewContainer: {
        marginBottom: 20,
    },
    previewPlaceholder: {
        height: 200,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#E9ECEF',
        borderStyle: 'dashed',
    },
    previewText: {
        fontSize: 14,
        color: '#999',
        marginTop: 12,
    },
    recordingStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 6,
    },
    recordingControlsMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    controlButtonMain: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        flex: 1,
        marginHorizontal: 5,
    },
    settingsButtonMain: {
        backgroundColor: '#F0F4FF',
        borderWidth: 1,
        borderColor: '#E6F0FF',
    },
    recordButton: {
        backgroundColor: '#FF4757',
        flex: 2,
        marginHorizontal: 10,
    },
    recordButtonInner: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FF4757',
        justifyContent: 'center',
        alignItems: 'center',
    },
    galleryButton: {
        backgroundColor: '#F0F4FF',
        borderWidth: 1,
        borderColor: '#E6F0FF',
    },
    controlButtonText: {
        fontSize: 12,
        color: '#4361EE',
        marginTop: 8,
        fontWeight: '500',
    },
    recordButtonText: {
        color: '#fff',
    },
    recordingsSection: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        fontSize: 14,
        color: '#4361EE',
        fontWeight: '500',
        marginRight: 4,
    },
    recordingCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        overflow: 'hidden',
    },
    recordingThumbnail: {
        width: 120,
        position: 'relative',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F8F9FA',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    durationText: {
        fontSize: 11,
        color: '#fff',
        fontWeight: '500',
    },
    resolutionBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(67, 97, 238, 0.9)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    resolutionText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '500',
    },
    recordingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    recordingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A2E',
        flex: 1,
        marginRight: 8,
    },
    recordingMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    metaText: {
        fontSize: 12,
        color: '#999',
        marginLeft: 4,
    },
    recordingActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F8F9FA',
    },
    actionText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
        fontWeight: '500',
    },
    deleteText: {
        color: '#FF4757',
    },
    tipsSection: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    tipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    tipCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A2E',
        marginTop: 8,
        marginBottom: 4,
    },
    tipText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    recordingOptionsModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: height * 0.85,
    },
    settingsModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        maxHeight: height * 0.9,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A2E',
    },
    optionItem: {
        marginBottom: 24,
        paddingHorizontal: 24,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A2E',
        marginLeft: 12,
    },
    qualityOptions: {
        flexDirection: 'row',
        gap: 8,
    },
    qualityOption: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    qualityOptionActive: {
        backgroundColor: '#4361EE',
        borderColor: '#4361EE',
    },
    qualityOptionText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    qualityOptionTextActive: {
        color: '#fff',
    },
    frameRateOptions: {
        flexDirection: 'row',
        gap: 8,
    },
    frameRateOption: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    frameRateOptionActive: {
        backgroundColor: '#4361EE',
        borderColor: '#4361EE',
    },
    frameRateOptionText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    frameRateOptionTextActive: {
        color: '#fff',
    },
    startRecordingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4757',
        marginHorizontal: 24,
        marginTop: 20,
        paddingVertical: 18,
        borderRadius: 12,
    },
    startRecordingText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    recordingModal: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        margin: 20,
        alignItems: 'center',
    },
    recordingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    recordingDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FF4757',
        marginRight: 10,
    },
    recordingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF4757',
    },
    recordingTimer: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#1A1A2E',
        marginBottom: 30,
    },
    recordingControls: {
        flexDirection: 'row',
        gap: 30,
        marginBottom: 30,
    },
    controlButton: {
        alignItems: 'center',
    },
    controlText: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
    },
    stopButton: {
        alignItems: 'center',
    },
    recordingInfo: {
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        width: '100%',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    minimizeButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    minimizeText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    settingsList: {
        flex: 1,
        paddingHorizontal: 24,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F9FA',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 20,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A2E',
    },
    settingDescription: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    qualitySelector: {
        flexDirection: 'row',
        gap: 8,
    },
    qualityOptionSmall: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    qualityOptionSmallActive: {
        backgroundColor: '#4361EE',
        borderColor: '#4361EE',
    },
    qualityOptionSmallText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    qualityOptionSmallTextActive: {
        color: '#fff',
    },
    frameRateSelector: {
        flexDirection: 'row',
        gap: 8,
    },
    frameRateOptionSmall: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    frameRateOptionSmallActive: {
        backgroundColor: '#4361EE',
        borderColor: '#4361EE',
    },
    frameRateOptionSmallText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    frameRateOptionSmallTextActive: {
        color: '#fff',
    },
    saveSettingsButton: {
        backgroundColor: '#4361EE',
        marginHorizontal: 24,
        marginVertical: 20,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveSettingsText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ScreenRecordingScreen;