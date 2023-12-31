import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import IconButton from './components/IconButton';
import CircleButton from './components/CircleButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

const PlaceholderImage = require('./assets/cringeApple.jpg');


export default function App() {
   const [selectedImage, setSelectedImage] = useState(null)
   const [showAppOptions, setShowAppOptions] = useState(false)
   const [isModalVisible, setIsModalVisible] = useState(false)
   const [pickedEmoji, setPickedEmoji] = useState(null)
   const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()
   const imageRef = useRef()
   if (permissionResponse === null) {
      requestPermission();
   }

   const pickImageAsync = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         allowsEditing: true,
         quality: 1,
      });
      if (!result.canceled) {
         setSelectedImage(result.assets[0].uri);
         setShowAppOptions(true)
      } else {
         alert('You did not select any image(');
      }
   };
   const onReset = () => {
      setShowAppOptions(false);
   };
   const onAddSticker = () => {
      setIsModalVisible(true);
   };
   const onSaveImageAsync = async () => {
      try {
         const localUri = await captureRef(imageRef, {
            height: 440,
            quality: 1,
         })
         await MediaLibrary.saveToLibraryAsync(localUri)
         if (localUri) {
            alert("Saved!")
         }
      } catch (e) {
         console.log(e)
      }
   };
   const onModalClose = () => {
      setIsModalVisible(false);
   };
   return (
      <GestureHandlerRootView style={styles.container}>
         <View ref={imageRef} collapsable={false} style={styles.imageContainer}>
            <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
            {pickedEmoji !== null ?
               <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
               : null}
         </View>
         {showAppOptions ? (
            <View style={styles.optionsContainer}>
               <View style={styles.optionsRow}>
                  <IconButton icon="refresh" label="Reset" onPress={onReset} />
                  <CircleButton onPress={onAddSticker} />
                  <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
               </View>
            </View>
         ) : (
            <View>
               <Button theme={'primary'} label="Choose a photo" onPress={pickImageAsync} />
               <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
            </View>
         )}
         <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
            <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
         </EmojiPicker>
         <StatusBar style="auto" />
      </GestureHandlerRootView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#25292e',
      alignItems: 'center',
   },
   imageContainer: {
      flex: 1,
      paddingTop: 58,
      alignItems: 'center'
   },
   optionsContainer: {
      position: 'absolute',
      bottom: 45,
   },
   optionsRow: {
      alignItems: 'center',
      flexDirection: 'row',
   },
   image: {
      width: 320,
      height: 440,
      borderRadius: 18,
   }
});
