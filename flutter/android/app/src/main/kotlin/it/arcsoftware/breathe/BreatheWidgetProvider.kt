package it.arcsoftware.breathe

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import es.antonborri.home_widget.HomeWidgetProvider
import org.json.JSONArray

class BreatheWidgetProvider : HomeWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray,
        widgetData: android.content.SharedPreferences,
    ) {
        val presetsJson = widgetData.getString("presets", null)
        val presets = parsePresets(presetsJson)

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.breathe_widget)

            val buttonIds = listOf(
                R.id.preset_btn_0,
                R.id.preset_btn_1,
                R.id.preset_btn_2,
                R.id.preset_btn_3,
            )

            for (i in buttonIds.indices) {
                if (i < presets.size) {
                    val preset = presets[i]
                    views.setTextViewText(buttonIds[i], preset.label)

                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(preset.deepLink)).apply {
                        setPackage(context.packageName)
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    }
                    val pendingIntent = PendingIntent.getActivity(
                        context,
                        i,
                        intent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
                    )
                    views.setOnClickPendingIntent(buttonIds[i], pendingIntent)
                }
            }

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }

    private data class WidgetPreset(
        val id: String,
        val label: String,
        val deepLink: String,
    )

    private fun parsePresets(json: String?): List<WidgetPreset> {
        if (json.isNullOrEmpty()) return defaultPresets()

        return try {
            val array = JSONArray(json)
            (0 until array.length()).map { i ->
                val obj = array.getJSONObject(i)
                WidgetPreset(
                    id = obj.getString("id"),
                    label = obj.getString("label"),
                    deepLink = obj.getString("deepLink"),
                )
            }
        } catch (_: Exception) {
            defaultPresets()
        }
    }

    private fun defaultPresets(): List<WidgetPreset> = listOf(
        WidgetPreset("box_4_4_4_4", "Box 4-4-4-4", "breathe://start?preset=box_4_4_4_4&autostart=true"),
        WidgetPreset("relax_4_7_8", "Relax 4-7-8", "breathe://start?preset=relax_4_7_8&autostart=true"),
        WidgetPreset("coherent_5_5", "Coherent 5.5-5.5", "breathe://start?preset=coherent_5_5&autostart=true"),
        WidgetPreset("equal_4_4", "Equal 4-4", "breathe://start?preset=equal_4_4&autostart=true"),
    )
}
