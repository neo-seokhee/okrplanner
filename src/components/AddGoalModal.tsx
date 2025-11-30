import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Modal,
  Portal,
  Button,
  TextInput,
  Title,
  RadioButton,
  Chip,
} from 'react-native-paper';
import { useAppStore } from '../store/appStore';

interface AddGoalModalProps {
  visible: boolean;
  onDismiss: () => void;
  yearId: string;
}

export default function AddGoalModal({
  visible,
  onDismiss,
  yearId,
}: AddGoalModalProps) {
  const categories = useAppStore((state) => state.categories);
  const addGoal = useAppStore((state) => state.addGoal);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('');

  const handleSave = () => {
    if (!title.trim() || !selectedCategoryId) {
      return;
    }

    addGoal({
      yearId,
      categoryId: selectedCategoryId,
      title: title.trim(),
      description: description.trim(),
      targetValue: targetValue ? parseFloat(targetValue) : undefined,
      unit: unit.trim() || undefined,
      currentValue: 0,
      status: 'not_started',
    });

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedCategoryId('');
    setTargetValue('');
    setUnit('');
    onDismiss();
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setSelectedCategoryId('');
    setTargetValue('');
    setUnit('');
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modal}
      >
        <ScrollView>
          <Title style={styles.title}>새 목표 추가</Title>

          <TextInput
            label="목표 제목 *"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="목표 설명"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <Title style={styles.sectionTitle}>카테고리 선택 *</Title>
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                selected={selectedCategoryId === category.id}
                onPress={() => setSelectedCategoryId(category.id)}
                style={[
                  styles.categoryChip,
                  selectedCategoryId === category.id && {
                    backgroundColor: category.color,
                  },
                ]}
                textStyle={
                  selectedCategoryId === category.id && styles.selectedChipText
                }
              >
                {category.name}
              </Chip>
            ))}
          </View>

          <Title style={styles.sectionTitle}>목표 수치 (선택)</Title>
          <View style={styles.targetContainer}>
            <TextInput
              label="목표값"
              value={targetValue}
              onChangeText={setTargetValue}
              mode="outlined"
              keyboardType="numeric"
              style={styles.targetInput}
            />
            <TextInput
              label="단위"
              value={unit}
              onChangeText={setUnit}
              mode="outlined"
              style={styles.unitInput}
              placeholder="예: 권, 회, kg"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={handleCancel} style={styles.button}>
              취소
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.button}
              disabled={!title.trim() || !selectedCategoryId}
            >
              저장
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  title: {
    marginBottom: 16,
    fontSize: 20,
  },
  input: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  targetContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  targetInput: {
    flex: 2,
    marginRight: 8,
  },
  unitInput: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    marginLeft: 8,
  },
});
