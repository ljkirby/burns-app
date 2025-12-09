import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CalculatorScreen() {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [tbsa, setTbsa] = useState('');
  const [timeOfInjury, setTimeOfInjury] = useState('12:00');
  const [constant, setConstant] = useState('4');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [results, setResults] = useState(null);

  const [weightError, setWeightError] = useState('');
  const [tbsaError, setTbsaError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setTimeToNow();
    } catch (error) {
      console.error('Error setting initial time:', error);
      setTimeOfInjury('12:00');
    }
  }, []);

  const setTimeToNow = () => {
    try {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeOfInjury(`${hours}:${minutes}`);
      setTimeError('');
    } catch (error) {
      console.error('Error in setTimeToNow:', error);
      setTimeOfInjury('12:00');
    }
  };

  const checkWeightValid = (value) => {
    if (!value || value.trim() === '') {
      return false;
    }
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      return false;
    }
    const weightKg = weightUnit === 'lb' ? num / 2.205 : num;
    if (weightKg < 3 || weightKg > 300) {
      return false;
    }
    return true;
  };

  const checkTbsaValid = (value) => {
    if (!value || value.trim() === '') {
      return false;
    }
    const num = parseFloat(value);
    if (isNaN(num) || num < 0 || num > 100) {
      return false;
    }
    return true;
  };

  const checkTimeValid = (value) => {
    if (!value || value.trim() === '') {
      return false;
    }
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(value);
  };

  const validateWeight = (value) => {
    if (!value || value.trim() === '') {
      setWeightError('Weight is required');
    } else {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        setWeightError('Weight must be a positive number');
      } else {
        const weightKg = weightUnit === 'lb' ? num / 2.205 : num;
        if (weightKg < 3 || weightKg > 300) {
          setWeightError('Weight must be between 3-300 kg (6.6-661 lb)');
        } else {
          setWeightError('');
        }
      }
    }
  };

  const validateTbsa = (value) => {
    if (!value || value.trim() === '') {
      setTbsaError('TBSA is required');
    } else {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0 || num > 100) {
        setTbsaError('TBSA must be between 0 and 100');
      } else {
        setTbsaError('');
      }
    }
  };

  const validateTime = (value) => {
    if (!value || value.trim() === '') {
      setTimeError('Time of injury is required');
    } else {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(value)) {
        setTimeError('Time must be in HH:MM format (24-hour)');
      } else {
        setTimeError('');
      }
    }
  };

  const isFormValid = () => {
    return checkWeightValid(weight) && checkTbsaValid(tbsa) && checkTimeValid(timeOfInjury);
  };

  const calculate = () => {
    if (!isFormValid()) {
      if (Platform.OS === 'web') {
        window.alert('Please fix the validation errors before calculating');
      } else {
        Alert.alert('Validation Error', 'Please fix the validation errors before calculating');
      }
      return;
    }

    const weightKg = weightUnit === 'lb' ? parseFloat(weight) / 2.205 : parseFloat(weight);
    const tbsaPercent = parseFloat(tbsa);
    const constantMl = parseFloat(constant);

    const total24 = constantMl * weightKg * tbsaPercent;
    const first8Total = total24 / 2;
    const next16Total = total24 / 2;

    const now = new Date();
    const [injuryHours, injuryMinutes] = timeOfInjury.split(':').map(Number);
    const injuryTime = new Date();
    injuryTime.setHours(injuryHours, injuryMinutes, 0, 0);

    let hoursSinceBurn = (now - injuryTime) / (1000 * 60 * 60);
    if (hoursSinceBurn < 0) {
      hoursSinceBurn += 24;
    }

    let first8Info;
    if (hoursSinceBurn < 8) {
      const remainingHours = 8 - hoursSinceBurn;
      const rateFirst8 = first8Total / remainingHours;
      first8Info = {
        passed: false,
        remainingHours: remainingHours.toFixed(1),
        rate: rateFirst8.toFixed(0),
      };
    } else {
      first8Info = { passed: true };
    }

    const rateNext16 = next16Total / 16;

    setResults({
      total24,
      first8Total,
      next16Total,
      first8Info,
      rateNext16,
      hoursSinceBurn: hoursSinceBurn.toFixed(1),
    });
  };

  const formatVolume = (ml) => {
    return {
      ml: ml.toFixed(0),
      l: (ml / 1000).toFixed(2),
    };
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#D32F2F" />
          <Text style={styles.errorTitle}>Error Loading Calculator</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setTimeToNow();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Formula Card */}
      <View style={styles.formulaCard}>
        <View style={styles.formulaHeader}>
          <Ionicons name="calculator" size={20} color="#1976D2" />
          <Text style={styles.formulaTitle}>Parkland Formula</Text>
        </View>
        <Text style={styles.formulaText}>
          Total 24-hour fluid = 4 mL × weight (kg) × %TBSA burned
        </Text>
        <Text style={styles.formulaSubtext}>
          ½ in first 8 hours from time of burn, ½ in next 16 hours
        </Text>
      </View>

      {/* Input Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>

        {/* Weight Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight</Text>
          <View style={styles.weightContainer}>
            <TextInput
              style={[styles.input, styles.weightInput, weightError ? styles.inputError : null]}
              value={weight}
              onChangeText={(text) => {
                setWeight(text);
                validateWeight(text);
              }}
              keyboardType="numeric"
              placeholder="Enter weight"
            />
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  weightUnit === 'kg' && styles.unitButtonActive,
                ]}
                onPress={() => setWeightUnit('kg')}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    weightUnit === 'kg' && styles.unitButtonTextActive,
                  ]}
                >
                  kg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  weightUnit === 'lb' && styles.unitButtonActive,
                ]}
                onPress={() => setWeightUnit('lb')}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    weightUnit === 'lb' && styles.unitButtonTextActive,
                  ]}
                >
                  lb
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
        </View>

        {/* TBSA Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>%TBSA Burned</Text>
          <TextInput
            style={[styles.input, tbsaError ? styles.inputError : null]}
            value={tbsa}
            onChangeText={(text) => {
              setTbsa(text);
              validateTbsa(text);
            }}
            keyboardType="numeric"
            placeholder="0-100"
          />
          <Text style={styles.helperText}>
            Use partial- and full-thickness burn area only; exclude first-degree burns
          </Text>
          {tbsaError ? <Text style={styles.errorText}>{tbsaError}</Text> : null}
        </View>

        {/* Time of Injury */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time of Injury (24-hour format)</Text>
          <View style={styles.timeContainer}>
            <TextInput
              style={[styles.input, styles.timeInput, timeError ? styles.inputError : null]}
              value={timeOfInjury}
              onChangeText={(text) => {
                setTimeOfInjury(text);
                validateTime(text);
              }}
              placeholder="HH:MM"
            />
            <TouchableOpacity style={styles.nowButton} onPress={setTimeToNow}>
              <Ionicons name="time" size={20} color="#fff" />
              <Text style={styles.nowButtonText}>Now</Text>
            </TouchableOpacity>
          </View>
          {timeError ? <Text style={styles.errorText}>{timeError}</Text> : null}
        </View>

        {/* Advanced Settings */}
        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={styles.advancedToggleText}>Advanced Settings</Text>
          <Ionicons
            name={showAdvanced ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.advancedSection}>
            <Text style={styles.label}>Formula Constant (mL/kg/%TBSA)</Text>
            <TextInput
              style={styles.input}
              value={constant}
              onChangeText={setConstant}
              keyboardType="numeric"
              placeholder="4"
            />
            <Text style={styles.helperText}>
              Default is 4 mL/kg/%TBSA (Parkland formula)
            </Text>
          </View>
        )}

        {/* Calculate Button */}
        <TouchableOpacity
          style={[styles.calculateButton, !isFormValid() && styles.calculateButtonDisabled]}
          onPress={calculate}
          disabled={!isFormValid()}
        >
          <Ionicons name="calculator" size={24} color="#fff" />
          <Text style={styles.calculateButtonText}>Calculate</Text>
        </TouchableOpacity>
      </View>

      {/* Results Section */}
      {results && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculated Volumes (Parkland Formula)</Text>

          {/* Total 24 hours */}
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Total 24-Hour Fluid</Text>
            <View style={styles.resultValues}>
              <Text style={styles.resultValue}>{formatVolume(results.total24).ml} mL</Text>
              <Text style={styles.resultValueSecondary}>
                ({formatVolume(results.total24).l} L)
              </Text>
            </View>
          </View>

          {/* First 8 hours */}
          <View style={[styles.resultCard, styles.resultCardHighlight]}>
            <Text style={styles.resultTitle}>First 8 Hours from Time of Burn</Text>
            <View style={styles.resultValues}>
              <Text style={styles.resultValue}>{formatVolume(results.first8Total).ml} mL</Text>
              <Text style={styles.resultValueSecondary}>
                ({formatVolume(results.first8Total).l} L)
              </Text>
            </View>
            {!results.first8Info.passed ? (
              <View style={styles.rateInfo}>
                <Ionicons name="time" size={16} color="#1976D2" />
                <Text style={styles.rateText}>
                  {results.first8Info.remainingHours} hours remaining
                </Text>
              </View>
            ) : null}
            {!results.first8Info.passed ? (
              <View style={styles.rateInfo}>
                <Ionicons name="water" size={16} color="#1976D2" />
                <Text style={styles.rateText}>
                  Suggested rate: {results.first8Info.rate} mL/hr
                </Text>
              </View>
            ) : (
              <View style={styles.warningBox}>
                <Ionicons name="alert-circle" size={20} color="#F57C00" />
                <Text style={styles.warningText}>
                  First 8-hour period has passed (elapsed: {results.hoursSinceBurn} hours)
                </Text>
              </View>
            )}
          </View>

          {/* Next 16 hours */}
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Next 16 Hours</Text>
            <View style={styles.resultValues}>
              <Text style={styles.resultValue}>{formatVolume(results.next16Total).ml} mL</Text>
              <Text style={styles.resultValueSecondary}>
                ({formatVolume(results.next16Total).l} L)
              </Text>
            </View>
            <View style={styles.rateInfo}>
              <Ionicons name="water" size={16} color="#1976D2" />
              <Text style={styles.rateText}>
                Average rate: {results.rateNext16.toFixed(0)} mL/hr
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons name="information-circle" size={20} color="#666" />
        <Text style={styles.disclaimerText}>
          For educational and research use only. Does not replace clinical judgment or local
          protocols.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formulaCard: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  formulaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  formulaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginLeft: 8,
  },
  formulaText: {
    fontSize: 15,
    color: '#1565C0',
    fontWeight: '600',
    marginBottom: 4,
  },
  formulaSubtext: {
    fontSize: 13,
    color: '#1976D2',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightInput: {
    flex: 1,
    marginRight: 8,
  },
  unitToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  unitButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  unitButtonActive: {
    backgroundColor: '#2196F3',
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  unitButtonTextActive: {
    color: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    flex: 1,
    marginRight: 8,
  },
  nowButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  nowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  helperText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 13,
    color: '#D32F2F',
    marginTop: 4,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  advancedToggleText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  advancedSection: {
    marginBottom: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  calculateButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  calculateButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  resultCardHighlight: {
    backgroundColor: '#FFF9C4',
    borderLeftColor: '#FBC02D',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  resultValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginRight: 8,
  },
  resultValueSecondary: {
    fontSize: 16,
    color: '#666',
  },
  rateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rateText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#E65100',
    marginLeft: 8,
    flex: 1,
    fontWeight: '600',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  disclaimerText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});
