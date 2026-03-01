import java.util.Properties

plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

val sharedSigningProperties = Properties().apply {
    val sharedPropertiesFile = rootProject.file("../../react_native/android/gradle.properties")
    if (sharedPropertiesFile.exists()) {
        sharedPropertiesFile.inputStream().use(::load)
    }
}

fun releaseSigningProperty(name: String): String? =
    (project.findProperty(name) as String?) ?: sharedSigningProperties.getProperty(name)

android {
    namespace = "it.arcsoftware.breathe"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }

    defaultConfig {
        applicationId = "it.arcsoftware.breathe"
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    signingConfigs {
        create("release") {
            val storeFileProp = releaseSigningProperty("MYAPP_UPLOAD_STORE_FILE")
            val keyAliasProp = releaseSigningProperty("MYAPP_UPLOAD_KEY_ALIAS")
            val storePasswordProp = releaseSigningProperty("MYAPP_UPLOAD_STORE_PASSWORD")
            val keyPasswordProp = releaseSigningProperty("MYAPP_UPLOAD_KEY_PASSWORD")

            if (
                storeFileProp != null &&
                keyAliasProp != null &&
                storePasswordProp != null &&
                keyPasswordProp != null
            ) {
                storeFile = file(storeFileProp)
                storePassword = storePasswordProp
                keyAlias = keyAliasProp
                keyPassword = keyPasswordProp
            } else {
                throw org.gradle.api.GradleException(
                    "Missing release signing properties in gradle.properties",
                )
            }
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}

flutter {
    source = "../.."
}
