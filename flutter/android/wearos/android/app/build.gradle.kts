import java.io.File
import java.util.Properties

plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

val sharedSigningProperties = Properties().apply {
    val sharedPropertiesFile = rootProject.file("../../../../react_native/android/gradle.properties")
    if (sharedPropertiesFile.exists()) {
        sharedPropertiesFile.inputStream().use(::load)
    }
}

fun releaseSigningProperty(name: String): String? =
    (project.findProperty(name) as String?) ?: sharedSigningProperties.getProperty(name)

fun resolveReleaseStoreFile(storeFilePath: String): File {
    val configuredPath = file(storeFilePath)
    if (File(storeFilePath).isAbsolute || configuredPath.exists()) {
        return configuredPath
    }
    val reactNativeAppPath = rootProject.file("../../../../react_native/android/app/$storeFilePath")
    if (reactNativeAppPath.exists()) {
        return reactNativeAppPath
    }
    return configuredPath
}

android {
    namespace = "it.arcsoftware.breathe_wearos"
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
        // Wear OS requires minimum API 26
        minSdk = 26
        targetSdk = flutter.targetSdkVersion
        // Must differ from phone app versionCode within the same listing.
        versionCode = flutter.versionCode + 1000000
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
                storeFile = resolveReleaseStoreFile(storeFileProp)
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
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}

flutter {
    source = "../.."
}

dependencies {
    implementation("androidx.wear:wear-ongoing:1.1.0")
}
