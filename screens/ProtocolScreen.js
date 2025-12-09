import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, useWindowDimensions, ActivityIndicator, TouchableOpacity, Text } from 'react-native';

export default function ProtocolScreen() {
  const { width, height } = useWindowDimensions();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState('burns');

  // Calculate image dimensions maintaining aspect ratio
  // Original image appears to be roughly 680x1000 pixels (aspect ratio ~0.68)
  const aspectRatio = 0.68;
  const maxWidth = width * 0.95;
  const maxHeight = height * 0.85;

  let imageWidth, imageHeight;

  if (maxWidth / aspectRatio <= maxHeight) {
    imageWidth = maxWidth;
    imageHeight = maxWidth / aspectRatio;
  } else {
    imageHeight = maxHeight;
    imageWidth = maxHeight * aspectRatio;
  }

  const handleProtocolChange = (protocol) => {
    setImageLoaded(false);
    setSelectedProtocol(protocol);
  };

  const imageSource = selectedProtocol === 'burns'
    ? require('../assets/burn-protocol.png')
    : require('../assets/cold-protocol.png');

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedProtocol === 'burns' && styles.toggleButtonActive
          ]}
          onPress={() => handleProtocolChange('burns')}
        >
          <Text style={[
            styles.toggleButtonText,
            selectedProtocol === 'burns' && styles.toggleButtonTextActive
          ]}>
            Burns Protocol
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedProtocol === 'hypothermia' && styles.toggleButtonActive
          ]}
          onPress={() => handleProtocolChange('hypothermia')}
        >
          <Text style={[
            styles.toggleButtonText,
            selectedProtocol === 'hypothermia' && styles.toggleButtonTextActive
          ]}>
            Hypothermia Protocol
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {!imageLoaded && (
          <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
        )}
        <Image
          key={selectedProtocol}
          source={imageSource}
          style={{
            width: imageWidth,
            height: imageHeight,
            opacity: imageLoaded ? 1 : 0,
          }}
          resizeMode="contain"
          onLoad={() => setImageLoaded(true)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  toggleButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loader: {
    position: 'absolute',
  },
});
