import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Modal,
  Portal,
  Button,
  TextInput,
  Title,
  List,
  IconButton,
  Chip,
} from 'react-native-paper';
import { useAppStore } from '../store/appStore';

interface CategoryManagerModalProps {
  visible: boolean;
  onDismiss: () => void;
}

const PRESET_COLORS = [
  '#4CAF50',
  '#2196F3',
  '#FF9800',
  '#9C27B0',
  '#E91E63',
  '#00BCD4',
  '#FF5722',
  '#607D8B',
];

export default function CategoryManagerModal({
  visible,
  onDismiss,
}: CategoryManagerModalProps) {
  const categories = useAppStore((state) => state.categories);
  const addCategory = useAppStore((state) => state.addCategory);
  const deleteCategory = useAppStore((state) => state.deleteCategory);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    addCategory({
      name: newCategoryName.trim(),
      color: selectedColor,
    });

    setNewCategoryName('');
    setSelectedColor(PRESET_COLORS[0]);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Title style={styles.title}>카테고리 관리</Title>

        <View style={styles.addSection}>
          <TextInput
            label="새 카테고리 이름"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            mode="outlined"
            style={styles.input}
          />

          <Title style={styles.colorTitle}>색상 선택</Title>
          <View style={styles.colorContainer}>
            {PRESET_COLORS.map((color) => (
              <Chip
                key={color}
                selected={selectedColor === color}
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.colorChip,
                  {
                    backgroundColor: color,
                    borderWidth: selectedColor === color ? 3 : 0,
                    borderColor: '#000',
                  },
                ]}
              >
                {' '}
              </Chip>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={handleAddCategory}
            disabled={!newCategoryName.trim()}
            style={styles.addButton}
          >
            추가
          </Button>
        </View>

        <Title style={styles.listTitle}>등록된 카테고리</Title>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              left={() => (
                <View
                  style={[styles.colorIndicator, { backgroundColor: item.color }]}
                />
              )}
              right={() => (
                <IconButton
                  icon="delete"
                  onPress={() => handleDeleteCategory(item.id)}
                />
              )}
            />
          )}
          style={styles.list}
        />

        <Button mode="outlined" onPress={onDismiss} style={styles.closeButton}>
          닫기
        </Button>
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
    maxHeight: '80%',
  },
  title: {
    marginBottom: 16,
    fontSize: 20,
  },
  addSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  input: {
    marginBottom: 12,
  },
  colorTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  colorChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  addButton: {
    marginTop: 8,
  },
  listTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  list: {
    maxHeight: 200,
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 16,
    marginTop: 8,
  },
  closeButton: {
    marginTop: 16,
  },
});
