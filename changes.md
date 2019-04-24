# 1.2.3
Added Google Analytics to functions
Added README to project
Added Help / About page with link to Privacy Policy

Updated app icons and splash images
Updated all javascript libraries used in project

Removed buddybuild shell scripts as the platform now natively supports ionic app building


# 1.2.0
Added img-cache functionality to speed up launch index
Set individual icons for all menu items
Added signup menu item
Set new server URL

# 1.2.1
Added Buddy Build SDK for Feedback & Crash Reporting
Updates cordova iOS to latest
Dropped old PushNotification plugin and implemented new up to date plugin cordova-push-plugin
Fixed register/unregister push logic especially when logging out of app
Added previous push notifications to settings menu (needs more work)
Enabled obtaining and storing user details and now shown at top of menu

# 1.2.2
New:
Added launch detail loading image modal as to get around the angular issue of showing No Information until the info is loaded
Added icon the right of each launch item to indicate more options (share, stream)
Now auto register for push notifications on login as everyone was singing up and logging in but not turning it on themselves
On initial login Push Notifications will default to ON, if you then decide to turn it off the app will respect that


Update:
Cleaned up CSS for modal images and now scaling works much better to make these images full screen
In the launch details the image is now full size with the main info on top of the image for a better experience
Converted subliminal links into button on the launch detail page for Launch Stream and Launch Pad Map
Made the h4 titles on the details page LA Red
Fixed sharing functionality and increased performance to open share dialog
Close swipe left option buttons on selection of a launch to view or clicking one of the options

# 1.2.3
New:

Update:
