import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import UserNotifications
import GoogleSignIn

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {

    var window: UIWindow?
    var reactNativeDelegate: ReactNativeDelegate?
    var reactNativeFactory: RCTReactNativeFactory?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {

        // Firebase setup
        FirebaseApp.configure()

        // Notification delegate
        let center = UNUserNotificationCenter.current()
        center.delegate = self
        application.registerForRemoteNotifications()

        // React Native setup
        let delegate = ReactNativeDelegate()
        let factory = RCTReactNativeFactory(delegate: delegate)
        delegate.dependencyProvider = RCTAppDependencyProvider()

        reactNativeDelegate = delegate
        reactNativeFactory = factory

        window = UIWindow(frame: UIScreen.main.bounds)
        factory.startReactNative(
            withModuleName: "zanny_customer",
            in: window,
            launchOptions: launchOptions
        )

        return true
    }

    // Background/Killed notification handler
    func application(_ application: UIApplication,
                     didReceiveRemoteNotification userInfo: [AnyHashable: Any],
                     fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        print("Background/Killed notification received: \(userInfo)")
        completionHandler(.newData)
    }

    // Foreground notification handler
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        print("Foreground notification received: \(notification.request.content.userInfo)")
        completionHandler([.banner, .sound])
    }

    // Optional: handle user tapping on notification
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse,
                                withCompletionHandler completionHandler: @escaping () -> Void) {
        print("Notification tapped: \(response.notification.request.content.userInfo)")
        completionHandler()
    }

    // Handle URL opens for Google Sign-In
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        // Let Google Sign-In SDK try to handle the URL
        if GIDSignIn.sharedInstance.handle(url) {
            return true
        }

        return false
    }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
    override func sourceURL(for bridge: RCTBridge) -> URL? {
        self.bundleURL()
    }

    override func bundleURL() -> URL? {
        #if DEBUG
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
}
