
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { DefectTypeSelector } from '@/components/DefectTypeSelector';
import { DimensionInput } from '@/components/DimensionInput';
import { useDefects } from '@/hooks/useDefects';
import { useLocation } from '@/hooks/useLocation';
import { DefectType, DefectDimensions, DefectSeverity, DefectReport } from '@/types';
import { SEVERITY_LEVELS } from '@/data/constants';
import { currentUser } from '@/data/mockData';
import * as ImagePicker from 'expo-image-picker';

export default function ReportDefectScreen() {
  const { addDefect } = useDefects();
  const { location, loading: locationLoading, getCurrentLocation } = useLocation();
  
  const [selectedType, setSelectedType] = useState<DefectType | null>(null);
  const [dimensions, setDimensions] = useState<DefectDimensions>({
    length: 0,
    width: 0,
    depth: 0,
    surface: 0,
  });
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const calculateSeverity = (depth: number): DefectSeverity => {
    if (depth >= 10) return 'critical';
    if (depth >= 6) return 'high';
    if (depth >= 3) return 'moderate';
    return 'low';
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'L\'accès à la caméra est nécessaire pour prendre une photo.');
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
      console.log('Error taking photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo.');
    }
  };

  const handleGetLocation = async () => {
    const currentLocation = await getCurrentLocation();
    if (!currentLocation) {
      Alert.alert('Erreur', 'Impossible d\'obtenir la localisation actuelle.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('Erreur', 'Veuillez sélectionner un type de défaillance.');
      return;
    }

    if (!location) {
      Alert.alert('Erreur', 'Veuillez obtenir votre localisation.');
      return;
    }

    if (dimensions.length === 0 || dimensions.width === 0 || dimensions.depth === 0) {
      Alert.alert('Erreur', 'Veuillez renseigner toutes les dimensions.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Erreur', 'Veuillez ajouter une description.');
      return;
    }

    setSubmitting(true);

    try {
      const severity = calculateSeverity(dimensions.depth);
      
      const newDefect: DefectReport = {
        id: Date.now().toString(),
        location,
        dimensions,
        type: selectedType,
        severity,
        description: description.trim(),
        imageUri,
        reportedBy: currentUser.id,
        reportedAt: new Date(),
        validations: currentUser.type === 'citizen' ? [] : [currentUser.id],
        status: currentUser.type === 'citizen' ? 'reported' : 'validated',
        priority: currentUser.weight,
      };

      await addDefect(newDefect);
      
      Alert.alert(
        'Succès',
        'Votre signalement a été enregistré avec succès.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.log('Error submitting defect:', error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer le signalement.');
    } finally {
      setSubmitting(false);
    }
  };

  const severity = calculateSeverity(dimensions.depth);
  const severityInfo = SEVERITY_LEVELS.find(s => s.id === severity);

  return (
    <View style={commonStyles.wrapper}>
      <Stack.Screen
        options={{
          title: 'Signaler un défaut',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.surface,
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
      
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={commonStyles.content}>
          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localisation</Text>
            <View style={styles.locationContainer}>
              {location ? (
                <View style={styles.locationInfo}>
                  <IconSymbol name="location" size={16} color={colors.success} />
                  <Text style={styles.locationText}>
                    {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                  </Text>
                </View>
              ) : (
                <Text style={commonStyles.textSecondary}>
                  Aucune localisation obtenue
                </Text>
              )}
              
              <Pressable
                style={[buttonStyles.secondary, styles.locationButton]}
                onPress={handleGetLocation}
                disabled={locationLoading}
              >
                <IconSymbol 
                  name={locationLoading ? "arrow.clockwise" : "location"} 
                  size={16} 
                  color={colors.primary} 
                />
                <Text style={styles.locationButtonText}>
                  {locationLoading ? 'Localisation...' : 'Obtenir ma position'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Photo Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photo (optionnel)</Text>
            <Pressable
              style={[buttonStyles.secondary, styles.photoButton]}
              onPress={handleTakePhoto}
            >
              <IconSymbol name="camera" size={20} color={colors.primary} />
              <Text style={styles.photoButtonText}>
                {imageUri ? 'Photo prise ✓' : 'Prendre une photo'}
              </Text>
            </Pressable>
          </View>

          {/* Defect Type */}
          <DefectTypeSelector
            selectedType={selectedType}
            onSelect={setSelectedType}
          />

          {/* Dimensions */}
          <DimensionInput
            dimensions={dimensions}
            onUpdate={setDimensions}
          />

          {/* Severity Display */}
          {dimensions.depth > 0 && (
            <View style={styles.severityContainer}>
              <Text style={styles.sectionTitle}>Gravité calculée</Text>
              <View style={[styles.severityBadge, { backgroundColor: severityInfo?.color }]}>
                <Text style={styles.severityText}>{severityInfo?.label}</Text>
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              style={[commonStyles.input, styles.descriptionInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Décrivez le défaut observé..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <Pressable
            style={[
              buttonStyles.primary,
              styles.submitButton,
              (!selectedType || !location || submitting) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!selectedType || !location || submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Enregistrement...' : 'Enregistrer le signalement'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  locationContainer: {
    gap: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.success + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  locationText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  severityContainer: {
    marginBottom: 24,
  },
  severityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.surface,
  },
  descriptionInput: {
    height: 100,
    paddingTop: 16,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
