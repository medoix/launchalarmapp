# TO DO LIST
- DONE - Move login / signup buttons from settings page and set logic to auto direct to login page if not authed
- DONE - Remove background image causing issues
- DONE - Set external links to open in _ system (in-app-browser).
- Test above external link changes on both iOS and Android device
- DONE - Move signup / login / password-reset to different controllers as now when you go to signup the profile logic runs that says your not authed and directs you to the login page.
- Find out how to use gulp in order to include minified versions of CSS etc.
- DONE - Fix modal window to center vertically both images and maps
- WORKING ON - When clicking in to view launch details on android, it think it is offline and shows the offline view
- When clicking in to view launch details it shows no information first while loading, need to remove that
- WORKING ON - Fix share function to only share info that is relevant (currently shares everything)
- When push notification received, go to launch details when app opens/or maybe go to stream directly if link is available
- DONE - Check push permissions of device instead of relying on local storage. In the case someone disabled push outside of the app the old logic would still show it as on but it is not and the feedback service would have logged this as disabled anyway.
- Set modals to center content and remove close button but enable close tap anywhere on modal.
- Create new splash screen image and generate for ios/android
- Create new app icon images and generate for ios/android

- @anthonymuscat
  - Long Titles wrap and go behind the Local Time line in the FlexBox
  - The sign in process is a little painful
  - After the update i can’t sign in.
  - Would be would if there was forgot password link.
  - Confirm email go’s into the junk folder (Would be nice if it told you need to go and do it)

  
# New Features (as requested or come up with)
- Allow people who do not want push notifications to add to there local calendar for a reminder
- Close slide left for share/stream after clicked
- ?? Pinch to zoom on image/maps
- ?? Link of launch pad open in google app
- ?? Add icon to list items to indicate they can be swiped left
- ?? Check sharing with social functionality and reported as broken
- ?? Show X amount of previous launches for some immediate value add when waiting for the next launch
  launchService.js - $http.get(launchconfig.server + '/launch/2016-06-01/2016-06-31?limit=2&sort=desc&orderby=net')






login/singup page submit button on device keyboard
