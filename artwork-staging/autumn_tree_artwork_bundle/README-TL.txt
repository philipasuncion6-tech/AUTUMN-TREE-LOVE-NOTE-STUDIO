AUTUMN TREE LOVE NOTE STUDIO - ARTWORK BUNDLE

Image mapping:
- assets/icon.png: new square app icon master
- assets/icons/: PWA and Apple touch icon sizes
- assets/mother-daughter-autumn.jpg: featured family scene
- android/app/src/main/res/: Android launcher PNGs

Important:
1. Back up the same folders in your Termux project before replacing anything.
2. Copy the assets/ folder into the project root.
3. Copy the android/ folder into the project root, merging folders.
4. Keep the existing Android adaptive icon XML files and background color resource.
5. Then run: npx cap sync android

The Android adaptive foregrounds are inset to reduce cropping by launcher masks.
