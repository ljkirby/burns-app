import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

export default function AIAnalysisScreen() {
  const [photos, setPhotos] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisTime, setAnalysisTime] = useState('');

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    return cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted';
  };

  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      Alert.alert('Permission Required', 'Camera and photo library permissions are required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0]]);
    }
  };

  const uploadPhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      Alert.alert('Permission Required', 'Photo library permission is required to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setPhotos([...photos, ...result.assets]);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const analyzePhotos = async () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'Please take or upload photos before analyzing.');
      return;
    }

    setIsAnalyzing(true);

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    setAnalysisTime(timeString);

    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const generatePdfHtml = (currentDate) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @page {
              margin: 0.75in;
              size: letter;
            }

            * {
              box-sizing: border-box;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
              line-height: 1.6;
            }

            .container {
              width: 100%;
              max-width: 7in;
              margin: 0 auto;
            }

            .header {
              border-bottom: 4px solid #2196F3;
              padding-bottom: 24px;
              margin-bottom: 32px;
            }

            .title {
              font-size: 32px;
              font-weight: bold;
              color: #1976D2;
              margin: 0 0 16px 0;
              letter-spacing: -0.5px;
            }

            .date-time {
              font-size: 14px;
              color: #666;
              line-height: 1.8;
            }

            .date-time div {
              margin: 4px 0;
            }

            .critical-alert {
              background-color: #D32F2F;
              color: white;
              padding: 24px;
              border-radius: 8px;
              margin: 32px 0;
              font-weight: bold;
              font-size: 18px;
              text-align: center;
              border: 3px solid #B71C1C;
            }

            .results-section {
              margin: 32px 0;
            }

            .result-item {
              margin: 28px 0;
              padding: 20px;
              background-color: #f9f9f9;
              border-left: 4px solid #2196F3;
              page-break-inside: avoid;
            }

            .result-label {
              font-size: 16px;
              color: #555;
              margin-bottom: 12px;
              font-weight: 500;
            }

            .result-value {
              font-size: 28px;
              font-weight: bold;
              margin-top: 8px;
            }

            .value-green {
              color: #2E7D32;
            }

            .value-red {
              color: #C62828;
            }

            .footer {
              margin-top: 48px;
              padding-top: 24px;
              border-top: 2px solid #e0e0e0;
              text-align: center;
              color: #999;
              font-size: 11px;
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="title">Burn Injury Analysis Results</div>
              <div class="date-time">
                <div><strong>Date:</strong> ${currentDate}</div>
                <div><strong>Analysis Time:</strong> ${analysisTime}</div>
              </div>
            </div>

            <div class="critical-alert">
              ⚠️ CRITICAL BURN<br>
              Transfer to burn center immediately
            </div>

            <div class="results-section">
              <div class="result-item">
                <div class="result-label">Image quality for analysis:</div>
                <div class="result-value value-green">10/10</div>
              </div>

              <div class="result-item">
                <div class="result-label">Total Burn Surface Area:</div>
                <div class="result-value value-red">25%</div>
              </div>

              <div class="result-item">
                <div class="result-label">Burn depth:</div>
                <div class="result-value value-red">Full thickness</div>
              </div>
            </div>

            <div class="footer">
              Generated by Burns App - ${currentDate} at ${analysisTime}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const saveResults = async () => {
    try {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const htmlContent = generatePdfHtml(currentDate);

      console.log('Generating PDF with HTML length:', htmlContent.length);

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 612,
        height: 792,
      });

      console.log('PDF generated at:', uri);

      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
        });
      } else {
        const pdfName = `burn_analysis_${Date.now()}.pdf`;
        const pdfUri = `${FileSystem.documentDirectory}${pdfName}`;
        await FileSystem.moveAsync({
          from: uri,
          to: pdfUri,
        });
        await Sharing.shareAsync(pdfUri);
      }

      Alert.alert('Success', 'Analysis results saved as PDF');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save results: ' + error.message);
    }
  };

  const shareResults = async () => {
    try {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const htmlContent = generatePdfHtml(currentDate);

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 612,
        height: 792,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
        });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share results: ' + error.message);
    }
  };

  const closeResults = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to close? All photos will be deleted.'
      );
      if (confirmed) {
        setShowResults(false);
        setPhotos([]);
      }
    } else {
      Alert.alert(
        'Confirm Close',
        'Are you sure you want to close? All photos will be deleted.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            style: 'destructive',
            onPress: () => {
              setShowResults(false);
              setPhotos([]);
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.instructionsContainer}>
          <Ionicons name="information-circle" size={24} color="#2196F3" />
          <Text style={styles.instructionsText}>
            Take or upload multiple photos of a burn or frostbite injury for AI analysis
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
            <Ionicons name="camera" size={32} color="#fff" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.photoButton} onPress={uploadPhoto}>
            <Ionicons name="images" size={32} color="#fff" />
            <Text style={styles.buttonText}>Upload Photos</Text>
          </TouchableOpacity>
        </View>

        {photos.length > 0 && (
          <View style={styles.photosContainer}>
            <Text style={styles.photosTitle}>Photos ({photos.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close-circle" size={30} color="#FF0000" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity
          style={[styles.analyzeButton, photos.length === 0 && styles.analyzeButtonDisabled]}
          onPress={analyzePhotos}
          disabled={photos.length === 0 || isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <>
              <Ionicons name="analytics" size={32} color="#fff" />
              <Text style={styles.analyzeButtonText}>Analyze</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showResults}
        transparent={true}
        animationType="slide"
        onRequestClose={closeResults}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.resultsContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Analysis Results</Text>
                <Text style={styles.analysisTime}>Analysis Time: {analysisTime}</Text>
              </View>

              <View style={styles.criticalAlert}>
                <Ionicons name="warning" size={24} color="#fff" />
                <Text style={styles.criticalAlertText}>
                  CRITICAL BURN - Transfer to burn center immediately
                </Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Image quality for analysis:</Text>
                <Text style={styles.resultValueGreen}>10/10</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Total Burn Surface Area:</Text>
                <Text style={styles.resultValueRed}>25%</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Burn depth:</Text>
                <Text style={styles.resultValueRed}>Full thickness</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.actionButton} onPress={saveResults}>
                <Ionicons name="save" size={24} color="#2196F3" />
                <Text style={styles.actionButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={shareResults}>
                <Ionicons name="share" size={24} color="#2196F3" />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={closeResults}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  instructionsText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1976D2',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  photosContainer: {
    marginBottom: 20,
  },
  photosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  analyzeButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 500,
  },
  resultsContent: {
    backgroundColor: '#fff',
  },
  modalHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
    paddingBottom: 15,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  analysisTime: {
    fontSize: 14,
    color: '#666',
  },
  criticalAlert: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  criticalAlertText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  resultItem: {
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  resultValueGreen: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  resultValueRed: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 15,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionButtonText: {
    color: '#2196F3',
    fontSize: 14,
    marginTop: 5,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#757575',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
