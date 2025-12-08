package com.simpleapp

import android.app.Activity
import android.content.Intent
import android.media.MediaRecorder
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.os.Environment
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.ComponentActivity
import com.facebook.react.bridge.*
import java.io.File
import java.io.IOException

class ScreenRecorderModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private var mediaProjectionManager: MediaProjectionManager? = null
    private var mediaProjection: MediaProjection? = null
    private var mediaRecorder: MediaRecorder? = null
    private var virtualDisplay: VirtualDisplay? = null

    private var pendingPromise: Promise? = null
    private var outputPath: String = ""

    override fun getName(): String = "ScreenRecorder"

    private val launcher by lazy {
        val activity = reactContext.currentActivity as? ComponentActivity
        activity?.activityResultRegistry?.register(
            "screen_record_request",
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            handlePermission(result.resultCode, result.data)
        }
    }

    @ReactMethod
    fun startRecording(promise: Promise) {
        val activity = reactContext.currentActivity as? ComponentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No current activity")
            return
        }

        mediaProjectionManager =
            activity.getSystemService(Activity.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager

        val intent = mediaProjectionManager?.createScreenCaptureIntent()
        pendingPromise = promise
        launcher?.launch(intent)
    }

    private fun handlePermission(resultCode: Int, data: Intent?) {
        if (resultCode != Activity.RESULT_OK || data == null) {
            pendingPromise?.reject("DENIED", "Screen capture permission denied")
            pendingPromise = null
            return
        }

        try {
            setupRecorder()

            mediaProjection =
                mediaProjectionManager?.getMediaProjection(resultCode, data)

            val metrics = reactContext.resources.displayMetrics

            virtualDisplay = mediaProjection?.createVirtualDisplay(
                "ScreenRecordDisplay",
                metrics.widthPixels,
                metrics.heightPixels,
                metrics.densityDpi,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                mediaRecorder?.surface,
                null,
                null
            )

            mediaRecorder?.start()
            pendingPromise?.resolve(outputPath)

        } catch (e: Exception) {
            pendingPromise?.reject("ERROR", e.message)
        }
        pendingPromise = null
    }

    private fun setupRecorder() {
        val moviesDir =
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MOVIES)
        val folder = File(moviesDir, "ScreenRecords")
        if (!folder.exists()) folder.mkdirs()

        outputPath = folder.absolutePath + "/record_${System.currentTimeMillis()}.mp4"

        mediaRecorder = MediaRecorder().apply {
            setAudioSource(MediaRecorder.AudioSource.MIC)
            setVideoSource(MediaRecorder.VideoSource.SURFACE)
            setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            setOutputFile(outputPath)
            setVideoSize(1080, 1920)
            setVideoEncoder(MediaRecorder.VideoEncoder.H264)
            setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
            setVideoFrameRate(30)
            setVideoEncodingBitRate(5_000_000)
            prepare()
        }
    }

    @ReactMethod
    fun pauseRecording(promise: Promise) {
        try {
            mediaRecorder?.pause()
            promise.resolve("paused")
        } catch (e: Exception) {
            promise.reject("ERR_PAUSE", e.message)
        }
    }

    @ReactMethod
    fun resumeRecording(promise: Promise) {
        try {
            mediaRecorder?.resume()
            promise.resolve("resumed")
        } catch (e: Exception) {
            promise.reject("ERR_RESUME", e.message)
        }
    }

    @ReactMethod
    fun stopRecording(promise: Promise) {
        try {
            mediaRecorder?.stop()
            mediaRecorder?.reset()
            mediaProjection?.stop()
            virtualDisplay?.release()

            promise.resolve(outputPath)

        } catch (e: Exception) {
            promise.reject("ERR_STOP", e.message)
        }
    }
}
