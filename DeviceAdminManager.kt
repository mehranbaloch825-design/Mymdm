package com.custom.turnstileadmin

import android.app.admin.DeviceAdminReceiver
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONObject
import java.net.URI
import org.java_websocket.client.WebSocketClient
import org.java_websocket.handshake.ServerHandshake

class MyDeviceAdminReceiver : DeviceAdminReceiver() {
    companion object {
        fun getComponentName(context: Context): ComponentName {
            return ComponentName(context.applicationContext, MyDeviceAdminReceiver::class.java)
        }
    }
}

class MainActivity : AppCompatActivity() {
    private lateinit var remoteController: RemoteController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Replace with your deployed Render or Replit URL
        val serverUrl = "wss://your-app-name.onrender.com"
        remoteController = RemoteController(this, serverUrl)
    }
}

class RemoteController(private val context: Context, serverUri: String) {

    private val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
    private val adminComponent = MyDeviceAdminReceiver.getComponentName(context)
    private var webSocketClient: WebSocketClient? = null

    init {
        try {
            connectToCloudServer(URI(serverUri))
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun connectToCloudServer(uri: URI) {
        webSocketClient = object : WebSocketClient(uri) {
            override fun onOpen(handshakedata: ServerHandshake?) {
                send("{\"type\":\"register_tablet\"}")
            }

            override fun onMessage(message: String?) {
                message?.let {
                    try {
                        val json = JSONObject(it)
                        if (json.optString("type") == "command") {
                            when (json.optString("action")) {
                                "reboot" -> rebootDevice()
                                "trigger_gate" -> openGate()
                            }
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }

            override fun onClose(code: Int, reason: String?, remote: Boolean) {
                // Connection retry logic
            }

            override fun onError(ex: Exception?) {}
        }
        webSocketClient?.connect()
    }

    // Direct Device Owner Reboot Execution
    fun rebootDevice() {
        try {
            if (dpm.isDeviceOwnerApp(context.packageName)) {
                dpm.reboot(adminComponent)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun openGate() {
        // Direct USB Relay signal code
    }
}
