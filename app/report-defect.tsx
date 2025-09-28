
import { useLocation } from '@/hooks/useLocation';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';
import { SEVERITY_LEVELS } from '@/data/constants';
import { IconSymbol } from '@/components/IconSymbol';
import { Stack, router } from 'expo-router';
import { useSupabaseDefects } from '@/hooks/useSupabaseDefects';
import { useAuth } from '@/hooks/useAuth';
import { DefectType, DefectDimensions, DefectSeverity } from '@/types';
import React, { useState } from 'react';
import { DefectTypeSelector } from '@/components/DefectTypeSelector';
import { DimensionInput } from '@/components/DimensionInput';
import { Button } from '@/components/button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 25,
  },
  section: {
    gap: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  locationCard: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    ...commonStyles.shadow,
  },
  locationText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
  },
  locationButton: {
    ...buttonStyles.outline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  locationButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  photoSection: {
    gap: 15,
  },
  photoButton: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  photoPreview: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
  },
  descriptionInput: {
    ...commonStyles.input,
    height: 100,
    textAlignVertical: 'top',
  },
  severityCard: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    ...commonStyles.shadow,
  },
  severityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 20,
  },
  authPrompt: {
    backgroundColor: colors.warning + '20',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  authPromptText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
});

export default function ReportDefectScreen() {
  const { location, getLocation, loading: locationLoading } = useLocation();
  const { addDefect, loading: submitLoading } = useSupabaseDefects();
  const { isAuthenticated, user } = useAuth();
  
  const [defectType, setDefectType] = useState<DefectType>('pothole');
  const [dimensions, setDimensions] = useState<DefectDimensions>({
    length: 0,
    width: 0,
    depth: 0,
    surface: 0,
  });
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();

  const calculateSeverity = (depth: number): DefectSeverity => {
    if (depth >= 10) return 'critical';
    if (depth >= 5) return 'high';
    if (depth >= 2) return 'moderate';
    return 'low';
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleGetLocation = async () => {
    try {
      await getLocation();
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please sign in to report defects',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/sign-in') }
        ]
      );
      return;
    }

    if (!location) {
      Alert.alert('Location Required', 'Please get your current location first');
      return;
    }

    if (dimensions.length <= 0 || dimensions.width <= 0 || dimensions.depth <= 0) {
      Alert.alert('Dimensions Required', 'Please enter valid dimensions for the defect');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Description Required', 'Please provide a description of the defect');
      return;
    }

    try {
      const severity = calculateSeverity(dimensions.depth);
      const surface = dimensions.length * dimensions.width;
      
      const finalDimensions = {
        ...dimensions,
        surface,
      };

      const result = await addDefect(
        location,
        finalDimensions,
        defectType,
        severity,
        description.trim(),
        imageUri
      );

      if (result) {
        Alert.alert(
          'Success',
          'Defect report submitted successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to submit defect report');
      }
    } catch (error) {
      console.error('Error submitting defect:', error);
      Alert.alert('Error', 'Failed to submit defect report');
    }
  };

  const severity = calculateSeverity(dimensions.depth);
  const severityInfo = SEVERITY_LEVELS.find(s => s.id === severity);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Report Defect',
          headerShown: true,
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!isAuthenticated && (
          <View style={styles.authPrompt}>
            <IconSymbol name="exclamationmark.triangle" size={24} color={colors.warning} />
            <Text style={styles.authPromptText}>
              You need to sign in to report defects. Your reports help improve road safety!
            </Text>
            <Button 
              variant="outline" 
              size="small"
              onPress={() => router.push('/auth/sign-in')}
            >
              Sign In
            </Button>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationCard}>
            {location ? (
              <Text style={styles.locationText}>
                📍 {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
              </Text>
            ) : (
              <Text style={styles.locationText}>
                Location not set
              </Text>
            )}
            <Pressable 
              style={styles.locationButton} 
              onPress={handleGetLocation}
              disabled={locationLoading}
            >
              <IconSymbol 
                name={locationLoading ? "arrow.clockwise" : "location.fill"} 
                size={16} 
                color={colors.primary} 
              />
              <Text style={styles.locationButtonText}>
                {locationLoading ? 'Getting Location...' : 'Get Current Location'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Defect Type</Text>
          <DefectTypeSelector
            selectedType={defectType}
            onTypeSelect={setDefectType}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dimensions (cm)</Text>
          <DimensionInput
            dimensions={dimensions}
            onUpdate={setDimensions}
          />
        </View>

        {dimensions.depth > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Calculated Severity</Text>
            <View style={[styles.severityCard, { borderLeftWidth: 4, borderLeftColor: severityInfo?.color }]}>
              <Text style={[styles.severityText, { color: severityInfo?.color }]}>
                {severityInfo?.label} ({dimensions.depth}cm depth)
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo (Optional)</Text>
          {imageUri ? (
            <View style={styles.photoPreview}>
              <IconSymbol name="photo.fill" size={32} color={colors.success} />
              <Text style={styles.photoButtonText}>Photo captured</Text>
              <Button variant="outline" size="small" onPress={handleTakePhoto}>
                Retake Photo
              </Button>
            </View>
          ) : (
            <Pressable style={styles.photoButton} onPress={handleTakePhoto}>
              <IconSymbol name="camera.fill" size={32} color={colors.textSecondary} />
              <Text style={styles.photoButtonText}>
                Tap to take a photo of the defect
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the defect, its location, and any safety concerns..."
            multiline
            textAlignVertical="top"
          />
        </View>

        <Button
          onPress={handleSubmit}
          loading={submitLoading}
          disabled={!isAuthenticated}
          style={styles.submitButton}
        >
          Submit Report
        </Button>
      </ScrollView>
    </View>
  );
}
